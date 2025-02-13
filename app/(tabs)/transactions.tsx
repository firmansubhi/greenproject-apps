import React, { useState, useEffect, memo } from "react";
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	TextInput,
	TouchableOpacity,
	Modal,
	Pressable,
	SafeAreaView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import axios from "axios";
import { baseUrl, showAlert, getToken } from "../../utils";
import { Link } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router, useNavigation, usePathname } from "expo-router";

type ItemProps = {
	id: string;
	sid: string;
	transID: string;
	sellerName: string;
	receiverName: string;
	buyerName: string;
	productName: string;
	weight: number;
	amount: number;
	status: string;
	createdAt: string;
};

export default function TransactionsScreen() {
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [sellerUsername, setSellerUsername] = useState("");
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [modalId, setModalId] = useState("");
	const [modalTitle, setModalTitle] = useState("");
	const [totalPages, setTotalPages] = useState(0);
	const [data, setData] = useState([
		{
			id: "",
			sid: "",
			transID: "",
			sellerName: "",
			receiverName: "",
			buyerName: "",
			productName: "",
			weight: 0,
			amount: 0,
			status: "",
			createdAt: "",
		},
	]);

	const Item = memo(
		({
			id,
			sid,
			transID,
			sellerName,
			receiverName,
			buyerName,
			productName,
			weight,
			amount,
			status,
			createdAt,
		}: ItemProps) => (
			<View
				style={[
					styles.shadows,
					{
						padding: 20,
						margin: 10,
						width: "100%",
						//flex: 1,
						alignSelf: "center",
						//flexDirection: "column",
						borderRadius: 2,
					},
				]}
			>
				<View
					style={{
						flex: 1,
						flexDirection: "row-reverse",
						borderBottomColor: "#efefef",
						borderBottomWidth: 1,
						paddingBottom: 5,
					}}
				>
					<TouchableOpacity
						onPress={() => deleteData(id, transID)}
						style={{
							width: 50,
							justifyContent: "flex-end",
							alignItems: "flex-end",
						}}
					>
						<FontAwesome6
							name="trash-can"
							size={16}
							color="green"
						/>
					</TouchableOpacity>

					<Link
						href={{
							pathname: "/transaction/[id]",
							params: { id: id },
						}}
					>
						<FontAwesome6 name="edit" size={16} color="green" />
					</Link>
				</View>
				<View
					style={{
						flex: 1,
						flexDirection: "row",
					}}
				>
					<ThemedText style={{ fontWeight: "bold" }}>
						{transID}
					</ThemedText>
				</View>
				<View>
					<View style={styles.subtitle}>
						<View style={styles.subtitleLeft}>
							<ThemedText>Seller</ThemedText>
						</View>
						<View style={styles.subtitleRight}>
							<ThemedText>{sellerName}</ThemedText>
						</View>
					</View>

					<View style={styles.subtitle}>
						<View style={styles.subtitleLeft}>
							<ThemedText>Receiver</ThemedText>
						</View>
						<View style={styles.subtitleRight}>
							<ThemedText>{receiverName}</ThemedText>
						</View>
					</View>

					<View style={styles.subtitle}>
						<View style={styles.subtitleLeft}>
							<ThemedText>Buyer</ThemedText>
						</View>
						<View style={styles.subtitleRight}>
							<ThemedText>{buyerName}</ThemedText>
						</View>
					</View>

					<View style={styles.subtitle}>
						<View style={styles.subtitleLeft}>
							<ThemedText>Product</ThemedText>
						</View>
						<View style={styles.subtitleRight}>
							<ThemedText>
								{productName} {weight}gr
							</ThemedText>
						</View>
					</View>

					<View style={styles.subtitle}>
						<View style={styles.subtitleLeft}>
							<ThemedText>Price</ThemedText>
						</View>
						<View style={styles.subtitleRight}>
							<ThemedText>{amount}</ThemedText>
						</View>
					</View>
					<View style={styles.subtitle}>
						<View style={styles.subtitleLeft}>
							<ThemedText>Status</ThemedText>
						</View>
						<View style={styles.subtitleRight}>
							<ThemedText>{status}</ThemedText>
						</View>
					</View>

					<ThemedText style={{ paddingTop: 20 }}>
						{createdAt}
					</ThemedText>
				</View>
			</View>
		),
		(prevProps, nextProps) => {
			return prevProps.sid === nextProps.sid;
		}
	);

	const colorScheme = useColorScheme();

	const themeTextInput =
		colorScheme === "light" ? styles.inputLight : styles.inputDark;

	const deleteData = async (id: string, name: string) => {
		setConfirmDelete(true);
		setModalId(id.toString());
		setModalTitle(name);
	};

	const navigation = useNavigation();
	const focused = navigation.isFocused();
	const path = usePathname();

	useEffect(() => {
		if (path == "/transactions" && focused == true) {
			loadData();
		}
	}, [focused]);

	const refreshData = () => {
		setPage(1);
		loadData();
	};

	const moreData = () => {
		if (page + 1 <= totalPages) {
			setPage(page + 1);
		}
	};

	const renderFooter = () => (
		<View style={{ justifyContent: "center", alignItems: "center" }}>
			{page == totalPages && <Text>all data has been displayed</Text>}
		</View>
	);

	const loadData = async () => {
		setLoading(true);
		let token = await getToken();
		axios
			.get(baseUrl() + "transactions/all", {
				params: {
					sellerUsername: sellerUsername,
					page: page,
				},
				headers: {
					Authorization: "Bearer " + token,
				},
			})
			.then(function (response) {
				if (response.data.success == true) {
					setTotalPages(response.data.data.totalPages);

					if (page == 1) {
						setData(response.data.data.rows);
					} else {
						setData([...data, ...response.data.data.rows]);
					}
				} else {
					showAlert("Failed", response.data.message);
				}
			})
			.catch(function (error) {
				if (error.response) {
					showAlert("Failed", error.response.data.message);
				}
			})
			.finally(function () {
				setLoading(false);
			});
	};

	const deleteRow = async () => {
		setLoading(true);
		let token = await getToken();
		axios
			.delete(baseUrl() + "transactions/" + modalId, {
				headers: {
					Authorization: "Bearer " + token,
				},
			})
			.then(function (response) {
				if (response.data.success == true) {
					loadData();
				} else {
					showAlert("Failed", response.data.message);
				}
			})
			.catch(function (error) {
				if (error.response) {
					showAlert("Failed", error.response.data.message);
				}
			})
			.finally(function () {
				setLoading(false);
				setConfirmDelete(false);
			});
	};

	return (
		<SafeAreaView style={styles.saveContainer}>
			<ThemedView style={styles.container}>
				<Modal
					animationType="fade"
					transparent={true}
					visible={confirmDelete}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text style={styles.modalText}>
								Delete {modalTitle} ?
							</Text>
							<View style={styles.modalButtonView}>
								<Pressable
									style={[
										styles.buttonConfirm,
										styles.buttonContinue,
									]}
									onPress={() => deleteRow()}
								>
									<Text style={styles.textStyle}>
										Continue
									</Text>
								</Pressable>
								<Pressable
									style={[
										styles.buttonConfirm,
										styles.buttonClose,
									]}
									onPress={() => setConfirmDelete(false)}
								>
									<Text style={styles.textStyle}>Cancel</Text>
								</Pressable>
							</View>
						</View>
					</View>
				</Modal>

				<ThemedView style={styles.titleContainer}>
					<ThemedText type="title">Transaction</ThemedText>
				</ThemedView>
				<ThemedText>Transaction management page</ThemedText>

				<View style={styles.containerSearch}>
					<ThemedText type="subtitle">Search Form</ThemedText>
					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={setSellerUsername}
						value={sellerUsername}
						placeholder="Seller User Name"
						placeholderTextColor="#777"
					/>

					<TouchableOpacity
						disabled={loading}
						style={styles.button}
						onPress={loadData}
					>
						<Text style={styles.buttonText}>Search</Text>
					</TouchableOpacity>

					<ThemedText
						onPress={() => router.replace("/transaction/0")}
						type="link"
					>
						Create New Transaction
					</ThemedText>
				</View>
				<FlatList
					data={data}
					ListFooterComponent={renderFooter}
					onEndReachedThreshold={0.1}
					onEndReached={moreData}
					onRefresh={refreshData}
					refreshing={loading}
					renderItem={({ item }) => (
						<Item
							id={item.id}
							sid={item.sid}
							transID={item.transID}
							sellerName={item.sellerName}
							receiverName={item.receiverName}
							buyerName={item.buyerName}
							productName={item.productName}
							weight={item.weight}
							amount={item.amount}
							status={item.status}
							createdAt={item.createdAt}
						/>
					)}
					keyExtractor={(item) => item.sid}
				/>
			</ThemedView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	subtitle: {
		flex: 1,
		flexDirection: "row",
	},

	subtitleLeft: {
		flex: 1,
	},
	subtitleRight: {
		flex: 3,
	},

	saveContainer: {
		flex: 1,
	},

	mainContainer: {
		padding: 30,
		flex: 1,
		flexDirection: "column",
	},

	container: {
		flex: 1,
		justifyContent: "center",

		padding: 15,
	},

	titleContainer: {
		//flexDirection: "column",
		//gap: 8,
	},

	containerSearch: {
		paddingTop: 20,
		paddingBottom: 5,
	},
	input: {
		height: 40,
		margin: 5,
		padding: 10,
		borderBottomWidth: 1,
		borderColor: "#ccc",
	},

	selectLight: {
		color: "black",
	},

	selectDark: {
		backgroundColor: "black",
		color: "white",
	},

	inputLight: {
		color: "#000",
	},
	inputDark: {
		color: "#fff",
	},

	button: {
		padding: 10,
		shadowColor: "rgba(0,0,0, .4)", // IOS
		shadowOffset: { height: 1, width: 1 }, // IOS
		shadowOpacity: 1, // IOS
		shadowRadius: 1, //IOS
		backgroundColor: "#198754",
		elevation: 2, // Android
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		borderRadius: 5,
	},
	buttonText: {
		color: "white",
	},

	shadows: {
		elevation: 5,
		shadowColor: "#ccc",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
	},

	listItem: {
		padding: 20,
		margin: 10,
		width: "100%",
		//flex: 1,
		alignSelf: "center",
		flexDirection: "row",
		borderRadius: 2,
	},
	textItem: { flex: 1 },

	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 5,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,

		justifyContent: "center",
		flexDirection: "column",
	},

	modalButtonView: {
		justifyContent: "center",
		flexDirection: "row",
	},
	buttonConfirm: {
		borderRadius: 5,
		padding: 10,
		margin: 10,
		elevation: 2,
	},

	buttonClose: {
		backgroundColor: "#aaa",
	},
	buttonContinue: {
		backgroundColor: "red",
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
	},
});
