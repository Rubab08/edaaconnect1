import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';


import OnboardingScreen from './app/onboarding';
import LoginScreen from './app/login';
import RegisterScreen from './app/register';
import HomeScreen from './app/home';
import ProfileScreen from './app/profile';
import SettingsScreen from './app/settings';
import { FadeIn, FadeInLeft } from 'react-native-reanimated';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tabs = createBottomTabNavigator();

function CustomDrawerContent(props) {
  const drawerItems = [
    { label: 'Home', target: 'HomeMain' },
    { label: 'Login', target: 'Login' },
    { label: 'Register', target: 'Register' },
  ];

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContent}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>MAIN MENU</Text>
      </View>

      {drawerItems.map((item) => (
        <View key={item.label} style={styles.drawerItemWrap}>
          <Text
            style={styles.drawerItem}
            onPress={() => {
          
              props.navigation.navigate(item.target);
            }}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </DrawerContentScrollView>
  );
}

function HomeDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="HomeMain"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 220,
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="HomeMain" component={HomeTabs} />
    </Drawer.Navigator>
  );
}

function HomeTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#8b3dff',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopColor: '#e2e8f0',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            HomeMain: 'home-outline',
            Profile: 'person-outline',
            Settings: 'settings-outline',
          };

          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="HomeMain" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
      <Tabs.Screen name="Settings" component={SettingsScreen} />
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    backgroundColor: '#7e48ae',
    paddingTop: 12,
  },
  drawerHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  drawerTitle: {
    color: '#1b0835',
    fontSize: 17,
    fontWeight: '700',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(27, 8, 53, 0.12)',
  },
  drawerItemWrap: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(27, 8, 53, 0.12)',
  },
  drawerItem: {
    color: '#1b0835',
    fontSize: 16,
    fontWeight: '600',
  },
});
