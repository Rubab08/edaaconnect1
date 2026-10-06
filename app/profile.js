import React, { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Carousel } from 'react-native-reanimated-carousel';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../components/providers/UserContext';



const slides = [
	{
		id: 'flower1',
		title: 'Daisy',
		image: require('../assets/flower1.png'),
	},
	{
		id: 'flower2',
		title: 'Hibiscus',
		image: require('../assets/flower2.png'),
	},
	{
		id: 'flower3',
		title: 'Sunflower',
		image: require('../assets/flower3.png'),
	},
	{
		id: 'flower4',
		title: 'Tulip',
		image: require('../assets/flower4.png'),
	},
];

export default function ProfileScreen() {
	const [currentSlide, setCurrentSlide] = useState(0);
	const { width } = useWindowDimensions();
	const carouselWidth = Math.max(width - 40, 0);

	const { nin } = useUser();

	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar barStyle="light-content" backgroundColor="#09156e" />
			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.heading}>
					<Text style={styles.eyebrow}>
						NIN: {nin ? nin : 'Not Logged In'}
					</Text>
					<Text style={styles.title}>FLOWERS</Text>
				</View>

				<View style={styles.carouselFrame}>
					<Carousel
						data={slides}
						style={{ width: carouselWidth, height: 380 }}
						layout={{ type: 'parallax', offset: 70, scale: 0.85, adjacentScale: 0.67 }}
						loop
						autoplay 
						autoplayInterval={3000}
						animation={{ type: 'timing', duration: 650 }}
						keyExtractor={(item) => item.id}
						onSnapToItem={setCurrentSlide}
						renderItem={({ item }) => (
							<View style={styles.slide}>
								<View style={styles.imageContainer}>
									<Image
										source={item.image}
										style={styles.image}
										blurRadius={item.id === slides[currentSlide].id ? 0 : 5}
									/>
									<View style={styles.imageCaption}>
										<Text style={styles.imageTitle}>{item.title}</Text>
									</View>
								</View>
							</View>
						)}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#0f143a',
	},
	content: {
		flexGrow: 1,
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingTop: 24,
		paddingBottom: 32,
	},
	heading: {
		width: '100%',
		maxWidth: 520,
		marginBottom: 22,
	},
	eyebrow: {
		color: '#bd8aff',
		fontSize: 12,
		fontWeight: '800',
		letterSpacing: 2,
		marginBottom: 8,
	},
	title: {
		color: '#fff',
		fontSize: 28,
		fontWeight: '800',
	},
	carouselFrame: {
		width: '100%',
		alignItems: 'center',
		overflow: 'hidden',
		borderRadius: 24,
	},
	slide: {
		flex: 1,
		paddingHorizontal: 2,
		paddingVertical: 2,
	},
	imageContainer: {
		flex: 1,
		overflow: 'hidden',
		borderRadius: 22,
		backgroundColor: '#202957',
	},
	image: {
		width: '100%',
		height: '100%',
	},
	imageCaption: {
		position: 'absolute',
		right: 0,
		bottom: 0,
		left: 0,
		paddingHorizontal: 18,
		paddingVertical: 18,
		backgroundColor: 'rgba(177, 182, 212, 0.7)',
	},
	imageTitle: {
		color: '#fff',
		fontSize: 18,
		fontWeight: '700',
	},
});
