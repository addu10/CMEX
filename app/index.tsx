import React from 'react';
import { View, Text, Button } from 'react-native';
import { Link } from 'expo-router';
import { NavigationContainer } from '@react-navigation/native';
import { HomeStack } from '../navigation/stack'

export default function Home() {
  return <HomeStack />;
}
