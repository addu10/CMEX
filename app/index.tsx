import React from 'react';
import { View, Text, Button } from 'react-native';
import { Link } from 'expo-router';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from '../app/screens/Main/HomeScreen'
import TabNavigation from '@/navigation/TabNavigation';
import LoginScreen from './screens/auth/LoginScreen';
import SignupScreen from './screens/auth/SignupScreen';

export default function Home() {
  return(
    <View>
    <SignupScreen />
    </View>
 )
}
 