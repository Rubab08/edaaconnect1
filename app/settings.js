
import React from 'react';

import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Shared theme manager
import { useAppTheme } from '../components/theme/ThemeManager';

export default function SettingsScreen() {

  // Theme shared across all screens
  const { theme, mode, toggleTheme } = useAppTheme();

  const settings = [
    { id: '1', title: 'Profile' },
    { id: '2', title: 'Notifications' },
    { id: '3', title: 'Privacy' },
    { id: '4', title: 'Security' },
  ];

  const renderSetting = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.settingItem,
        {
          backgroundColor: theme.surface,
        },
      ]}
    >
      <Text
        style={[
          styles.settingText,
          { color: theme.text },
        ]}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.background },
      ]}
    >

      <StatusBar
        barStyle={theme.statusBarStyle}
        backgroundColor={theme.background}
      />

      <View style={styles.container}>

        {/* Header and Theme Toggle */}
        <View style={styles.header}>

          <Text
            style={[
              styles.message,
              { color: theme.text },
            ]}
          >
            Settings
          </Text>

          <TouchableOpacity
            onPress={toggleTheme}
            style={styles.themeButton}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Toggle dark and light mode"
          >
            <Ionicons
              name={
                mode === 'dark'
                  ? 'sunny-outline'
                  : 'moon-outline'
              }
              size={25}
              color={theme.text}
            />
          </TouchableOpacity>

        </View>

        <FlatList
          data={settings}
          renderItem={renderSetting}
          keyExtractor={(item) => item.id}
        />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },

  message: {
    fontSize: 28,
    fontWeight: '800',
  },

  themeButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(139,61,255,0.15)',
  },

  settingItem: {
    padding: 18,
    marginBottom: 12,
    borderRadius: 10,
  },

  settingText: {
    fontSize: 18,
    fontWeight: '600',
  },

});
