import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import ActionSheetProvider from './components/providers/ActionSheetProvider';
import { UserProvider } from './components/providers/UserContext';
import AppNavigator from './components/navigation/AppNavigator';


export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
      <UserProvider>
        <ActionSheetProvider>
          <AppNavigator />
        </ActionSheetProvider>
      </UserProvider>
</LanguageProvider>
    </GestureHandlerRootView>
  );
}
      
