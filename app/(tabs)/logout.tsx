import React, { useState, useEffect } from "react";

import { StyleSheet, SafeAreaView } from "react-native";
import { Image } from "expo-image";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { baseUrl, showAlert, getToken } from "../../utils";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSession } from "../ctx";

export default function LogoutScreen() {
	const { signOut } = useSession();

	useEffect(() => {
		signOut();
	}, []);
}
