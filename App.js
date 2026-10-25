import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import ActionSheetProvider from './components/providers/ActionSheetProvider';
import { UserProvider } from './components/providers/UserContext';
import AppNavigator from './components/navigation/AppNavigator';
import { LanguageProvider } from './components/providers/LanguageContext';
import { LoadingProvider } from './components/providers/LoadingContext'; 
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider config={config}>
        <LanguageProvider>
          <UserProvider>
            <ActionSheetProvider>
              <LoadingProvider> 
                <AppNavigator />
              </LoadingProvider>
            </ActionSheetProvider>
          </UserProvider>
        </LanguageProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}