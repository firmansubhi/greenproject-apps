import React, { useState } from "react";

import {
	Image,
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Text,
	Platform,
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
const baseUrl = "https://tempdev2.roomie.id/";
import { useSession } from "./ctx";
import { router } from "expo-router";

import { getToken, showAlert } from "../utils";

export default function LoginScreen() {
	const { signIn } = useSession();
	const [username, onChangeUsername] = useState("");
	const [password, onChangePassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const onPress = async () => {
		setLoading(true);
		axios
			.post(baseUrl + "auth/login", {
				username: username,
				password: password,
			})
			.then(async function (response) {
				if (response.data.success == true) {
					//typeAuth
					signIn(username, response.data.token);

					if (Platform.OS === "web") {
					} else {
						await SecureStore.setItemAsync(
							"token",
							response.data.token
						);
					}

					router.replace("/");
				} else {
					alert(response.data.message);
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

	const onPress2 = async () => {
		let token = await getToken();
		showAlert("Failed", token);
	};

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
			headerImage={
				<Image
					source={require("@/assets/images/hero-carousel-3b.jpg")}
					style={styles.reactLogo}
				/>
			}
		>
			<ThemedView style={styles.titleContainer}>
				<ThemedText type="title">Login</ThemedText>
			</ThemedView>
			<ThemedText>Enter your user name and password.</ThemedText>

			<View style={styles.container}>
				<TextInput
					style={styles.input}
					onChangeText={onChangeUsername}
					value={username}
					placeholder="User Name"
				/>
			</View>
			<View style={styles.container}>
				<TextInput
					style={styles.inputPass}
					onChangeText={onChangePassword}
					value={password}
					placeholder="Password"
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
				<Text>Press Here</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.button} onPress={onPress2}>
				<Text>Press cek</Text>
			</TouchableOpacity>
		</ParallaxScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		borderBottomWidth: 1,
	},

	titleContainer: {
		flexDirection: "row",
		gap: 8,
	},

	input: {
		height: 40,
		margin: 12,
		padding: 0,
		flex: 1,
	},
	inputPass: {
		height: 40,
		margin: 12,
		padding: 0,
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
		alignItems: "center",
		backgroundColor: "#DDDDDD",
		padding: 10,
	},
});
