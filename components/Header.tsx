// components/Header.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Svg, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'; // Import the StackNavigationProp
import { RootStackParamList } from '../types/types'; // Import your types

// Type the navigation prop
type HeaderNavigationProp = StackNavigationProp<RootStackParamList, 'SignupScreen'>;

const Header = () => {
  const navigation = useNavigation<HeaderNavigationProp>(); // Specify the navigation type

  const handleNavigate = () => {
    navigation.navigate('LoginScreen'); // Navigate to SignupScreen
  };
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <Image
        source={require('../assets/images/C-Mex_Logo.png')}
        style={{ width: 40, height: 40, resizeMode: 'contain' }}
      />
      <Text style={{ fontSize: 20, color: '#000', fontWeight: 'bold' }}>CMEX</Text>
      <TouchableOpacity onPress={()=>navigation.navigate('LoginScreen')}>
        <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#000" height={30} width={30}>
          <Path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </Svg>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
