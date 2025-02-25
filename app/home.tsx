import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity,
	SafeAreaView,
	Text,
	ScrollView,
	TouchableHighlight,
	Dimensions,
} from "react-native";

import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import axios from "axios";
import { baseUrl } from "../utils";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
	ICarouselInstance,
	Pagination,
} from "react-native-reanimated-carousel";

interface newsProps {
	key: String;
	id: String;
	name: String;
	detail: newsDetailProps[];
}

interface newsDetailProps {
	sid: String;
	imageThumb: String;
	title: String;
	intro: String;
	newsID: String;
	publishDate: String;
}

const datas: number[] = [...new Array(3).keys()];
const colors = ["#ff0000", "#00ff00", "#0000ff"];

export const banners = [
	require("@/assets/images/banner/1.png"),
	require("@/assets/images/banner/2.png"),
	require("@/assets/images/banner/3.png"),
];

const width = Dimensions.get("window").width;

export default function homeScreen() {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		setLoading(true);

		axios
			.get(baseUrl() + "newsadmin/group/all", {})
			.then(function (response) {
				if (response.data.success == true) {
					setData(response.data.data);
				}
			})
			.catch(function (error) {})
			.finally(function () {
				setLoading(false);
			});
	};

	const renderItem2 = ({ item }: { item: number }) => {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
				}}
			>
				<Image
					style={styles.imageBanner}
					source={banners[item]}
					contentFit="contain"
				/>
			</View>
		);
	};

	const ref = React.useRef<ICarouselInstance>(null);
	const progress = useSharedValue<number>(0);
	const onPressPagination = (index: number) => {
		ref.current?.scrollTo({
			/**
			 * Calculate the difference between the current index and the target index
			 * to ensure that the carousel scrolls to the nearest index
			 */
			count: index - progress.value,
			animated: true,
		});
	};

	const renderItem = ({ item }: { item: number }) => {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
				}}
			>
				<Image
					style={styles.imageBanner}
					source={banners[item]}
					contentFit="contain"
				/>
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.saveContainer}>
			<ScrollView>
				<ThemedView style={styles.imageLogoContainer}>
					<Image
						style={styles.imageLogo}
						source={require("@/assets/images/icon.png")}
						contentFit="cover"
					/>
				</ThemedView>

				<View style={{ flex: 1 }}>
					<Carousel
						ref={ref}
						width={width}
						height={width / 2 - 22}
						data={datas}
						onProgressChange={progress}
						renderItem={renderItem}
						loop={true}
						autoPlay
						autoPlayInterval={5000}
						mode="parallax"
					/>

					<Pagination.Basic
						progress={progress}
						data={data}
						dotStyle={{
							backgroundColor: "rgba(0,0,0,0.2)",
							borderRadius: 50,
						}}
						containerStyle={{ gap: 10, marginTop: 0 }}
						onPress={onPressPagination}
					/>
				</View>

				<ThemedView style={styles.mainContainer}>
					<ThemedText
						type="title"
						style={{
							textAlign: "center",
						}}
					>
						Green Project
					</ThemedText>
					<ThemedText
						style={{
							textAlign: "center",
						}}
					>
						Lets save our earth
					</ThemedText>
					<View style={[styles.container1]}>
						<View style={[styles.icon1, styles.iconTop]}>
							<Image
								style={[styles.image1, styles.image1b]}
								source={require("@/assets/images/logo/recycle.png")}
								contentFit="contain"
							/>
						</View>
						<View style={[styles.icon1, styles.iconTop]}>
							<Image
								style={[styles.image1, styles.image1b]}
								source={require("@/assets/images/logo/co2a.png")}
								contentFit="contain"
							/>
						</View>
						<View style={[styles.icon1, styles.iconTop]}>
							<Image
								style={[styles.image1, styles.image1b]}
								source={require("@/assets/images/logo/forest2.png")}
								contentFit="contain"
							/>
						</View>
					</View>
					<View style={[styles.container2]}>
						<View style={[styles.icon1]}>
							<ThemedText>Recycle</ThemedText>
						</View>
						<View style={[styles.icon1]}>
							<ThemedText>Carbon Credit</ThemedText>
						</View>
						<View style={[styles.icon1]}>
							<ThemedText>Forestry</ThemedText>
						</View>
					</View>
					<View
						style={[
							styles.container3,
							{
								flexDirection: "row",
							},
						]}
					>
						<View style={[styles.icon1]}>
							<Image
								style={styles.image1}
								source={require("@/assets/images/logo/mandiri.png")}
								contentFit="cover"
							/>
						</View>
						<View style={[styles.icon1]}>
							<Image
								style={styles.image1}
								source={require("@/assets/images/logo/ovo2.png")}
								contentFit="cover"
							/>
						</View>
						<View style={[styles.icon1]}>
							<Image
								style={styles.image1}
								source={require("@/assets/images/logo/dana2.png")}
								contentFit="cover"
							/>
						</View>
						<View style={[styles.icon1]}>
							<Image
								style={styles.image1}
								source={require("@/assets/images/logo/gopay2.png")}
								contentFit="cover"
							/>
						</View>
					</View>

					<View
						style={{
							borderBottomColor: "#efefef",
							borderBottomWidth: 1,
							height: 25,
							marginBottom: 40,
						}}
					></View>
					<View
						style={{
							flex: 1,
							marginBottom: 40,
						}}
					>
						<TouchableOpacity
							style={[styles.button, { marginBottom: 5 }]}
							onPress={() => router.replace("/login")}
						>
							<Text style={styles.buttonText}>Login</Text>
						</TouchableOpacity>

						<ThemedText
							onPress={() => router.replace("/register")}
							type="link"
						>
							Don't have account? Join here
						</ThemedText>
					</View>

					{data.map((news: newsProps, index) => {
						return (
							<View key={index}>
								<ThemedText
									type="subtitle2"
									style={styles.subtitle}
								>
									{news.name}
								</ThemedText>

								{news.detail.map((d, i) => {
									return (
										<TouchableHighlight
											key={i}
											activeOpacity={0.6}
											underlayColor="#DDDDDD"
											onPress={() =>
												router.replace(
													`/read/${d.newsID}`
												)
											}
										>
											<View
												style={[
													styles.container4,
													styles.shadows,
												]}
											>
												<Image
													style={styles.image2}
													contentFit="cover"
													source={{
														uri: d.imageThumb,
													}}
												/>
												<ThemedText
													type="subtitle"
													style={styles.cardText}
												>
													{d.title}
												</ThemedText>

												<ThemedText
													style={styles.cardText}
												>
													{d.intro}
												</ThemedText>
											</View>
										</TouchableHighlight>
									);
								})}
							</View>
						);
					})}
				</ThemedView>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	title: {
		fontSize: 24,
	},
	item: {
		backgroundColor: "#f9c2ff",
		padding: 20,
		marginVertical: 8,
	},
	header: {
		fontSize: 32,
		backgroundColor: "#fff",
	},

	subtitle: {
		borderBottomColor: "#198754",
		borderBottomWidth: 5,
		textAlign: "center",
		padding: 5,
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		marginTop: 30,
	},
	saveContainer: {
		flex: 1,
	},

	imageLogoContainer: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		height: 100,
		marginTop: 10,
		marginBottom: 0,
	},
	imageLogo: {
		width: 90,
		height: 90,
	},
	imageBanner: {
		width: "100%",
		height: "100%",
	},

	mainContainer: {
		padding: 20,
		flex: 1,
		flexDirection: "column",
		paddingTop: 10,
	},

	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		borderBottomWidth: 1,
		borderColor: "#ccc",
	},

	container1: {
		flexDirection: "row",
		height: 64,
		marginTop: 30,
	},
	container2: {
		padding: 0,
		height: 25,
		marginTop: -5,
		flexDirection: "row",
	},
	container3: {
		height: 25,
		marginTop: 20,
		marginBottom: 20,
	},

	container4: {
		margin: 0,
		padding: 15,
		paddingTop: 20,

		marginTop: 10,
		marginBottom: 20,
		flexDirection: "column",
		flex: 1,
	},

	shadows: {
		elevation: 5,
		shadowColor: "#ccc",
		borderBottomColor: "#ccc",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
	},
	cardText: {
		textAlign: "center",
	},

	image2: {
		height: 200,
		flex: 1,

		width: "100%",
		maxHeight: 200,
	},

	icon1: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},

	iconTop: { height: 64 },

	image1: {
		flex: 1,
		width: "100%",
	},

	image1b: {},

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

	inputPass: {
		height: 40,
		margin: 5,
		padding: 10,
		flex: 1,
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
});
