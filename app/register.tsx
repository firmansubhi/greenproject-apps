import React, { useState } from "react";

import {
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Text,
	SafeAreaView,
	TouchableWithoutFeedback,
} from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import axios from "axios";
import { router, Link } from "expo-router";
import { baseUrl, showAlert } from "../utils";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function RegisterScreen() {
	const [firstname, onChangeFirstname] = useState("");
	const [lastname, onChangeLastname] = useState("");
	const [username, onChangeUsername] = useState("");
	const [email, onChangeEmail] = useState("");
	const [city, onChangeCity] = useState("");
	const [password, onChangePassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const colorScheme = useColorScheme();
	const themeTextInput =
		colorScheme === "light" ? styles.inputLight : styles.inputDark;

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const onPress = async () => {
		setLoading(true);
		axios
			.post(baseUrl() + "auth/join", {
				firstname: firstname,
				lastname: lastname,
				username: username,
				email: email,
				city: city,
				password: password,
			})
			.then(async function (response) {
				if (response.data.success == true) {
					router.replace("/verify/" + email);
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
			<ThemedView style={styles.imageContainer}>
				<TouchableWithoutFeedback
					onPress={() => router.replace("/home")}
				>
					<Image
						style={styles.image}
						source={require("@/assets/images/hero-carousel-3b.jpg")}
						contentFit="cover"
					/>
				</TouchableWithoutFeedback>
			</ThemedView>

			<ThemedView style={styles.mainContainer}>
				<ThemedText type="title">Join</ThemedText>
				<ThemedText>Become a Part of Our Mission!</ThemedText>

				<TextInput
					style={[styles.input, themeTextInput]}
					onChangeText={onChangeUsername}
					value={username}
					placeholder="User Name"
					placeholderTextColor="#777"
				/>

				<TextInput
					style={[styles.input, themeTextInput]}
					onChangeText={onChangeFirstname}
					value={firstname}
					placeholder="First Name"
					placeholderTextColor="#777"
				/>

				<TextInput
					style={[styles.input, themeTextInput]}
					onChangeText={onChangeLastname}
					value={lastname}
					placeholder="Last Name"
					placeholderTextColor="#777"
				/>

				<TextInput
					style={[styles.input, themeTextInput]}
					onChangeText={onChangeEmail}
					value={email}
					placeholder="Email"
					placeholderTextColor="#777"
				/>

				<TextInput
					style={[styles.input, themeTextInput]}
					onChangeText={onChangeCity}
					value={city}
					placeholder="City"
					placeholderTextColor="#777"
				/>

				<View style={styles.container}>
					<TextInput
						style={[styles.inputPass, themeTextInput]}
						onChangeText={onChangePassword}
						value={password}
						placeholder="Password"
						placeholderTextColor="#777"
						secureTextEntry={!showPassword}
					/>
					<MaterialCommunityIcons
						name={showPassword ? "eye-off" : "eye"}
						size={24}
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
					<Text style={styles.buttonText}>Join</Text>
				</TouchableOpacity>

				<ThemedText
					onPress={() => router.replace("/login")}
					type="link"
				>
					Already joined, click here
				</ThemedText>
			</ThemedView>
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
