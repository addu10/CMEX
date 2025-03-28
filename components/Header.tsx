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
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 ,paddingHorizontal: 8,marginTop: 5}}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <Image
        source={require('../assets/images/C-Mex_Logo.png')}
        style={{ width: 29, height: 29, resizeMode: 'contain' }}
      />
      <Text style={{ fontSize: 22, color: '#000', fontWeight: 'bold', fontFamily: 'Lexend_400Regular' }}>C-MEX</Text>
      </View>
      <TouchableOpacity onPress={navigateToSaved}>
        <Ionicons name="heart-outline" size={25} color="black"/>
      </TouchableOpacity>
    </View>
  );
};

export default Header;