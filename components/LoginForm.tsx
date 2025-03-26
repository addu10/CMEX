// LoginForm.tsx
import React, { useState, useContext, useEffect } from 'react';
import { View, Alert, StyleSheet, Text } from 'react-native';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputField from './InputField';
import Button from './Button';
import { AuthContext } from '../app/_layout';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    console.log('[LoginForm Debug] LoginForm component mounted');
  }, []);

  console.log('[LoginForm Debug] Rendering LoginForm');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      console.log('[Login Debug] Attempting login with email:', email);
      
      // Use Supabase Auth instead of direct table query
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('[Login Debug] Auth response:', data ? 'Session exists' : 'No session');

      if (error) {
        console.error('[Login Debug] Authentication error:', error);
        Alert.alert('Login Failed', error.message);
        return;
      }

      if (!data.session) {
        console.log('[Login Debug] No session returned');
        Alert.alert('Login Failed', 'Could not establish session');
        return;
      }

      console.log('[Login Debug] Login successful, session established');
      
      // Supabase handles token storage, just update auth state
      setIsAuthenticated(true);
      
      console.log('[Login Debug] Authentication state updated, redirecting...');
    } catch (error) {
      console.error('[Login Debug] Login error details:', error);
      if (error instanceof Error) {
        Alert.alert('Login Failed', error.message);
      } else {
        Alert.alert('Login Failed', 'An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Log In</Text>
      <InputField
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        secureTextEntry={false}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <InputField
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        style={styles.input}
      />
      <Button 
        title={isLoading ? "Logging in..." : "Login"} 
        onPress={handleLogin}
        disabled={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  }
});

export default LoginForm;