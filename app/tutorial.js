import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLoading } from '../components/providers/LoadingContext'; 

export default function TutorialScreen({ route, navigation }) {
  const { identity } = route.params;
  const { setIsLoading } = useLoading(); 
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem(`@tutorialCompleted_${identity}`, 'true');
    } catch (error) {
      console.error("Error saving tutorial state", error);
    } finally {
      navigation.replace('Home');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f143a" />
      <View style={styles.content}>
        <Text style={styles.title}>How it Works</Text>
        <Text style={styles.text}>1. Register with your National ID / IQAMA.</Text>
        <Text style={styles.text}>2. Log in securely to access your dashboard.</Text>
        <Text style={styles.text}>3. Manage your account from the Home screen.</Text>
      </View>
      
      <Pressable onPress={handleSkip} style={styles.button}>
        <Text style={styles.buttonText}>Skip Tutorial</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f143a', padding: 24, justifyContent: 'space-between' },
  content: { flex: 1, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  text: { color: '#dbeafe', fontSize: 16, marginBottom: 16, lineHeight: 24 },
  button: { backgroundColor: '#8b3dff', borderRadius: 10, height: 54, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' }
});