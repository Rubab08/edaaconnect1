
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useAppTheme } from './ThemeManager';

export default function ThemeToggle() {

  const { theme, mode, toggleTheme } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[
        styles.themeButton,
        { backgroundColor: theme.surfaceAlt }
      ]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Toggle light and dark mode"
    >
      <Ionicons
        name={mode === 'dark' ? 'sunny-outline' : 'moon-outline'}
        size={25}
        color={theme.text}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  themeButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
