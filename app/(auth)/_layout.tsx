import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  console.log('[Auth Layout Debug] Rendering auth layout');
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: 'fade'
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
} 