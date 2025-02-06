import React, { useState } from "react";

import {
	Image,
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Text,
	Alert,
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
const baseUrl = "https://www.roomie.id/";

export default function LoginScreen() {
	const [username, onChangeUsername] = useState("");
	const [password, onChangePassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const onPress = () => {
		Alert.alert("Alert Title", "My Alert Msg", [
			{
				text: "Cancel",
				onPress: () => console.log("Cancel Pressed"),
				style: "cancel",
			},
			{ text: "OK", onPress: () => fetchData() },
		]);
	};

	const fetchData = async () => {
		try {
			const response = await axios.get(baseUrl + "teset");
			console.log(response.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
			headerImage={
				<Image
					source={require("@/assets/images/hero-carousel-3.jpg")}
					style={styles.reactLogo}
				/>
			}
		>
			<ThemedView style={styles.titleContainer}>
				<ThemedText type="title">About</ThemedText>
			</ThemedView>
			<ThemedText>
				This app includes example code to help you get started.
			</ThemedText>

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

			<TouchableOpacity style={styles.button} onPress={onPress}>
				<Text>Press Here</Text>
			</TouchableOpacity>
		</ParallaxScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 8,
		padding: 0,
		borderBottomWidth: 1,
	},
	headerImage: {
		color: "#808080",
		bottom: -90,
		left: -35,
		position: "absolute",
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
		height: 200,
		flex: 1,
		width: null,
		bottom: 0,
		left: 0,
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
