
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../components/providers/UserContext';
import { useTranslation } from '../components/providers/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

function BackgroundPattern() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={{ ...StyleSheet.absoluteFillObject, overflow: 'hidden' }}>
        {[...Array(25)].map((_, row) => (
          <View
            key={row}
            style={[
              { position: 'absolute', flexDirection: 'row', gap: 15, width: '120%' },
              { top: `${row * 4.5}%`, left: row % 2 ? -20 : 0 },
            ]}
          >
            {[...Array(15)].map((_, column) => (
              <Text
                key={column}
                style={{
                  color: '#43257f',
                  opacity: 0.15,
                  fontSize: 24,
                  fontWeight: '800',
                  transform: [{ rotate: '15deg' }],
                }}
              >
                ›
              </Text>
            ))}
          </View>
        ))}
      </View>
      
      {/* Bottom glowing columns */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '25%', backgroundColor: 'rgba(57, 34, 150, 0.4)' }} />
      {[
        { left: '5%', height: '18%', width: 25 },
        { left: '15%', height: '12%', width: 20 },
        { left: '30%', height: '15%', width: 30 },
        { left: '50%', height: '20%', width: 15 },
        { left: '70%', height: '16%', width: 35 },
        { left: '85%', height: '19%', width: 20 },
        { left: '95%', height: '23%', width: 15 },
      ].map((col, index) => (
        <View
          key={index}
          style={[{ position: 'absolute', bottom: 0, backgroundColor: 'rgba(92, 114, 255, 0.25)' }, col]}
        />
      ))}
    </View>
  );
}

function BrandMark() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Image 
        source={require('../assets/edaa-connect-icon.png')}
        style={{ width: 32, height: 32, resizeMode: 'contain' }} 
      />
      <View style={{ width: 1.5, height: 28, marginLeft: 12, backgroundColor: '#cbd5e1' }} />
    </View>
  );
}

export default function LoginScreen({ navigation }) {
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const { setNin } = useUser();
  const { t, language, toggleLanguage, isRtl } = useTranslation();

  const text = {
    title: t('loginTitle'),
    language: language === 'en' ? 'العربية' : 'English',
    identity: t('identity'),
    identityPlaceholder: t('identityPlaceholder'),
    password: t('password'),
    passwordPlaceholder: t('passwordPlaceholder'),
    keepSignedIn: t('keepSignedIn'),
    forgotPassword: t('forgotPassword'),
    login: t('loginBtn'),
    or: t('or'),
    biometric: t('biometric'),
    createAccount: t('createAccountPrompt'),
    register: t('register'),
    copyright: t('copyright') || '© Edaa Connect',
  };

  const handleBiometricLogin = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      Alert.alert(
        text.title,
        language === 'en'
          ? 'Biometrics not available on this device.'
          : 'البصمة غير متوفرة على هذا الجهاز.'
      );
      return;
    }

    const auth = await LocalAuthentication.authenticateAsync({
      promptMessage: language === 'en' ? 'Sign in to your account' : 'تسجيل الدخول إلى حسابك',
    });

    if (auth.success) {
        navigation.navigate('Home');
    }
  };

  const handleLogin = async () => {
    if (!identity.trim() || !password) {
      Alert.alert(text.title, text.errMissing);
      return;
    }

    try {
      await AsyncStorage.setItem('saved_identity', identity.trim());
      await AsyncStorage.setItem('saved_password', password);
    } catch (error) {
      console.error('Error saving data', error);
    }

    setNin(identity.trim());
    Alert.alert(t('loginTitle'), t('successMsg'), [
      {
        text: 'OK',
        onPress: () => navigation.navigate('Home'),
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f143a' }} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#0f143a" />
      <BackgroundPattern />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
            <BrandMark />
            <Text style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', color: '#fff', fontSize: 18, fontWeight: '700' }}>
              {text.title}
            </Text>
            <Pressable onPress={toggleLanguage} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="sunny-outline" size={22} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>{text.language}</Text>
            </Pressable>
          </View>

          {/* Top Navigation Row: Back Button */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
            <Pressable
              onPress={() => navigation?.canGoBack?.() && navigation.goBack()}
              style={{ width: 40, height: 40, justifyContent: 'center' }}
            >
              <Ionicons name={isRtl ? 'arrow-forward' : 'arrow-back'} size={26} color="#fff" />
            </Pressable>

            <View style={{ width: 40, height: 40 }} />
          </View>

          {/* Form */}
          <View style={{ marginTop: 24 }}>
            {/* Identity Input */}
            <Text style={{ color: '#f8fafc', fontSize: 15, marginBottom: 8, textAlign: isRtl ? 'right' : 'left' }}>
              {text.identity}
            </Text>
            <TextInput
              value={identity}
              onChangeText={setIdentity}
              placeholder={text.identityPlaceholder}
              placeholderTextColor="#68788c"
              keyboardType="default"
              autoCapitalize="none"
              style={[
                { height: 52, borderRadius: 8, backgroundColor: '#0c223a', paddingHorizontal: 16, color: '#fff', fontSize: 15, marginBottom: 20 },
                isRtl && { textAlign: 'right' }
              ]}
            />

            {/* Password Input */}
            <Text style={{ color: '#f8fafc', fontSize: 15, marginBottom: 8, textAlign: isRtl ? 'right' : 'left' }}>
              {text.password}
            </Text>
            <View style={{ height: 52, borderRadius: 8, backgroundColor: '#0c223a', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 }}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={text.passwordPlaceholder}
                placeholderTextColor="#68788c"
                secureTextEntry={!showPassword}
                style={[
                  { flex: 1, height: '100%', color: '#fff', fontSize: 15 },
                  isRtl && { textAlign: 'right' }
                ]}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={{ width: 40, height: 52, alignItems: 'flex-end', justifyContent: 'center' }}
              >
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#f8fafc" />
              </Pressable>
            </View>

            {/* Options Row */}
            <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
              <Pressable
                onPress={() => setKeepSignedIn(!keepSignedIn)}
                style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center', gap: 10 }}
              >
                <View style={[
                  { width: 44, height: 26, borderWidth: 1, borderColor: '#475569', borderRadius: 15, justifyContent: 'center', paddingHorizontal: 2 },
                  keepSignedIn && { borderColor: '#a855f7' }
                ]}>
                  <View style={[
                    { width: 20, height: 20, borderRadius: 10, backgroundColor: '#94a3b8' },
                    keepSignedIn && { alignSelf: 'flex-end', backgroundColor: '#c084fc' }
                  ]} />
                </View>
                <Text style={{ color: '#fff', fontSize: 15 }}>{text.keepSignedIn}</Text>
              </Pressable>
              
              <Pressable onPress={() => Alert.alert(text.forgotPassword)}>
                <Text style={{ color: '#fff', fontSize: 15 }}>{text.forgotPassword}</Text>
              </Pressable>
            </View>

            {/* Login Button */}
            <Pressable onPress={handleLogin} style={{ height: 54, borderRadius: 10, backgroundColor: '#8b3dff', alignItems: 'center', justifyContent: 'center', marginTop: 32 }}>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>{text.login}</Text>
            </Pressable>

            {/* OR Divider */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 40, marginBottom: 20 }}>
              <View style={{ height: 1, flex: 1, backgroundColor: '#334155' }} />
              <Text style={{ color: '#fff', fontSize: 16 }}>{text.or}</Text>
              <View style={{ height: 1, flex: 1, backgroundColor: '#334155' }} />
            </View>

            {/* Biometric Button */}
            <Pressable onPress={handleBiometricLogin} style={{ alignSelf: 'center', alignItems: 'center', marginTop: 10 }}>
              <View style={{ width: 75, height: 60, borderWidth: 1, borderColor: '#f8fafc', borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="finger-print-outline" size={32} color="#f8fafc" />
              </View>
              <Text style={{ color: '#fff', fontSize: 15, marginTop: 10 }}>{text.biometric}</Text>
            </Pressable>

            

            {/* Register Link */}
            <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', justifyContent: 'center', marginTop: 45 }}>
              <Text style={{ color: '#fff', fontSize: 15 }}>{text.createAccount} </Text>
              <Pressable onPress={() => navigation.navigate('Register')}>
                <Text style={{ color: '#d8b4fe', fontSize: 15, textDecorationLine: 'underline' }}>{text.register}</Text>
              </Pressable>
            </View>
          </View>

          {/* Footer */}
          <View style={{ marginTop: 'auto', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#475569', paddingTop: 12, paddingBottom: 8, alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 13, textAlign: 'center' }}>{text.copyright}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
