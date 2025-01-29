import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Logo = () => (
  <View style={styles.container}>
    <Image
      source={require('../assets/images/C-Mex_Logo.png')}
      style={styles.logo}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});

export default Logo;
