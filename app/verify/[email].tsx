import React, { useState, useEffect } from "react";

import {
	Image,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Text,
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { baseUrl, showAlert } from "../../utils";

export default function VerifyScreen() {
	const [mailkey, setMailkey] = useState("");
	const [message, setMessage] = useState("Please wait... sending email");
	const [loading, setLoading] = useState(false);

	const local = useLocalSearchParams();

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
				<ThemedText type="title">Verification</ThemedText>
			</ThemedView>
			<ThemedText>{message}</ThemedText>

			<TextInput
				style={styles.input}
				onChangeText={setMailkey}
				value={mailkey}
				placeholder="Your code"
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
		borderColor: "#bbb",
	},

	titleContainer: {
		flexDirection: "row",
		gap: 8,
	},

	input: {
		height: 40,
		margin: 5,
		padding: 10,
		flex: 1,
		borderBottomWidth: 1,
		borderColor: "#bbb",
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
});
