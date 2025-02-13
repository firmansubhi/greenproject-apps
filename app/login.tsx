import React, { useState } from "react";
import {
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	SafeAreaView,
	Text,
	TouchableWithoutFeedback,
} from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { useSession } from "./ctx";
import { router } from "expo-router";
import { baseUrl, showAlert } from "../utils";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Link } from "expo-router";

export default function LoginScreen() {
	const { signIn } = useSession();
	const [username, onChangeUsername] = useState("");
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
			.post(baseUrl() + "auth/login", {
				username: username,
				password: password,
			})
			.then(async function (response) {
				if (response.data.success == true) {
					signIn(username, response.data.role, response.data.token);
					router.replace("/");
				} else {
					showAlert("Failed", response.data.message);
				}

				setLoading(false);
			})
			.catch(function (error) {
				setLoading(false);
				if (error.response) {
					let msg = error.response.data.message;
					showAlert("Failed", msg);
					if (error.response.data.message == "unverified") {
						router.replace("/verify/" + error.response.data.email);
					}
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
				<ThemedText type="title">Login</ThemedText>

				<TextInput
					style={[styles.input, themeTextInput]}
					onChangeText={onChangeUsername}
					value={username}
					placeholder="User Name"
					placeholderTextColor="#777"
				/>

				<View style={styles.container}>
					<TextInput
						style={[styles.inputPass, themeTextInput]}
						onChangeText={onChangePassword}
						value={password}
						placeholder="Passwords"
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
					<Text style={styles.buttonText}>Login</Text>
				</TouchableOpacity>

				<ThemedText
					onPress={() => router.replace("/register")}
					type="link"
				>
					Don't have account? Join here
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
		height: 200,
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
	icon: {
		marginLeft: 10,
	},
	button: {
		marginTop: 20,
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
		height: 200,
	},
});
