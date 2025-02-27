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
import { Image } from "expo-image";
import { Colors } from "@/constants/Colors";

type ItemProps = {
	id: string;
	categoryName: string;
	title: string;
	intro: string;
	publishDate: string;
	imageThumb: string;
};

export default function NewsadminScreen() {
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [confirm, setConfirm] = useState(false);
	const [confirmAction, setConfirmAction] = useState("");
	const [confirmMessage, setConfirmMessage] = useState("");
	const [modalId, setModalId] = useState("");
	const [totalPages, setTotalPages] = useState(0);
	const [data, setData] = useState([
		{
			id: "",
			categoryName: "",
			title: "",
			intro: "",
			publishDate: "",
			imageThumb: "",
		},
	]);

	const Item = memo(
		({
			id,
			categoryName,
			title,
			intro,
			publishDate,
			imageThumb,
		}: ItemProps) => (
			<View style={[themeBG, styles.listItem]}>
				<View style={styles.listTop}>
					<TouchableOpacity
						onPress={() => deleteData(id, title)}
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
							pathname: "/newsadm/[id]",
							params: { id: id },
						}}
					>
						<FontAwesome6 name="edit" size={16} color="green" />
					</Link>
				</View>

				<Image
					style={{ flex: 1, marginBottom: 0, height: 220 }}
					source={{ uri: imageThumb }}
					contentFit="cover"
				/>
				<View
					style={{
						flex: 1,
						flexDirection: "row",
					}}
				>
					<ThemedText style={{ fontWeight: "bold" }}>
						{title}
					</ThemedText>
				</View>
				<View>
					<ThemedText>{categoryName}</ThemedText>

					<ThemedText>{intro}</ThemedText>

					<View style={[styles.listFooter]}>
						<View style={styles.listFooterLeft}>
							<ThemedText>{publishDate}</ThemedText>
						</View>
						<View style={styles.listFooterRight}></View>
					</View>
				</View>
			</View>
		),
		(prevProps, nextProps) => {
			return prevProps.id === nextProps.id;
		}
	);

	const colorScheme = useColorScheme();

	const themeTextInput =
		colorScheme === "light" ? styles.inputLight : styles.inputDark;

	const themeBG = colorScheme === "light" ? styles.bgLight : styles.bgDark;

	const deleteData = async (id: string, name: string) => {
		setConfirm(true);
		setConfirmAction("delete");
		setModalId(id.toString());
		setConfirmMessage("Delete " + name + " ?");
	};

	const navigation = useNavigation();
	const focused = navigation.isFocused();
	const path = usePathname();

	useEffect(() => {
		if (path == "/newsadmin" && focused == true) {
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
			.get(baseUrl() + "newsadmin/all", {
				params: {
					title: title,
					content: content,
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

	const confirmPress = () => {
		if (confirmAction == "delete") {
			deleteRow();
		}
	};

	const deleteRow = async () => {
		setLoading(true);
		let token = await getToken();
		axios
			.delete(baseUrl() + "newsadmin/" + modalId, {
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
				setConfirm(false);
			});
	};

	return (
		<SafeAreaView style={styles.saveContainer}>
			<ThemedView style={styles.container}>
				<Modal
					animationType="fade"
					transparent={true}
					visible={confirm}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text style={styles.modalText}>
								{confirmMessage}
							</Text>
							<View style={styles.modalButtonView}>
								<Pressable
									style={[
										styles.buttonConfirm,
										styles.buttonContinue,
									]}
									onPress={() => confirmPress()}
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
									onPress={() => setConfirm(false)}
								>
									<Text style={styles.textStyle}>Cancel</Text>
								</Pressable>
							</View>
						</View>
					</View>
				</Modal>

				<ThemedView style={styles.titleContainer}>
					<ThemedText type="title">News</ThemedText>
				</ThemedView>
				<ThemedText type="title2">News adminstrator page</ThemedText>

				<View style={[themeBG, styles.containerSearch]}>
					<ThemedText type="subtitle">Search Form</ThemedText>
					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={setTitle}
						value={title}
						placeholder="Title"
						placeholderTextColor="#777"
					/>
					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={setContent}
						value={content}
						placeholder="Content"
						placeholderTextColor="#777"
					/>

					<View
						style={{
							flexDirection: "row",
						}}
					>
						<View
							style={{
								flex: 1,
								paddingRight: 5,
							}}
						>
							<TouchableOpacity
								disabled={loading}
								style={styles.button}
								onPress={loadData}
							>
								<Text style={styles.buttonText}>Search</Text>
							</TouchableOpacity>
						</View>
						<View
							style={{
								flex: 1,
								paddingLeft: 5,
							}}
						>
							<TouchableOpacity
								style={styles.button}
								onPress={() => router.replace("/newsadm/0")}
							>
								<Text style={styles.buttonText}>
									Create News
								</Text>
							</TouchableOpacity>
						</View>
					</View>
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
							categoryName={item.categoryName}
							title={item.title}
							intro={item.intro}
							publishDate={item.publishDate}
							imageThumb={item.imageThumb}
						/>
					)}
					keyExtractor={(item) => item.id}
				/>
			</ThemedView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	bgLight: {
		backgroundColor: Colors.light.background2,
	},
	bgDark: { backgroundColor: Colors.dark.background2 },
	listTop: {
		flex: 1,
		flexDirection: "row-reverse",
		borderBottomColor: "#efefef",
		borderBottomWidth: 1,
		paddingBottom: 5,
	},

	listFooter: {
		flexDirection: "row",
	},

	listFooterLeft: {
		flex: 2,
		justifyContent: "flex-end",
	},

	listFooterRight: {
		flex: 1,
		flexDirection: "row-reverse",
	},
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

	grey: {
		color: "#aaa",
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
		marginTop: 20,
		padding: 20,
		borderRadius: 20,
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
		marginTop: 5,
		padding: 10,
		shadowColor: "rgba(0,0,0, .4)", // IOS
		shadowOffset: { height: 1, width: 1 }, // IOS
		shadowOpacity: 1, // IOS
		shadowRadius: 1, //IOS
		backgroundColor: "#374982",
		elevation: 2, // Android
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		borderRadius: 20,
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
		//flexDirection: "column",
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
