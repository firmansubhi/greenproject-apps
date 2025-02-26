import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity,
	SafeAreaView,
	Text,
	ScrollView,
	Dimensions,
	Pressable,
} from "react-native";

import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Redirect, router } from "expo-router";

import axios from "axios";
import { baseUrl } from "../../utils";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
	ICarouselInstance,
	Pagination,
} from "react-native-reanimated-carousel";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useSession } from "../ctx";

type ItemProps = {
	0: ItemProps2;
	1: ItemProps2;
};

type ItemProps2 = {
	newsID: string;
	imageThumb: string;
	title: string;
	publishDate: string;
};

const width = Dimensions.get("window").width;

export default function homeScreen() {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [investments, setInvestments] = useState([]);
	const [communities, setCommunities] = useState([]);
	const [blogs, setBlogs] = useState([]);
	const [banners, setBanners] = useState([]);

	const colorScheme = useColorScheme();
	const themeCarousel =
		colorScheme === "light" ? styles.carouselLight : styles.carouselDark;

	const themeBG = colorScheme === "light" ? styles.bgLight : styles.bgDark;
	const themeSubtitle =
		colorScheme === "light" ? styles.subtitleLight : styles.subtitleDark;

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		setLoading(true);

		axios
			.get(baseUrl() + "newsadmin/banner", {})
			.then(function (response) {
				if (response.data.success == true) {
					setBanners(response.data.data);
				}
			})
			.catch(function (error) {})
			.finally(function () {
				setLoading(false);
			});

		axios
			.get(baseUrl() + "newsadmin/category/investment", {})
			.then(function (response) {
				if (response.data.success == true) {
					setInvestments(response.data.data);
				}
			})
			.catch(function (error) {})
			.finally(function () {
				setLoading(false);
			});

		axios
			.get(baseUrl() + "newsadmin/category/communities", {})
			.then(function (response) {
				if (response.data.success == true) {
					setCommunities(response.data.data);
				}
			})
			.catch(function (error) {})
			.finally(function () {
				setLoading(false);
			});

		axios
			.get(baseUrl() + "newsadmin/category/blog", {})
			.then(function (response) {
				if (response.data.success == true) {
					setBlogs(response.data.data);
				}
			})
			.catch(function (error) {})
			.finally(function () {
				setLoading(false);
			});
	};

	const ref = React.useRef<ICarouselInstance>(null);
	const progress = useSharedValue<number>(0);
	const onPressPagination = (index: number) => {
		ref.current?.scrollTo({
			count: index - progress.value,
			animated: true,
		});
	};

	const renderItem = ({ item }: { item: string }) => {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
				}}
			>
				<Image
					style={styles.imageBanner}
					source={item}
					contentFit="contain"
				/>
			</View>
		);
	};

	const renderItem2 = ({ item }: { item: ItemProps }) => {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					flexDirection: "row",
					padding: 10,
				}}
			>
				<View style={[styles.imgBanner]}>
					<Pressable
						onPress={() =>
							router.replace(`/read/${item[0].newsID}`)
						}
					>
						<Image
							style={[styles.imageBanner2]}
							contentFit="contain"
							source={{
								uri: item[0].imageThumb,
							}}
						/>
						<ThemedText style={{ textAlign: "center" }}>
							{item[0].title}
						</ThemedText>
					</Pressable>
				</View>

				<View style={[styles.imgBanner]}>
					<Pressable
						onPress={() =>
							router.replace(`/read/${item[1].newsID}`)
						}
					>
						<Image
							style={styles.imageBanner2}
							contentFit="contain"
							source={{
								uri: item[1].imageThumb,
							}}
						/>
						<ThemedText style={{ textAlign: "center" }}>
							{item[1].title}
						</ThemedText>
					</Pressable>
				</View>
			</View>
		);
	};

	const renderItem3 = ({ item }: { item: ItemProps }) => {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					flexDirection: "row",
					padding: 10,
				}}
			>
				<View style={[styles.imgBanner]}>
					<Pressable
						onPress={() =>
							router.replace(`/read/${item[0].newsID}`)
						}
					>
						<Image
							style={[styles.imageBanner2]}
							contentFit="contain"
							source={{
								uri: item[0].imageThumb,
							}}
						/>
						<ThemedText>{item[0].title}</ThemedText>
						<ThemedText style={[styles.textGrey]}>
							{item[0].publishDate}
						</ThemedText>
					</Pressable>
				</View>
				<View style={[styles.imgBanner]}>
					<Pressable
						onPress={() =>
							router.replace(`/read/${item[1].newsID}`)
						}
					>
						<Image
							style={styles.imageBanner2}
							contentFit="contain"
							source={{
								uri: item[1].imageThumb,
							}}
						/>
						<ThemedText>{item[1].title}</ThemedText>
						<ThemedText style={[styles.textGrey]}>
							{item[1].publishDate}
						</ThemedText>
					</Pressable>
				</View>
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.saveContainer}>
			<ScrollView>
				<ThemedView style={styles.imageLogoContainer}>
					<Image
						style={styles.imageLogo}
						source={require("@/assets/images/logo.svg")}
						contentFit="contain"
					/>
				</ThemedView>

				<View style={[themeCarousel]}>
					<Carousel
						ref={ref}
						width={width}
						height={width / 2 - 22}
						data={banners}
						onProgressChange={progress}
						renderItem={renderItem}
						loop={true}
						autoPlay
						autoPlayInterval={5000}
						mode="parallax"
					/>

					<Pagination.Basic
						progress={progress}
						data={banners}
						dotStyle={{
							backgroundColor: "rgba(0,0,0,0.2)",
							borderRadius: 50,
						}}
						containerStyle={{ gap: 10, marginTop: 0 }}
						onPress={onPressPagination}
					/>
				</View>

				<ThemedView style={styles.mainContainer}>
					<View style={[styles.containerInner, themeBG]}>
						<View style={[styles.container1]}>
							<View style={[styles.icon1, styles.iconTop]}>
								<Image
									style={[styles.image1, styles.image1b]}
									source={require("@/assets/images/button/recycle.svg")}
									contentFit="contain"
								/>
							</View>
							<View style={[styles.icon1, styles.iconTop]}>
								<Image
									style={[styles.image1, styles.image1b]}
									source={require("@/assets/images/button/carbon.svg")}
									contentFit="contain"
								/>
							</View>
							<View style={[styles.icon1, styles.iconTop]}>
								<Image
									style={[styles.image1, styles.image1b]}
									source={require("@/assets/images/button/forestry.svg")}
									contentFit="contain"
								/>
							</View>
						</View>
						<View style={[styles.container2]}>
							<View style={[styles.icon1]}>
								<ThemedText style={[styles.textBold]}>
									Recycle
								</ThemedText>
							</View>
							<View style={[styles.icon1]}>
								<ThemedText style={[styles.textBold]}>
									Carbon
								</ThemedText>
							</View>
							<View style={[styles.icon1]}>
								<ThemedText style={[styles.textBold]}>
									Forestry
								</ThemedText>
							</View>
						</View>
					</View>

					<View style={[styles.containerInner, themeBG]}>
						<View style={[styles.container1, { marginBottom: 20 }]}>
							<View style={[styles.icon1, styles.iconTop]}>
								<Image
									style={[styles.image1, styles.image1b]}
									source={require("@/assets/images/button/b-mandiri.svg")}
									contentFit="contain"
								/>
							</View>
							<View style={[styles.icon1, styles.iconTop]}>
								<Image
									style={[styles.image1, styles.image1b]}
									source={require("@/assets/images/button/b-gopay.svg")}
									contentFit="contain"
								/>
							</View>
							<View style={[styles.icon1, styles.iconTop]}>
								<Image
									style={[styles.image1, styles.image1b]}
									source={require("@/assets/images/button/b-dana.svg")}
									contentFit="contain"
								/>
							</View>
						</View>
						<View style={[styles.container1]}>
							<View style={[styles.icon1, styles.iconTop]}>
								<Image
									style={[styles.image1, styles.image1b]}
									source={require("@/assets/images/button/b-bca.svg")}
									contentFit="contain"
								/>
							</View>
							<View style={[styles.icon1, styles.iconTop]}>
								<Image
									style={[styles.image1, styles.image1b]}
									source={require("@/assets/images/button/b-spay.svg")}
									contentFit="contain"
								/>
							</View>
							<View style={[styles.icon1, styles.iconTop]}>
								<Image
									style={[styles.image1, styles.image1b]}
									source={require("@/assets/images/button/b-ovo.svg")}
									contentFit="contain"
								/>
							</View>
						</View>
					</View>
				</ThemedView>

				<ThemedView style={styles.mainContainer}>
					<ThemedText type="subtitle" style={[themeSubtitle]}>
						Investment
					</ThemedText>
				</ThemedView>

				<View style={[themeCarousel]}>
					<Carousel
						width={width}
						height={width / 2 + 20}
						data={investments}
						renderItem={renderItem2}
						loop={true}
						autoPlay
						autoPlayInterval={5000}
					/>
				</View>

				<ThemedView style={styles.mainContainer}>
					<ThemedText type="subtitle" style={[themeSubtitle]}>
						Communities
					</ThemedText>
				</ThemedView>

				<View style={[themeCarousel]}>
					<Carousel
						width={width}
						height={width / 2 + 50}
						data={communities}
						renderItem={renderItem3}
						loop={true}
						autoPlay
						autoPlayInterval={5000}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	textGrey: {
		color: "#aaa",
		fontSize: 14,
	},

	subtitleLight: {
		color: Colors.light.text2,
	},

	subtitleDark: {
		color: Colors.dark.text2,
	},
	saveContainer: {
		flex: 1,
	},

	imageLogoContainer: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		height: 80,
		paddingTop: 10,
		marginBottom: 0,
	},
	imageLogo: {
		width: 80,
		height: 80 * (144 / 165),
	},
	imageBanner: {
		width: "100%",
		height: "100%",
	},

	imgBanner: {
		flex: 1,
		flexDirection: "column",
	},

	imageBanner2: {
		width: "100%",
		height: 160,
	},

	carouselLight: {
		backgroundColor: Colors.light.background,
	},
	carouselDark: { backgroundColor: Colors.dark.background },

	bgLight: {
		backgroundColor: Colors.light.background2,
	},
	bgDark: { backgroundColor: Colors.dark.background2 },

	textBold: {
		fontWeight: "bold",
	},

	mainContainer: {
		padding: 20,
		flex: 1,
		flexDirection: "column",
		paddingBottom: 0,
	},

	containerInner: {
		borderRadius: 20,
		overflow: "hidden",
		padding: 20,
		marginBottom: 30,
	},

	container1: {
		flexDirection: "row",
		//height: 64,
		//marginTop: 30,
	},
	container2: {
		padding: 0,
		height: 25,
		marginTop: 0,
		flexDirection: "row",
	},

	icon1: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},

	iconTop: { height: 70 },

	image1: {
		flex: 1,
		width: "100%",
	},

	image1b: {},

	button: {
		padding: 14,
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
});
