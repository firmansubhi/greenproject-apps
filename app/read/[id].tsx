import React, { useState, useEffect } from "react";

import {
	StyleSheet,
	BackHandler,
	SafeAreaView,
	ScrollView,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { Image } from "expo-image";

import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { baseUrl, showAlert, getToken } from "../../utils";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSession } from "../ctx";

export default function ReadNewsScreen() {
	const [title, setTitle] = useState("");
	const [intro, setIntro] = useState("");
	const [content, setContent] = useState("");
	const [categoryName, setCategoryName] = useState("");
	const [publishDate, setPublishDate] = useState();
	const [imagePath, setImagePath] = useState(
		"https://tempdev2.roomie.id/images/blank-qr.png"
	);

	const [loading, setLoading] = useState(false);

	const { id } = useLocalSearchParams();

	const { session } = useSession();

	useEffect(() => {
		if (id != "0") {
			loadData(id);
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

	const loadData = async (id: any) => {
		setLoading(true);

		axios
			.get(baseUrl() + "newsadmin/view/" + id, {})
			.then(function (response) {
				if (response.data.success == true) {
					if (response.data.data.imagePath == "") {
						setImagePath(
							"https://tempdev2.roomie.id/images/blank-qr.png"
						);
					} else {
						setImagePath(response.data.data.imagePath);
					}

					setTitle(response.data.data.title);
					setIntro(response.data.data.intro);
					setContent(response.data.data.content);
					setPublishDate(response.data.data.publishDate);
					setCategoryName(response.data.data.categoryName);
				} else {
					showAlert("Failed", response.data.message);
				}
			})
			.catch(function (error) {
				if (error.response) {
					showAlert("Failed", error.response.data.message);
				}
			})
			.finally(function () {
				setLoading(false);
			});
	};

	return (
		<SafeAreaView style={styles.saveContainer}>
			<ScrollView>
				<Image
					style={styles.image}
					source={{ uri: imagePath }}
					contentFit="contain"
				/>
				<ThemedView style={styles.mainContainer}>
					<ThemedText style={{ fontSize: 18, marginBottom: 10 }}>
						{categoryName}
					</ThemedText>

					<ThemedText type="title" style={{ marginBottom: 10 }}>
						{title}
					</ThemedText>
					<ThemedText
						style={{
							fontSize: 14,
							marginBottom: 10,
							color: "#777",
							borderBottomColor: "#eee",
							borderBottomWidth: 1,
						}}
					>
						{publishDate}
					</ThemedText>
					<ThemedText
						style={{
							marginBottom: 10,
							fontWeight: "bold",
						}}
					>
						{intro}
					</ThemedText>
					<ThemedText>{content}</ThemedText>
				</ThemedView>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	image: {
		flex: 1,
		marginBottom: 0,
		height: 220,
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
