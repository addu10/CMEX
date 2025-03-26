import React from 'react';
import { Stack } from 'expo-router';

export default function UserProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="edit-profile" 
      />
      <Stack.Screen 
        name="my-listings" 
      />
      <Stack.Screen 
        name="change-password" 
      />
      <Stack.Screen 
        name="order-history" 
      />
      <Stack.Screen 
        name="help-support" 
      />
      <Stack.Screen 
        name="terms-conditions" 
      />
      <Stack.Screen 
        name="delete-account" 
      />
    </Stack>
  );
} 