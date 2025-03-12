import React from 'react';
import { View, Text, Button } from 'react-native';
import { Link } from 'expo-router';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from '../app/screens/Main/HomeScreen'
import TabNavigation from '@/navigation/TabNavigation';
import LoginScreen from './screens/auth/LoginScreen';
import SignupScreen from './screens/auth/SignupScreen';
import { AppNavigator } from '@/navigation/stack';

import { Redirect, router } from 'expo-router';
import { useEffect } from 'react';

export default function Home() {

  return (
    <View>
      <LoginScreen />
    </View>

  )

}
/*
export default function Index() {
  useEffect(() => {
    // Programmatically navigate instead of using Redirect component
    router.replace('/screens/auth/router/login');
  }, []);

  return null;
}*/

