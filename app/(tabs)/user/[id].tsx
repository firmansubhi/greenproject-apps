import React, { useState, useEffect } from "react";

import {
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Text,
	SafeAreaView,
	ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";

import axios from "axios";
import { router, Link, useLocalSearchParams } from "expo-router";
import { baseUrl, showAlert, getToken } from "../../../utils";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function RegisterScreen() {
	const [role, setRole] = useState("");
	const [username, setUsername] = useState("");
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [city, setCity] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const { id } = useLocalSearchParams();

	const colorScheme = useColorScheme();
	const themeTextInput =
		colorScheme === "light" ? styles.inputLight : styles.inputDark;
	const themeTextSelect =
		colorScheme === "light" ? styles.selectLight : styles.selectDark;

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	useEffect(() => {
		if (id != "0") {
			loadData(id);
		} else {
			setRole("");
			setUsername("");
			setFirstname("");
			setLastname("");
			setEmail("");
			setCity("");
			setPassword("");
		}
	}, [id]);

	const loadData = async (id: any) => {
		setLoading(true);
		let token = await getToken();
		axios
			.get(baseUrl() + "users/" + id, {
				headers: {
					Authorization: "Bearer " + token,
				},
			})
			.then(function (response) {
				if (response.data.success == true) {
					setUsername(response.data.data.username);
					setFirstname(response.data.data.firstname);
					setLastname(response.data.data.lastname);
					setEmail(response.data.data.email);
					setCity(response.data.data.city);
					setRole(response.data.data.role);
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

	const onPress = async () => {
		setLoading(true);
		let token = await getToken();

		let uri = "users/edit";
		if (id == "0") {
			uri = "users/add";
		}

		axios
			.post(
				baseUrl() + uri,
				{
					_id: id,
					firstname: firstname,
					lastname: lastname,
					username: username,
					email: email,
					city: city,
					role: role,
					password: password,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + token,
					},
				}
			)
			.then(async function (response) {
				if (response.data.success == true) {
					router.replace("/users");
				} else {
					showAlert("Failed", response.data.message);
				}

				setLoading(false);
			})
			.catch(function (error) {
				setLoading(false);
				if (error.response) {
					showAlert("Failed", error.response.data.message);
				}
			});
	};

	return (
		<SafeAreaView style={styles.saveContainer}>
			<ScrollView>
				<ThemedView style={styles.mainContainer}>
					<ThemedText type="title">Users Form</ThemedText>
					<ThemedText>Update user data</ThemedText>

					<Picker
						accessibilityLabel="Basic Picker Accessibility Label"
						selectedValue={role}
						style={[themeTextSelect]}
						onValueChange={(itemValue, itemIndex) => {
							if (itemIndex > 0) {
								setRole(itemValue);
							} else {
								setRole("");
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

					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={setUsername}
						value={username}
						placeholder="User Name"
						placeholderTextColor="#777"
					/>

					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={setFirstname}
						value={firstname}
						placeholder="First Name"
						placeholderTextColor="#777"
					/>

					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={setLastname}
						value={lastname}
						placeholder="Last Name"
						placeholderTextColor="#777"
					/>

					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={setEmail}
						value={email}
						placeholder="Email"
						placeholderTextColor="#777"
					/>

					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={setCity}
						value={city}
						placeholder="City"
						placeholderTextColor="#777"
					/>

					<View style={styles.container}>
						<TextInput
							style={[styles.inputPass, themeTextInput]}
							onChangeText={setPassword}
							value={password}
							placeholder="Password"
							placeholderTextColor="#777"
							secureTextEntry={!showPassword}
						/>
						<Ionicons
							size={24}
							name={showPassword ? "eye-off" : "eye"}
							color="#aaa"
							style={styles.icon}
							onPress={toggleShowPassword}
						/>
					</View>
					<TouchableOpacity
						disabled={loading}
						style={styles.button}
						onPress={onPress}
					>
						<Text style={styles.buttonText}>Save</Text>
					</TouchableOpacity>
				</ThemedView>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	saveContainer: {
		flex: 1,
	},

	imageContainer: {
		flex: 1,
		flexDirection: "row",
		maxHeight: 200,
	},
	mainContainer: {
		padding: 30,
		flex: 1,
		flexDirection: "column",
	},

	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		borderBottomWidth: 1,
		borderColor: "#ccc",
		marginBottom: 20,
	},

	titleContainer: {
		flexDirection: "row",
		gap: 8,
	},

	input: {
		height: 40,
		margin: 5,
		padding: 10,
		borderBottomWidth: 1,
		borderColor: "#ccc",
	},

	inputLight: {
		color: "#000",
	},
	inputDark: {
		color: "#fff",
	},

	selectLight: {
		color: "black",
	},

	selectDark: {
		color: "white",
	},

	inputPass: {
		height: 40,
		margin: 5,
		padding: 10,
		flex: 1,
	},
	reactLogo: {
		height: 10,
		flex: 1,
		width: null,
	},

	icon: {
		marginLeft: 10,
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
	image: {
		flex: 1,
		maxHeight: 200,
		marginBottom: 20,
	},
});
