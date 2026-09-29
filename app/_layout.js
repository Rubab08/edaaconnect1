import '../global.css';
import { Stack } from 'expo-router';

export default function RootLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen
				name="onboarding"
				options={{ animation: 'slide_from_left', animationTypeForReplace: 'push' }}
			/>
			<Stack.Screen
				name="login"
				options={{ animation: 'slide_from_right', animationTypeForReplace: 'push' }}
			/>
			<Stack.Screen
				name="register"
				options={{ animation: 'slide_from_right', animationTypeForReplace: 'push' }}
			/>
		</Stack>
	);
}