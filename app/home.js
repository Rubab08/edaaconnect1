import React from 'react';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f143a" />

      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.getParent()?.openDrawer()}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={28} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Home</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.container}>
        <Text style={styles.eyebrow}>Welcome</Text>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.subtitle}>You have successfully signed in to your dashboard.</Text>


        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Back to Login</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f143a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  eyebrow: {
    color: '#c4b5fd',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: '#dbeafe',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#1e2a5a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#4338ca',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardText: {
    color: '#dbeafe',
    fontSize: 15,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#8b3dff',
    borderRadius: 10,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
