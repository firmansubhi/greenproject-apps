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
import { WebView } from "react-native-webview";

export default function NewsFormScreen() {
	const [url, setUrl] = useState("");

	const [loading, setLoading] = useState(false);
	const [categories, setCategories] = useState([]);

	const [selectedImage, setSelectedImage] =
		useState<ImagePicker.ImagePickerAsset>();

	const [dtmode, setDtMode] = useState("date");
	const [dtshow, setDtShow] = useState(false);
	const [imageChanged, setImageChanged] = useState(false);

	const { id } = useLocalSearchParams();
	const webUrl = process.env.EXPO_PUBLIC_WEB_URL;

	const colorScheme = useColorScheme();
	const themeTextInput =
		colorScheme === "light" ? styles.inputLight : styles.inputDark;
	const themeTextSelect =
		colorScheme === "light" ? styles.selectLight : styles.selectDark;

	const navigation = useNavigation();
	const focused = navigation.isFocused();

	const HTML = ` 
          <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </head>
          <body
            style="
              display: flex;
              justify-content: center;
              flex-direction: column;
              align-items: center;
            "
          >
            <button
            onclick="sendDataToReactNativeApp()"
              style="
                padding: 20;
                width: 200;
                font-size: 20;
                color: white;
                background-color: #6751ff;
              "
            >
              Send Data To React Native App
            </button>
            <script>
              const sendDataToReactNativeApp = async () => {
                window.ReactNativeWebView.postMessage('Data from WebView / Website');
              };
            </script>
          </body>
        </html>        
`;

	useEffect(() => {
		if (focused) {
			loadData();
		} else {
			setUrl("");
		}
	}, [focused]);

	const loadData = async () => {
		let token = await getToken();

		setUrl(webUrl + "appnewsform/" + id + "?token=" + token);
	};

	const onMessage = (resp: any) => {
		router.replace(`/newsadmin`);
	};

	return (
		<SafeAreaView style={styles.saveContainer}>
			<WebView
				onMessage={onMessage}
				style={styles.container}
				source={{
					uri: url,
				}}
			/>
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
