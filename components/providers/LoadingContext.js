import React, { createContext, useState, useContext } from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext); //custom hook


export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false); 

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      
      {/* Loading */}
      <Modal transparent={true} animationType="fade" visible={isLoading}>
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#8b3dff" />
        </View>
      </Modal>
    </LoadingContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});