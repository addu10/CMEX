import React, { useEffect } from 'react';
import LoginScreen from '../screens/auth/LoginScreen';

export default function AuthIndex() {
  useEffect(() => {
    console.log('[Auth Debug] Rendering auth index directly with LoginScreen');
  }, []);
  
  return <LoginScreen />;
} 