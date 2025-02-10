import React, { useState, useEffect } from "react";

import {
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Text,
	SafeAreaView,
} from "react-native";
import { Image } from "expo-image";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { baseUrl, showAlert } from "../../utils";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function VerifyScreen() {
	const [mailkey, setMailkey] = useState("");
	const [message, setMessage] = useState("Please wait... sending email");
	const [loading, setLoading] = useState(false);

	const local = useLocalSearchParams();
	const colorScheme = useColorScheme();
	const themeTextInput =
		colorScheme === "light" ? styles.inputLight : styles.inputDark;

	useEffect(() => {
		sendCode();
	}, []);

	const sendCode = () => {
		setLoading(true);
		axios
			.post(baseUrl() + "auth/send-verification", {
				email: local.email,
			})
			.then(async function (response) {
				if (response.data.success == true) {
					showAlert("Code Sent", response.data.message);
				} else {
					showAlert("Failed", response.data.message);
				}

				setMessage(response.data.message);

				setLoading(false);
			})
			.catch(function (error) {
				setLoading(false);
				if (error.response) {
					showAlert("Failed", error.response.data.message);
				}
			});
	};

	const onPress = async () => {
		setLoading(true);
		axios
			.post(baseUrl() + "auth/verify-code", {
				email: local.email,
				code: mailkey,
			})
			.then(async function (response) {
				if (response.data.success == true) {
					showAlert("Success", response.data.message);
					router.replace("/login");
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
				<Image
					style={styles.image}
					source={require("@/assets/images/hero-carousel-3b.jpg")}
					contentFit="cover"
				/>
			</ThemedView>

			<ThemedView style={styles.mainContainer}>
				<ThemedText type="title">Verification</ThemedText>

				<ThemedText>{message}</ThemedText>

				<TextInput
					style={[styles.input, themeTextInput]}
					onChangeText={setMailkey}
					value={mailkey}
					placeholder="Your code"
					placeholderTextColor="#777"
				/>

				<TouchableOpacity
					disabled={loading}
					style={styles.button}
					onPress={onPress}
				>
					<Text style={styles.buttonText}>Verify Code</Text>
				</TouchableOpacity>

				{!loading && (
					<ThemedText onPress={() => sendCode()} type="link">
						Resend Code
					</ThemedText>
				)}
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
	},
});
