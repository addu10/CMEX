import React from 'react';
import { View, StyleSheet } from 'react-native';
import SignupScreen from '../screens/auth/SignupScreen';

export default function Signup() {
  return (
    <View style={styles.container}>
      <SignupScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 