import React, { useState, useEffect } from "react";

import {
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Text,
	SafeAreaView,
	ScrollView,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Picker } from "@react-native-picker/picker";

import axios from "axios";
import {
	router,
	Link,
	useLocalSearchParams,
	useNavigation,
	usePathname,
} from "expo-router";
import { baseUrl, showAlert, getToken } from "../../../utils";
import { useColorScheme } from "@/hooks/useColorScheme";
import { POST } from "../../../utils/http";

export default function TransactionFormScreen() {
	const [sellerId, setSellerId] = useState("");
	const [productId, setProductId] = useState("");
	const [weight, setWeight] = useState("");
	const [loading, setLoading] = useState(false);
	const [products, setProducts] = useState([]);

	const { id } = useLocalSearchParams();

	const colorScheme = useColorScheme();
	const themeTextInput =
		colorScheme === "light" ? styles.inputLight : styles.inputDark;
	const themeTextSelect =
		colorScheme === "light" ? styles.selectLight : styles.selectDark;

	const navigation = useNavigation();
	const focused = navigation.isFocused();
	const path = usePathname();

	useEffect(() => {
		if (focused) {
			loadProduct();
		}

		if (id != "0") {
			loadData(id);
		} else {
			setSellerId("");
			setProductId("");
			setWeight("");
		}
	}, [focused]);

	const loadProduct = async () => {
		setLoading(true);
		let token = await getToken();
		axios
			.get(baseUrl() + "product/all", {
				headers: {
					Authorization: "Bearer " + token,
				},
			})
			.then(function (response) {
				if (response.data.success == true) {
					setProducts(response.data.data.rows);
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

	type ListProps = {
		id: string;
		name: string;
	};

	const renderList = () => {
		return products.map(({ id, name }: ListProps) => {
			return <Picker.Item key={id} label={name} value={id} />;
		});
	};

	const loadData = async (id: any) => {
		setLoading(true);
		let token = await getToken();
		axios
			.get(baseUrl() + "transactions/" + id, {
				headers: {
					Authorization: "Bearer " + token,
				},
			})
			.then(function (response) {
				if (response.data.success == true) {
					setSellerId(response.data.data.seller._id);
					setProductId(response.data.data.product._id);
					setWeight(response.data.data.weight.toString());
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

		let uri = "transactions/edit";
		if (id == "0") {
			uri = "transactions/add";
		}

		axios
			.post(
				baseUrl() + uri,
				{
					_id: id,
					sellerId: sellerId,
					productId: productId,
					weight: weight,
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
					router.replace("/transactions");
				} else {
					showAlert("Failed", response.data.message);
				}

				setLoading(false);
			})
			.catch(function (error) {
				console.log(error);
				setLoading(false);
				if (error.response) {
					showAlert("Failed", error.response.data.message);
				}
			});

		setLoading(false);
	};

	return (
		<SafeAreaView style={styles.saveContainer}>
			<ScrollView>
				<ThemedView style={styles.mainContainer}>
					<ThemedText type="title">Transaction Form</ThemedText>
					<ThemedText>Update transaction data</ThemedText>

					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={setSellerId}
						value={sellerId}
						placeholder="Seller"
						placeholderTextColor="#777"
					/>

					<Picker
						accessibilityLabel="Basic Picker Accessibility Label"
						selectedValue={productId}
						style={[themeTextSelect]}
						onValueChange={(itemValue, itemIndex) => {
							if (itemIndex > 0) {
								setProductId(itemValue);
							} else {
								setProductId("");
							}
						}}
					>
						{renderList()}
					</Picker>

					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={setWeight}
						value={weight}
						placeholder="Weight"
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
