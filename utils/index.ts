import * as SecureStore from "expo-secure-store";
import { Alert, Platform } from "react-native";

export const getToken = async () => {
	if (Platform.OS === "web") {
		const token = localStorage.getItem("token");
		return token;
	} else {
		let result = await SecureStore.getItemAsync("token");
		if (result) {
			return result;
		} else {
			return "";
		}
	}
};

export const showAlert = (title: string, body: string) => {
	if (Platform.OS === "web") {
		alert(body);
	} else {
		Alert.alert(title, body);
	}
};

export const baseUrl = () => {
	return "https://tempdev2.roomie.id/";
};
