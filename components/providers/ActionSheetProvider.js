import React from 'react';
import { ActionSheetProvider as NativeActionSheetProvider } from '@expo/react-native-action-sheet';

export default function ActionSheetProvider({ children }) {
  return (
    <NativeActionSheetProvider useCustomActionSheet={true}>
      {children}
    </NativeActionSheetProvider>
  );
}
