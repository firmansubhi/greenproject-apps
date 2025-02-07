import React, { useState } from "react";

import {
	Image,
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Text,
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import axios from "axios";
import { router, Link } from "expo-router";
import { baseUrl, showAlert } from "../utils";

export default function RegisterScreen() {
	const [firstname, onChangeFirstname] = useState("");
	const [lastname, onChangeLastname] = useState("");
	const [username, onChangeUsername] = useState("");
	const [email, onChangeEmail] = useState("");
	const [city, onChangeCity] = useState("");
	const [password, onChangePassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

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
				<ThemedText type="title">Join</ThemedText>
			</ThemedView>
			<ThemedText>Become a Part of Our Mission!</ThemedText>

			<TextInput
				style={styles.input}
				onChangeText={onChangeUsername}
				value={username}
				placeholder="User Name"
			/>

			<TextInput
				style={styles.input}
				onChangeText={onChangeFirstname}
				value={firstname}
				placeholder="First Name"
			/>

			<TextInput
				style={styles.input}
				onChangeText={onChangeLastname}
				value={lastname}
				placeholder="Last Name"
			/>

			<TextInput
				style={styles.input}
				onChangeText={onChangeEmail}
				value={email}
				placeholder="Email"
			/>

			<TextInput
				style={styles.input}
				onChangeText={onChangeCity}
				value={city}
				placeholder="City"
			/>

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
				<Text style={styles.buttonText}>Join</Text>
			</TouchableOpacity>

			<ThemedText onPress={() => router.replace("/login")} type="link">
				Already joined, click here
			</ThemedText>
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
