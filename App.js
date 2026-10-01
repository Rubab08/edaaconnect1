import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';

import OnboardingScreen from './app/onboarding';
import LoginScreen from './app/login';
import RegisterScreen from './app/register';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} style={styles.drawerContent}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>Hello welcome</Text>
      </View>
    </DrawerContentScrollView>
  );
}

function LoginDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="LoginMain"
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="LoginMain" component={LoginScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginDrawer} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    backgroundColor: '#a671d4',
  },
  drawerHeader: {
    padding: 24,
    marginTop: 20,
  },
  drawerTitle: {
    color: '#1b0835',
    fontSize: 18,
    fontWeight: '700',
  },
});
