import React, { useState, useEffect } from "react";

import {
	StyleSheet,
	BackHandler,
	SafeAreaView,
	ScrollView,
	Dimensions,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView2 } from "@/components/ThemedView2";

import { Image } from "expo-image";
import Constants from "expo-constants";

import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { baseUrl, showAlert } from "../../utils";
import { useSession } from "../ctx";
import { WebView } from "react-native-webview";

const width = Dimensions.get("window").width;
export default function ReadNewsScreen() {
	const [loading, setLoading] = useState(false);

	const { id } = useLocalSearchParams();

	const webUrl = process.env.EXPO_PUBLIC_WEB_URL;

	const { session } = useSession();

	useEffect(() => {
		if (id != "0") {
		}

		const backAction = () => {
			if (!session) {
				router.replace("/home");
			} else {
				router.replace("/");
			}
			return true;
		};

		const backHandler = BackHandler.addEventListener(
			"hardwareBackPress",
			backAction
		);

		return () => backHandler.remove();
	}, []);

	return (
		<SafeAreaView style={styles.saveContainer}>
			<WebView
				style={styles.container}
				source={{
					uri: webUrl + "appread/" + id,
				}}
			/>
		</SafeAreaView>

		//<SafeAreaView style={styles.saveContainer}>
		//	<ScrollView>
		//		<Image
		//			style={styles.image}
		//			source={{ uri: imagePath }}
		//			contentFit="contain"
		//		/>

		//		<WebView
		//			originWhitelist={["*"]}
		//			source={{ html: "<p>Here I am</p>" }}
		//		></WebView>

		//		<ThemedView2 style={styles.mainContainer}>
		//			<ThemedText style={{ fontSize: 18, marginBottom: 10 }}>
		//				{categoryName}
		//			</ThemedText>

		//			<ThemedText type="title" style={{ marginBottom: 10 }}>
		//				{title}
		//			</ThemedText>
		//			<ThemedText
		//				style={{
		//					fontSize: 14,
		//					marginBottom: 10,
		//					color: "#777",
		//					borderBottomColor: "#eee",
		//					borderBottomWidth: 1,
		//				}}
		//			>
		//				{publishDate}
		//			</ThemedText>
		//			<ThemedText
		//				style={{
		//					marginBottom: 10,
		//					fontWeight: "bold",
		//				}}
		//			>
		//				{intro}
		//			</ThemedText>

		//			<ThemedText>{content}</ThemedText>
		//			<WebView
		//				style={{
		//					flex: 1,
		//				}}
		//				originWhitelist={["*"]}
		//				source={{
		//					html: HTML,
		//				}}
		//			/>
		//		</ThemedView2>
		//		<Image
		//			style={[
		//				{
		//					marginTop: 0,
		//					width: width,
		//					height: width * (147 / 390),
		//				},
		//			]}
		//			source={require("@/assets/images/hello2.svg")}
		//			contentFit="cover"
		//		/>
		//	</ScrollView>
		//</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container2: {
		flex: 1,
		marginTop: Constants.statusBarHeight,
	},

	image: {
		flex: 1,
		marginBottom: 0,
		width: width,
		height: width * (870 / 1024),
	},

	buttonContainer: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "transparent",
		margin: 64,
	},

	buttonCamera: {
		flex: 1,
		alignSelf: "flex-end",
		alignItems: "center",
	},
	text: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
	},
	containerCamera: {
		flex: 1,
		justifyContent: "center",
		height: 320,
	},
	message: {
		textAlign: "center",
		paddingBottom: 10,
	},
	camera: {
		flex: 1,
	},
	saveContainer: {
		flex: 1,
	},

	imageContainer: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	mainContainer: {
		padding: 20,
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
});
