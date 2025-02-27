import React, { useState, useEffect } from "react";

import {
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Text,
	SafeAreaView,
	ScrollView,
	Platform,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

import { Image } from "expo-image";

import axios from "axios";
import {
	router,
	useLocalSearchParams,
	useNavigation,
	usePathname,
} from "expo-router";
import { baseUrl, showAlert, getToken } from "../../../utils";
import { useColorScheme } from "@/hooks/useColorScheme";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function NewsFormScreen() {
	const [newsID, setNewsID] = useState("");
	const [title, setTitle] = useState("");
	const [intro, setIntro] = useState("");
	const [content, setContent] = useState("");
	const [publishDate, setPublishDate] = useState(new Date());
	const [category, setCategory] = useState("");
	const [imageThumb, setImageThumb] = useState(
		"https://tempdev2.roomie.id/images/blank-qr.png"
	);

	const [loading, setLoading] = useState(false);
	const [categories, setCategories] = useState([]);

	const [selectedImage, setSelectedImage] =
		useState<ImagePicker.ImagePickerAsset>();

	const [dtmode, setDtMode] = useState("date");
	const [dtshow, setDtShow] = useState(false);
	const [imageChanged, setImageChanged] = useState(false);

	const { id } = useLocalSearchParams();

	const colorScheme = useColorScheme();
	const themeTextInput =
		colorScheme === "light" ? styles.inputLight : styles.inputDark;
	const themeTextSelect =
		colorScheme === "light" ? styles.selectLight : styles.selectDark;

	const navigation = useNavigation();
	const focused = navigation.isFocused();

	useEffect(() => {
		if (focused) {
			loadCategories();
		}

		if (id != "0") {
			loadData(id);
		} else {
			setTitle("");
			setIntro("");
			setContent("");
			setPublishDate(new Date());
			setCategory("");
			setNewsID("");
			setImageThumb("https://tempdev2.roomie.id/images/blank-qr.png");
			setImageChanged(false);
		}
	}, [focused]);

	const loadCategories = async () => {
		setLoading(true);
		let token = await getToken();
		axios
			.get(baseUrl() + "newsadmin/categories", {
				headers: {
					Authorization: "Bearer " + token,
				},
			})
			.then(function (response) {
				if (response.data.success == true) {
					setCategories(response.data.data.rows);
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
		return categories.map(({ id, name }: ListProps) => {
			return <Picker.Item key={id} label={name} value={id} />;
		});
	};

	const loadData = async (id: any) => {
		setLoading(true);
		let token = await getToken();
		axios
			.get(baseUrl() + "newsadmin/" + id, {
				headers: {
					Authorization: "Bearer " + token,
				},
			})
			.then(function (response) {
				if (response.data.success == true) {
					if (response.data.data.imageThumb == "") {
						setImageThumb(
							"https://tempdev2.roomie.id/images/blank-qr.png"
						);
					} else {
						setImageThumb(response.data.data.imageThumb);
					}

					setTitle(response.data.data.title);
					setIntro(response.data.data.intro);
					setContent(response.data.data.content);
					setPublishDate(new Date(response.data.data.publishDate));
					setCategory(response.data.data.category._id);

					setNewsID(response.data.data.newsID);
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

		let uri = "newsadmin/edit";
		if (id == "0") {
			uri = "newsadmin/add";
		}

		//imageThumb

		const formData = new FormData();

		if (imageChanged) {
			if (!selectedImage) return;

			const uri2 =
				Platform.OS === "android"
					? selectedImage.uri
					: selectedImage.uri.replace("file://", "");
			const filename = selectedImage.uri.split("/").pop();
			const match = /\.(\w+)$/.exec(filename as string);
			const ext = match?.[1];
			const type = match ? `image/${match[1]}` : `image`;

			formData.append("image", {
				uri: uri2,
				name: `image.${ext}`,
				type,
			} as any);
		}

		formData.append("_id", id as any);
		formData.append("newsID", newsID);
		formData.append("title", title);
		formData.append("intro", intro);
		formData.append("content", content);
		formData.append("publishDate", publishDate.toDateString());
		formData.append("category", category);

		axios
			.post(
				baseUrl() + uri,
				formData,
				//{
				//	_id: id,
				//	newsID: newsID,
				//	title: title,
				//	intro: intro,
				//	content: content,
				//	publishDate: publishDate,
				//	category: category,
				//},
				{
					headers: {
						//"Content-Type": "application/json",
						Authorization: "Bearer " + token,
						"Content-Type": "multipart/form-data",
					},
				}
			)
			.then(async function (response) {
				if (response.data.success == true) {
					router.replace("/newsadmin");
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

	const onChangePublishDate = (event: any, selectedDate: Date) => {
		const currentDate = selectedDate;

		setPublishDate(currentDate);

		if (dtmode == "time") {
			setDtShow(false);
		} else {
			setDtMode("time");
		}
	};

	const showDatePicker = () => {
		setDtShow(true);
		setDtMode("date");
	};

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: false,
			//aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			setSelectedImage(result.assets[0]);
			setImageThumb(result.assets[0].uri);
			setImageChanged(true);
		}
	};

	return (
		<SafeAreaView style={styles.saveContainer}>
			<ScrollView>
				<ThemedView style={styles.mainContainer}>
					<ThemedText type="title">News Form</ThemedText>
					<ThemedText type="title2">Update news data</ThemedText>

					<View
						style={{
							alignItems: "center",
						}}
					>
						<Image
							style={styles.image}
							//source={imageThumb}
							contentFit="cover"
							transition={1000}
							source={{ uri: imageThumb }}
						/>
					</View>
					<TouchableOpacity style={styles.button} onPress={pickImage}>
						<Text style={styles.buttonText}>select image</Text>
					</TouchableOpacity>

					{id != "0" && (
						<TextInput
							style={[styles.input, themeTextInput]}
							onChangeText={setNewsID}
							value={newsID}
							placeholder="News ID"
							placeholderTextColor="#777"
						/>
					)}
					<Picker
						accessibilityLabel="Basic Picker Accessibility Label"
						selectedValue={category}
						style={[themeTextSelect]}
						onValueChange={(itemValue, itemIndex) => {
							if (itemIndex > 0) {
								setCategory(itemValue);
							} else {
								setCategory("");
							}
						}}
					>
						{renderList()}
					</Picker>
					{/* 
					
					const [imageThumb, setImageThumb]*/}
					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={setTitle}
						value={title}
						placeholder="Title"
						placeholderTextColor="#777"
					/>
					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={setIntro}
						value={intro}
						placeholder="Intro"
						placeholderTextColor="#777"
					/>
					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={setContent}
						value={content}
						placeholder="Content"
						placeholderTextColor="#777"
					/>

					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
							padding: 0,
							paddingLeft: 10,
							paddingRight: 10,
							borderBottomWidth: 1,
							borderColor: "#ccc",
							marginBottom: 20,
						}}
					>
						<ThemedText style={[{ flex: 1 }, themeTextInput]}>
							{publishDate.toLocaleString()}
						</ThemedText>
						{dtshow && (
							<DateTimePicker
								testID="dateTimePicker"
								value={publishDate}
								mode={dtmode}
								is24Hour={true}
								onChange={(event: any, date: any) =>
									onChangePublishDate(event, date)
								}
							/>
						)}

						<TouchableOpacity
							style={styles.button}
							onPress={showDatePicker}
						>
							<Text style={styles.buttonText}>...</Text>
						</TouchableOpacity>
					</View>

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
		width: 300,
		height: 200,
	},
});
