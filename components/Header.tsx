// components/Header.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Svg, Path } from 'react-native-svg';
import { useFonts, Lexend_400Regular } from '@expo-google-fonts/lexend';
import { useRouter } from 'expo-router';

const Header = () => {
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
  });
  
  const router = useRouter();
  
  const navigateToSaved = () => {
    router.push('/saved');
  };

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
      <TouchableOpacity onPress={navigateToSaved}>
        <Ionicons name="heart-outline" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;