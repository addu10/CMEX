import React from 'react';
import { View, Text, Button } from 'react-native';
import { Link } from 'expo-router';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from '../app/screens/Main/HomeScreen'
import TabNavigation from '@/navigation/TabNavigation';

export default function Home() {
  return(
    <GestureHandlerRootView style={{ flex: 1 }}>
    <View>
      
      <HomeScreen/>
      <View>
      <TabNavigation />
      </View>
      

      
    </View>
    </GestureHandlerRootView>
 )
}
 