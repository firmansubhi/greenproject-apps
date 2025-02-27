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
import { Colors } from "@/constants/Colors";

type ItemProps = {
	id: string;
	name: string;
	price: number;
};

export default function ProductsScreen() {
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState("");

	const [confirmDelete, setConfirmDelete] = useState(false);
	const [modalId, setModalId] = useState("");
	const [modalTitle, setModalTitle] = useState("");
	const [data, setData] = useState([
		{
			id: "",
			name: "",
			price: 0,
		},
	]);

	const Item = memo(
		({ id, name, price }: ItemProps) => (
			<View style={[themeBG, styles.listItem]}>
				<View style={styles.textItem}>
					<ThemedText
						style={{
							fontWeight: "bold",
						}}
					>
						{name}
					</ThemedText>
					<ThemedText>{price}</ThemedText>
				</View>
				<TouchableOpacity
					onPress={() => deleteData(id, name)}
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
						pathname: "/product/[id]",
						params: { id: id },
					}}
				>
					<FontAwesome6 name="edit" size={16} color="green" />
				</Link>
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
		setConfirmDelete(true);
		setModalId(id.toString());
		setModalTitle(name);
	};

	const navigation = useNavigation();
	const focused = navigation.isFocused();
	const path = usePathname();

	useEffect(() => {
		if (path == "/products" && focused == true) {
			loadData();
		}
	}, [focused]);

	const loadData = async () => {
		setLoading(true);
		let token = await getToken();
		axios
			.get(baseUrl() + "product/all", {
				params: {
					name: name,
				},
				headers: {
					Authorization: "Bearer " + token,
				},
			})
			.then(function (response) {
				if (response.data.success == true) {
					setData(response.data.data.rows);
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
			.delete(baseUrl() + "product/" + modalId, {
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
					<ThemedText type="title">Product </ThemedText>
				</ThemedView>
				<ThemedText type="title2">Product management page</ThemedText>

				<View style={[themeBG, styles.containerSearch]}>
					<ThemedText type="subtitle">Search Form</ThemedText>
					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={setName}
						value={name}
						placeholder="Product Name"
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
						onPress={() => router.replace("/product/0")}
						type="link"
					>
						Create new Product
					</ThemedText>
				</View>
				<FlatList
					data={data}
					onRefresh={() => loadData()}
					refreshing={loading}
					renderItem={({ item }) => (
						<Item
							id={item.id}
							name={item.name}
							price={item.price}
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
		flexDirection: "row",
		borderRadius: 5,
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
