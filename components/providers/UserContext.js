import React, { createContext, useContext, useState } from 'react';

// Context
const UserContext = createContext(undefined);

//  Provider
export function UserProvider({ children }) {
  const [nin, setNin] = useState('');

  return (
    <UserContext.Provider value={{ nin, setNin }}>
      {children}
    </UserContext.Provider>
  );
}
//custom hook
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}