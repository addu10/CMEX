import React from 'react';
import { View, StyleSheet } from 'react-native';
import LoginScreen from '../screens/auth/LoginScreen';

export default function Login() {
  return (
    <View style={styles.container}>
      <LoginScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 