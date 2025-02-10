import React, { useState } from "react";
import {
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	SafeAreaView,
	Text,
	ScrollView,
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

export default function homeScreen() {
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

	return (
		<SafeAreaView style={styles.saveContainer}>
			<ScrollView>
				<ThemedView style={styles.imageContainer}>
					<Image
						style={styles.image}
						source={require("@/assets/images/hero-carousel-3b.jpg")}
						contentFit="cover"
					/>
				</ThemedView>
				<ThemedView style={styles.mainContainer}>
					<ThemedText
						type="title"
						style={{
							textAlign: "center",
						}}
					>
						Green Project
					</ThemedText>
					<ThemedText
						style={{
							textAlign: "center",
						}}
					>
						Lets save our earth
					</ThemedText>

					<View
						style={[
							styles.container1,
							{
								flexDirection: "row",
							},
						]}
					>
						<View style={[styles.icon1]}>
							<Image
								style={styles.image1}
								source={require("@/assets/images/logo/recycle.png")}
								contentFit="cover"
							/>
						</View>
						<View style={[styles.icon1]}>
							<Image
								style={styles.image1}
								source={require("@/assets/images/logo/co2a.png")}
								contentFit="cover"
							/>
						</View>
						<View style={[styles.icon1]}>
							<Image
								style={styles.image1}
								source={require("@/assets/images/logo/forest2.png")}
								contentFit="cover"
							/>
						</View>
					</View>

					<View
						style={[
							styles.container2,
							{
								flexDirection: "row",
							},
						]}
					>
						<View style={[styles.icon1]}>
							<ThemedText>Recycle</ThemedText>
						</View>
						<View style={[styles.icon1]}>
							<ThemedText>Carbon Credit</ThemedText>
						</View>
						<View style={[styles.icon1]}>
							<ThemedText>Forestry</ThemedText>
						</View>
					</View>
					<View
						style={[
							styles.container3,
							{
								flexDirection: "row",
							},
						]}
					>
						<View style={[styles.icon1]}>
							<Image
								style={styles.image1}
								source={require("@/assets/images/logo/mandiri.png")}
								contentFit="cover"
							/>
						</View>
						<View style={[styles.icon1]}>
							<Image
								style={styles.image1}
								source={require("@/assets/images/logo/ovo2.png")}
								contentFit="cover"
							/>
						</View>
						<View style={[styles.icon1]}>
							<Image
								style={styles.image1}
								source={require("@/assets/images/logo/dana2.png")}
								contentFit="cover"
							/>
						</View>
						<View style={[styles.icon1]}>
							<Image
								style={styles.image1}
								source={require("@/assets/images/logo/gopay2.png")}
								contentFit="cover"
							/>
						</View>
					</View>

					<View
						style={{
							borderBottomColor: "#efefef",
							borderBottomWidth: 1,
							height: 25,
							marginBottom: 40,
						}}
					></View>

					<View
						style={{
							flex: 1,
							marginBottom: 40,
						}}
					>
						<TouchableOpacity
							disabled={loading}
							style={[styles.button, { marginBottom: 5 }]}
							onPress={() => router.replace("/login")}
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

					<ThemedText
						type="subtitle2"
						style={{
							borderBottomColor: "#efefef",
							borderBottomWidth: 1,
							textAlign: "center",
						}}
					>
						Investment
					</ThemedText>

					<View style={[styles.container4, styles.shadows]}>
						<Image
							style={styles.image2}
							source={require("@/assets/images/logo/green-energy.png")}
							contentFit="cover"
						/>
						<ThemedText type="subtitle" style={styles.cardText}>
							Green Energy
						</ThemedText>

						<ThemedText style={styles.cardText}>
							Green energy is energy that comes from natural
							resources that are renewable and environmentally
							friendly.
						</ThemedText>
					</View>

					<View style={[styles.container4, styles.shadows]}>
						<Image
							style={styles.image2}
							source={require("@/assets/images/logo/blue-energy.png")}
							contentFit="cover"
						/>
						<ThemedText type="subtitle" style={styles.cardText}>
							Blue Energy
						</ThemedText>

						<ThemedText style={styles.cardText}>
							Our ocean, with its continuous movement of surface
							winds, tides, and currents, as well as differences
							in salinity and temperature
						</ThemedText>
					</View>

					<View style={[styles.container4, styles.shadows]}>
						<Image
							style={styles.image2}
							source={require("@/assets/images/logo/other.png")}
							contentFit="cover"
						/>
						<ThemedText type="subtitle" style={styles.cardText}>
							Other Article
						</ThemedText>

						<ThemedText style={styles.cardText}>
							Our ocean, with its continuous movement of surface
							winds, tides, and currents, as well as differences
							in salinity and temperature
						</ThemedText>
					</View>
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
		height: 200,
	},
	mainContainer: {
		padding: 20,
		flex: 1,
		flexDirection: "column",
		paddingTop: 10,
	},

	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		borderBottomWidth: 1,
		borderColor: "#ccc",
	},

	container1: {
		height: 100,
		marginTop: 30,
	},
	container2: {
		height: 25,
		marginTop: 0,
	},
	container3: {
		height: 25,
		marginTop: 20,
		marginBottom: 20,
	},

	container4: {
		margin: 0,
		padding: 15,
		paddingTop: 20,

		marginTop: 10,
		marginBottom: 20,
		flexDirection: "column",
		flex: 1,
	},

	shadows: {
		elevation: 5,
		shadowColor: "#ccc",
		borderBottomColor: "#ccc",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
	},
	cardText: {
		textAlign: "center",
	},

	image2: {
		height: 200,
		flex: 1,

		width: "100%",
		maxHeight: 200,
	},

	icon1: { flex: 1, alignItems: "center", justifyContent: "center" },

	image1: {
		flex: 1,
		width: "100%",
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
