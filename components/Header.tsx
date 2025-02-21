// components/Header.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Svg, Path } from 'react-native-svg';
import { useFonts, Lexend_400Regular } from '@expo-google-fonts/lexend';

const Header = () => {
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <Image
        source={require('../assets/images/C-Mex_Logo.png')}
        style={{ width: 40, height: 40, resizeMode: 'contain' }}
      />
      <Text style={{ fontSize: 20, color: '#000', fontWeight: 'bold', fontFamily: 'Lexend_400Regular' }}>C.M.E.X</Text>
      <TouchableOpacity>
        <Ionicons name="notifications-outline" size={30} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;