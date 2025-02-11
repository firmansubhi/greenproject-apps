import React, { useState, useEffect } from "react";
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
	userid: string;
	username: string;
	email: string;
	name: string;
	city: string;
	role: string;
};

export default function UsersScreen() {
	const [loading, setLoading] = useState(false);
	const [email, onChangeEmail] = useState("");
	const [usergroup, setUsergroup] = useState("");
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [modalId, setModalId] = useState("");
	const [modalTitle, setModalTitle] = useState("");
	const [data, setData] = useState([
		{
			userid: "",
			username: "",
			email: "",
			name: "",
			city: "",
			role: "",
		},
	]);

	const Item = ({ userid, username, email, name, city, role }: ItemProps) => (
		<View style={styles.listItem}>
			<View style={styles.textItem}>
				<ThemedText style={{ fontWeight: "bold" }}>{name}</ThemedText>
				<ThemedText>{email}</ThemedText>
				<ThemedText>Username : {username}</ThemedText>
				<ThemedText>City : {city}</ThemedText>
			</View>
			<TouchableOpacity
				onPress={() => deleteData(userid, name)}
				style={{
					height: 50,
					width: 100,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<FontAwesome6 name="trash-can" size={16} color="green" />
			</TouchableOpacity>

			<Link
				href={{
					pathname: "/user/[id]",
					params: { id: userid },
				}}
			>
				<FontAwesome6 name="edit" size={16} color="green" />
			</Link>
			{/*<TouchableOpacity
				style={{
					height: 50,
					width: 25,
					justifyContent: "center",
					alignItems: "center",
				}}
			></TouchableOpacity>*/}
		</View>
	);

	const colorScheme = useColorScheme();
	const themeTextInput =
		colorScheme === "light" ? styles.inputLight : styles.inputDark;

	const deleteData = async (id: string, name: string) => {
		setConfirmDelete(true);
		setModalId(id);
		setModalTitle(name);
	};

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		setLoading(true);
		let token = await getToken();
		axios
			.get(baseUrl() + "users/showall", {
				params: {
					email: email,
					role: usergroup,
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
			.delete(baseUrl() + "users/" + modalId, {
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
					<ThemedText type="title">Users</ThemedText>
				</ThemedView>
				<ThemedText>Users management page</ThemedText>

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
						// style={[styles.inputSelect, themeTextInput]}
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
					onRefresh={() => loadData()}
					refreshing={loading}
					renderItem={({ item }) => (
						<Item
							userid={item.userid}
							username={item.username}
							email={item.email}
							name={item.name}
							city={item.city}
							role={item.role}
						/>
					)}
					keyExtractor={(item) => item.email}
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

	inputSelect: {
		borderBottomWidth: 1,
		borderColor: "#ccc",
		height: 50,
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

	listItem: {
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
