import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
	Alert,
	Image,
	Pressable,
	StatusBar,
	Text,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../components/providers/LanguageContext';


export default function OnboardingScreen({ navigation }) {


	const {t, language, toggleLanguage } = useLanguage();

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#1e2343' }} edges={['top', 'bottom']}>
			<StatusBar barStyle="light-content" backgroundColor="#1e2343" />
			<View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8 }}>
				<View style={{ height: 42, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
					<Text style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', color: '#fff', fontSize: 20, fontWeight: '700' }}>{text.title}</Text>
					<Pressable
						accessibilityRole="button"
						accessibilityLabel={language === 'en' ? 'Change language' : 'تغيير اللغة'}
						onPress={() => setLanguage(language === 'en' ? 'ar' : 'en')}
						style={{ flexDirection: 'row', alignItems: 'center', gap: 8, zIndex: 1 }}
					>
						<Ionicons name="sunny" size={24} color="#fff" />
						<Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>{text.language}</Text>
					</Pressable>
				</View>

				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 70 }}>
					<Image
						source={require('../assets/onboarding scren 5.png')}
						style={{ width: 300, height: 239 }}
						resizeMode="contain"
						accessibilityLabel="Edaa Connect logo"
					/>
				</View>

				<View style={{ marginBottom: 24 }}>
					<Pressable
						accessibilityRole="button"
						onPress={() => navigation.navigate('Login')}
						style={{ height: 48, borderRadius: 9, backgroundColor: '#8124ee', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}
					>
						<Text style={{ color: '#fff', fontSize: 19, fontWeight: '500' }}>{text.login}</Text>
					</Pressable>
					<Pressable
						accessibilityRole="button"
						onPress={() => navigation.navigate('Register')}
						style={{ height: 48, borderRadius: 9, backgroundColor: '#3c30b7', alignItems: 'center', justifyContent: 'center' }}
					>
						<Text style={{ color: '#fff', fontSize: 18, fontWeight: '500', textAlign: 'center' }}>{text.createAccount}</Text>
					</Pressable>
				</View>

				<View style={{ borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.65)', paddingTop: 7, paddingBottom: 4, marginHorizontal: 10 }}>
					<Text style={{ color: '#fff', textAlign: 'center', fontSize: 14, lineHeight: 22 }}>{text.copyright}</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}