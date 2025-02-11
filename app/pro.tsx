import React, { memo } from "react";
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	TextInput,
	TouchableOpacity,
	Modal,
	Pressable,
	SafeAreaView,
} from "react-native";
import { Link } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import { ThemedText } from "@/components/ThemedText";

type ItemProps = {
	productid: number;
	sid: string;
	tipe: string;
	headline: string;
	price: number;
	onDelete: (id: number, name: string) => void;
};

const Item = memo(
	({ productid, tipe, headline, price, onDelete }: ItemProps) => (
		<View style={styles.listItem}>
			<View style={styles.textItem}>
				<ThemedText style={{ fontWeight: "bold" }}>
					{headline}
				</ThemedText>
				<ThemedText>{tipe}</ThemedText>
				<ThemedText>Username : {productid}</ThemedText>
				<ThemedText>City : {price}</ThemedText>
			</View>
			<TouchableOpacity
				onPress={() => onDelete(productid, headline)}
				style={{
					height: 50,
					width: 100,
					justifyContent: "flex-start",
					alignItems: "center",
				}}
			>
				<FontAwesome6 name="trash-can" size={16} color="green" />
			</TouchableOpacity>

			<Link
				href={{
					pathname: "/user/[id]",
					params: { id: productid },
				}}
			>
				<FontAwesome6 name="edit" size={16} color="green" />
			</Link>
		</View>
	),
	(prevProps, nextProps) => {
		return prevProps.productid === nextProps.productid;
	}
);

const styles = StyleSheet.create({
	saveContainer: {
		flex: 1,
	},

	mainContainer: {
		padding: 30,
		flex: 1,
		flexDirection: "column",
	},

	container: {
		flex: 1,
		justifyContent: "center",

		padding: 15,
	},

	titleContainer: {
		//flexDirection: "column",
		//gap: 8,
	},

	containerSearch: {
		paddingTop: 20,
		paddingBottom: 5,
	},
	input: {
		height: 40,
		margin: 5,
		padding: 10,
		borderBottomWidth: 1,
		borderColor: "#ccc",
	},

	selectLight: {
		color: "black",
	},

	selectDark: {
		backgroundColor: "black",
		color: "white",
	},

	inputLight: {
		color: "#000",
	},
	inputDark: {
		color: "#fff",
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

	listItem: {
		margin: 10,

		width: "100%",
		//flex: 1,
		alignSelf: "center",
		flexDirection: "row",
		borderRadius: 5,
	},
	textItem: { flex: 1 },

	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 5,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,

		justifyContent: "center",
		flexDirection: "column",
	},

	modalButtonView: {
		justifyContent: "center",
		flexDirection: "row",
	},
	buttonConfirm: {
		borderRadius: 5,
		padding: 10,
		margin: 10,
		elevation: 2,
	},

	buttonClose: {
		backgroundColor: "#aaa",
	},
	buttonContinue: {
		backgroundColor: "red",
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
	},
});

export default Item;
