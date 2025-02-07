import * as SecureStore from "expo-secure-store";
import { Alert, Platform } from "react-native";

export const getToken = async () => {
	let result = await SecureStore.getItemAsync("token");
	if (result) {
		return result;
	} else {
		return "";
	}
};

export const showAlert = (title: string, body: string) => {
	console.log(body);
	if (Platform.OS === "web") {
		alert(body);
	} else {
		Alert.alert(title, body);
	}
};

export const baseUrl = () => {
	return "https://tempdev2.roomie.id/";
};
