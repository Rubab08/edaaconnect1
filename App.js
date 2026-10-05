import 'react-native-gesture-handler';
import React from 'react';
import ActionSheetProvider from './components/providers/ActionSheetProvider';
import AppNavigator from './components/navigation/AppNavigator';

export default function App() {
  return (
    <ActionSheetProvider>
      <AppNavigator />
    </ActionSheetProvider>
  );
}
