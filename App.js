import React, { useState, useRef } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import UserInactivity from 'react-native-user-inactivity';
import { createNavigationContainerRef } from '@react-navigation/native';

import ActionSheetProvider from './components/providers/ActionSheetProvider';
import { UserProvider } from './components/providers/UserContext';
import AppNavigator from './components/navigation/AppNavigator';
import { LanguageProvider } from './components/providers/LanguageContext';
import { LoadingProvider } from './components/providers/LoadingContext';

import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';

// USERINACTIVITY SESSION FOR WHOLE APP

export const navigationRef = createNavigationContainerRef();// control navigation anywhere in the whole app

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const expiredRef = useRef(false);
 // Check if user is inside Home
  const handleNavigationChange = () => {
    if (!navigationRef.isReady()) return;

    const currentScreen =
      navigationRef.getCurrentRoute()?.name;

    setIsLoggedIn(currentScreen === 'Home');
  };

  // Handle session timeout
  const handleInactivity = (isInactive) => {
    if (!isInactive || !isLoggedIn || expiredRef.current) return;

    expiredRef.current = true;

    Alert.alert(
      'Session Expired',
      'Please log in again.',
      [
        {
          text: 'OK',
          onPress: () => {
            navigationRef.resetRoot({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            });

            setIsLoggedIn(false);
            expiredRef.current = false;
          },
        },
      ],
      { cancelable: false }
    );
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider config={config}>
        <LanguageProvider>
          <UserProvider>
            <ActionSheetProvider>
              <LoadingProvider>

                <UserInactivity
                  timeForInactivity={5000}
                  onAction={handleInactivity}
                  isActive={isLoggedIn && !expiredRef.current}
                  style={{ flex: 1 }}
                >
                  <AppNavigator
                    navigationRef={navigationRef}
                    onNavigationChange={handleNavigationChange}
                    onNavigationReady={handleNavigationChange}
                  />
                </UserInactivity>

              </LoadingProvider>
            </ActionSheetProvider>
          </UserProvider>
        </LanguageProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}