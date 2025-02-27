import { Redirect, Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSession } from "../ctx";
import Ionicons from "@expo/vector-icons/Ionicons";
import { allowGroup } from "../../utils";
import { Image } from "expo-image";

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
						<Ionicons size={28} name="home-outline" color={color} />
					),
				}}
			/>

			<Tabs.Screen
				name="transactions"
				options={{
					title: "Transaction",
					tabBarIcon: ({ color }) => (
						<Ionicons size={28} name="list-outline" color={color} />
					),
				}}
			/>

			<Tabs.Screen
				name="transaction/[id]"
				options={{
					href: null,
				}}
			/>

			{allowGroup(["administrator"]) ? (
				<Tabs.Screen
					name="products"
					options={{
						title: "Products",
						tabBarIcon: ({ color }) => (
							<Ionicons
								size={28}
								name="cube-outline"
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

			{allowGroup(["administrator", "seller"]) ? (
				<Tabs.Screen
					name="myQRCode"
					options={{
						title: "QRCode",
						tabBarIcon: ({ color }) => (
							<Image
								style={[
									{
										width: 64,
										height: 64,
										position: "absolute",
										bottom: 0,
									},
								]}
								source={require("@/assets/images/qr-icon.svg")}
								contentFit="cover"
							/>
						),
					}}
				/>
			) : (
				<Tabs.Screen
					name="myQRCode"
					options={{
						href: null,
					}}
				/>
			)}

			{allowGroup(["administrator"]) ? (
				<Tabs.Screen
					name="newsadmin"
					options={{
						title: "News",
						tabBarIcon: ({ color }) => (
							<Ionicons
								size={28}
								name="newspaper-outline"
								color={color}
							/>
						),
					}}
				/>
			) : (
				<Tabs.Screen
					name="newsadmin"
					options={{
						href: null,
					}}
				/>
			)}
			<Tabs.Screen
				name="newsadm/[id]"
				options={{
					href: null,
				}}
			/>

			{allowGroup(["administrator"]) ? (
				<Tabs.Screen
					name="users"
					options={{
						title: "Users",
						tabBarIcon: ({ color }) => (
							<Ionicons
								size={28}
								name="people-outline"
								color={color}
							/>
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

			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color }) => (
						<Ionicons
							size={28}
							name="person-circle-outline"
							color={color}
						/>
					),
				}}
			/>

			{!allowGroup(["administrator"]) ? (
				<Tabs.Screen
					name="logout"
					options={{
						title: "Sign Out",
						tabBarIcon: ({ color }) => (
							<Ionicons
								size={28}
								name="power-outline"
								color={color}
							/>
						),
					}}
				/>
			) : (
				<Tabs.Screen
					name="logout"
					options={{
						href: null,
					}}
				/>
			)}
		</Tabs>
	);
}
