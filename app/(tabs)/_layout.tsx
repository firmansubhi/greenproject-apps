import { Redirect, Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSession } from "../ctx";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
	const colorScheme = useColorScheme();

	const { session, isLoading } = useSession();

	if (!session) {
		return <Redirect href="/home" />;
	}

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarBackground: TabBarBackground,
				tabBarStyle: Platform.select({
					ios: {
						// Use a transparent background on iOS to show the blur effect
						position: "absolute",
					},
					default: {},
				}),
				animation: "fade",
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => (
						<IconSymbol size={28} name="house.fill" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="explore"
				options={{
					title: "Explore",
					tabBarIcon: ({ color }) => (
						<IconSymbol
							size={28}
							name="paperplane.fill"
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="users"
				options={{
					title: "Users",
					tabBarIcon: ({ color }) => (
						<Ionicons size={28} name="people" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="user/[id]"
				options={{
					href: null,
				}}
			/>
		</Tabs>
	);
}
