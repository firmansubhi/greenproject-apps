import React, { useState, useEffect } from "react";

import {
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Text,
	SafeAreaView,
	ScrollView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";
import { baseUrl, showAlert, getToken } from "../../../utils";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function ProductFormcreen() {
	const router = useRouter();

	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [loading, setLoading] = useState(false);

	const { id } = useLocalSearchParams();

	const colorScheme = useColorScheme();
	const themeTextInput =
		colorScheme === "light" ? styles.inputLight : styles.inputDark;

	useEffect(() => {
		if (id != "0") {
			loadData(id);
		} else {
			setName("");
			setPrice("");
		}
	}, [id]);

	const loadData = async (id: any) => {
		setLoading(true);
		let token = await getToken();
		axios
			.get(baseUrl() + "product/" + id, {
				headers: {
					Authorization: "Bearer " + token,
				},
			})
			.then(function (response) {
				if (response.data.success == true) {
					setName(response.data.data.name);
					setPrice(response.data.data.price.toString());
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

	const onPress = async () => {
		setLoading(true);
		let token = await getToken();

		let uri = "product/edit";
		if (id == "0") {
			uri = "product/add";
		}

		axios
			.post(
				baseUrl() + uri,
				{
					_id: id,
					name: name,
					price: price,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + token,
					},
				}
			)
			.then(async function (response) {
				if (response.data.success == true) {
					router.replace("/products?query=refresh");

					//return <Redirect href="/users" />;
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
			<ScrollView>
				<ThemedView style={styles.mainContainer}>
					<ThemedText type="title">Product Form</ThemedText>
					<ThemedText type="title2">Update user data</ThemedText>

					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={setName}
						value={name}
						placeholder="Name"
						placeholderTextColor="#777"
					/>

					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={setPrice}
						value={price}
						placeholder="Price"
						placeholderTextColor="#777"
						keyboardType="numeric"
					/>

					<TouchableOpacity
						disabled={loading}
						style={styles.button}
						onPress={onPress}
					>
						<Text style={styles.buttonText}>Save</Text>
					</TouchableOpacity>
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
		marginTop: 5,
		padding: 10,
		shadowColor: "rgba(0,0,0, .4)", // IOS
		shadowOffset: { height: 1, width: 1 }, // IOS
		shadowOpacity: 1, // IOS
		shadowRadius: 1, //IOS
		backgroundColor: "#374982",
		elevation: 2, // Android
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		borderRadius: 20,
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
