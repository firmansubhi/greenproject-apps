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

	const { session, role } = useSession();

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
				name="transactions"
				options={{
					title: "Transaction",
					tabBarIcon: ({ color }) => (
						<Ionicons size={28} name="cart" color={color} />
					),
				}}
			/>

			<Tabs.Screen
				name="transaction/[id]"
				options={{
					href: null,
				}}
			/>

			{role == "administrator" ? (
				<Tabs.Screen
					name="users"
					options={{
						title: "Users",
						tabBarIcon: ({ color }) => (
							<Ionicons size={28} name="people" color={color} />
						),
					}}
				/>
			) : (
				<Tabs.Screen
					name="users"
					options={{
						href: null,
					}}
				/>
			)}

			<Tabs.Screen
				name="user/[id]"
				options={{
					href: null,
				}}
			/>

			{role == "administrator" ? (
				<Tabs.Screen
					name="products"
					options={{
						title: "Products",
						tabBarIcon: ({ color }) => (
							<Ionicons
								size={28}
								name="briefcase"
								color={color}
							/>
						),
					}}
				/>
			) : (
				<Tabs.Screen
					name="products"
					options={{
						href: null,
					}}
				/>
			)}

			<Tabs.Screen
				name="product/[id]"
				options={{
					href: null,
				}}
			/>

			<Tabs.Screen
				name="myQRCode"
				options={{
					title: "QRCode",
					tabBarIcon: ({ color }) => (
						<Ionicons
							size={28}
							name="qr-code-outline"
							color={color}
						/>
					),
				}}
			/>

			<Tabs.Screen
				name="logout"
				options={{
					title: "Sign Out",
					tabBarIcon: ({ color }) => (
						<Ionicons size={28} name="log-out" color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
