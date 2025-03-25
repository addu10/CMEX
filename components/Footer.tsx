import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { router } from 'expo-router';

type HeaderNavigationProp = StackNavigationProp<RootStackParamList, 'SignupScreen'>;

const Footer = () => {
  const navigation = useNavigation<HeaderNavigationProp>();

  return (
    <View style={{ alignItems: 'center', padding: 16 }}>
      <Text>Don't have an account?</Text>
      <TouchableOpacity onPress={() => router.push('/screens/auth/router/signup')}>
        <Text style={{ color: '#000', fontWeight: 'bold' }}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;
