import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
	return (
		<SafeAreaView style={styles.safeArea}>
			<StatusBar barStyle="light-content" backgroundColor="#09156e" />
			<View style={styles.container}>
				<Text style={styles.message}>Welcome to profile</Text>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#0f143a',
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 24,
	},
	message: {
		color: '#fff',
		fontSize: 28,
		fontWeight: '900',
		textAlign: 'center',
	},
});
