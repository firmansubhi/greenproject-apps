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
import { Picker } from "@react-native-picker/picker";
import { Link } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";

type ItemProps = {
	productid: number;
	sid: string;
	tipe: string;
	headline: string;
	price: number;
};

export default function TransactionsScreen() {
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [email, onChangeEmail] = useState("");
	const [usergroup, setUsergroup] = useState("");
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [modalId, setModalId] = useState("");
	const [modalTitle, setModalTitle] = useState("");
	const [data, setData] = useState([
		{
			productid: 0,
			sid: "",
			tipe: "",
			headline: "",
			price: 0,
		},
	]);

	const Item = memo(
		({ productid, tipe, headline, price }: ItemProps) => (
			<View style={[styles.listItem, styles.shadows]}>
				<View style={styles.textItem}>
					<ThemedText style={{ fontWeight: "bold" }}>
						{headline}
					</ThemedText>
					<ThemedText>{tipe}</ThemedText>
					<ThemedText>Username : {productid}</ThemedText>
					<ThemedText>City : {price}</ThemedText>
				</View>
				<TouchableOpacity
					onPress={() => deleteData(productid, headline)}
					style={{
						height: 50,
						width: 100,
						justifyContent: "flex-start",
						alignItems: "center",
					}}
				>
					<FontAwesome6 name="trash-can" size={16} color="green" />
				</TouchableOpacity>

				<Link
					href={{
						pathname: "/user/[id]",
						params: { id: productid },
					}}
				>
					<FontAwesome6 name="edit" size={16} color="green" />
				</Link>
			</View>
		),
		(prevProps, nextProps) => {
			return prevProps.productid === nextProps.productid;
		}
	);

	const colorScheme = useColorScheme();
	const themeTextSelect =
		colorScheme === "light" ? styles.selectLight : styles.selectDark;
	const themeTextInput =
		colorScheme === "light" ? styles.inputLight : styles.inputDark;

	const deleteData = async (id: number, name: string) => {
		setConfirmDelete(true);
		setModalId(id.toString());
		setModalTitle(name);
	};

	useEffect(() => {}, []);

	useEffect(() => {
		loadData();
	}, [page]);

	const refreshData = () => {
		setPage(1);
	};

	const moreData = () => {
		setPage(page + 1);
	};

	const loadData = async () => {
		setLoading(true);
		let token = await getToken();
		axios
			.get(baseUrl() + "listing/listing", {
				params: {
					page: page,
				},
				headers: {
					Authorization: "Bearer " + token,
				},
			})
			.then(function (response) {
				if (response.data.success == true) {
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
		//
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
					<ThemedText type="title">Product</ThemedText>
				</ThemedView>
				<ThemedText>Product management page</ThemedText>

				<View style={styles.containerSearch}>
					<ThemedText type="subtitle">Search Form</ThemedText>
					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={onChangeEmail}
						value={email}
						placeholder="Email"
						placeholderTextColor="#777"
					/>
					<Picker
						selectedValue={usergroup}
						style={[themeTextSelect]}
						onValueChange={(itemValue, itemIndex) => {
							if (itemIndex > 0) {
								setUsergroup(itemValue);
							} else {
								setUsergroup("");
							}
						}}
					>
						<Picker.Item label="All Group" value="-" />
						<Picker.Item label="Seller" value="seller" />
						<Picker.Item label="Receiver" value="receiver" />
						<Picker.Item label="Buyer" value="buyer" />
						<Picker.Item
							label="Administrator"
							value="administrator"
						/>
					</Picker>

					<TouchableOpacity
						disabled={loading}
						style={styles.button}
						onPress={loadData}
					>
						<Text style={styles.buttonText}>Search</Text>
					</TouchableOpacity>

					<ThemedText
						onPress={() => router.replace("/user/0")}
						type="link"
					>
						Create new user
					</ThemedText>
				</View>
				<FlatList
					data={data}
					onEndReachedThreshold={0.1}
					onEndReached={moreData}
					onRefresh={refreshData}
					refreshing={loading}
					renderItem={({ item }) => (
						<Item
							productid={item.productid}
							sid={item.sid}
							tipe={item.tipe}
							headline={item.headline}
							price={item.price}
						/>
					)}
					keyExtractor={(item) => item.sid}
				/>
			</ThemedView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
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
