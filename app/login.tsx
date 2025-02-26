import React, { useState } from "react";
import {
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	SafeAreaView,
	Text,
	TouchableWithoutFeedback,
	Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView2 } from "@/components/ThemedView2";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { useSession } from "./ctx";
import { router } from "expo-router";
import { baseUrl, showAlert } from "../utils";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

const width = Dimensions.get("window").width;
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
						router.replace(`/verify/${error.response.data.email}`);
					}
				}
			});
	};

	return (
		<SafeAreaView style={styles.saveContainer}>
			<ThemedView2 style={styles.imageContainer}>
				<ThemedView2 style={styles.imageLogoContainer}>
					<Image
						style={styles.imageLogo}
						source={require("@/assets/images/icon.png")}
						contentFit="cover"
					/>
				</ThemedView2>
			</ThemedView2>

			<ThemedView2
				style={[
					{
						flex: 1,
						justifyContent: "flex-start",
						padding: 20,
						paddingTop: 80,

						flexDirection: "column",
						paddingBottom: 0,
					},
				]}
			></ThemedView2>

			<ThemedView2 style={[{ justifyContent: "flex-end" }]}>
				<View style={{ padding: 20 }}>
					<ThemedText>Username</ThemedText>
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
						<Text style={styles.buttonText}>Login</Text>
					</TouchableOpacity>

					<ThemedText
						onPress={() => router.replace("/register")}
						type="link"
					>
						Don't have account? Join here
					</ThemedText>
				</View>

				<Image
					style={[{ width: width, height: width * (361 / 400) }]}
					source={require("@/assets/images/hello.svg")}
					contentFit="cover"
				/>
			</ThemedView2>

			{/* <ThemedView2 style={styles.mainContainer}>
				<ThemedText type="title">Login</ThemedText>
				<ThemedText type="title">Login</ThemedText>
				<ThemedText type="title">Login</ThemedText>
				<ThemedText type="title">Login</ThemedText>
				<ThemedText type="title">Login</ThemedText>
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
					<Text style={styles.buttonText}>Login</Text>
				</TouchableOpacity>

				<ThemedText
					onPress={() => router.replace("/register")}
					type="link"
				>
					Don't have account? Join here
				</ThemedText>
			</ThemedView2> */}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	imageLogoContainer: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		height: 80,
		paddingTop: 10,
		marginBottom: 0,
		maxHeight: 80,
	},
	imageLogo: {
		width: 64,
		height: 64,
	},

	saveContainer: {
		flex: 1,
		backgroundColor: "green",
	},

	imageContainer: {
		height: 80,
	},
	mainContainer: {
		backgroundColor: "red",
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
		color: Colors.light.text2,
	},
	inputDark: {
		color: Colors.dark.text2,
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
