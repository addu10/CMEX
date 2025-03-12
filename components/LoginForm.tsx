// LoginForm.tsx
import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase'; // Adjust the path as needed
import InputField from './InputField';
import Button from './Button';
import { globalStyles } from '../theme/styles';


const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);

    try {
      // Direct query to your custom users table in public schema
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .limit(1);

      console.log('Query response:', { data, error });

      if (error) {
        console.error('Database error:', error);
        Alert.alert('Login Failed', 'Database error occurred');
        return;
      }

      if (!data || data.length === 0) {
        Alert.alert('Login Failed', 'Invalid username or password');
        return;
      }

      const user = data[0];
      if (user.password === password) {
        // Store the user data in local state or context
        // Instead of using supabase.auth, we'll store the session ourselves
        try {
          // You might want to use AsyncStorage or similar for persistence
          const sessionData = {
            id: user.id,
            username: user.username,
            // Add other user fields you want to store
          };

          // Navigate to home screen
          Alert.alert('Success', 'Login successful!', [
            {
              text: 'OK',
              onPress: () => {
                // You might want to set this data in a global state manager
                router.push('/screens/auth/router/home');
              }
            }
          ]);
        } catch (sessionError) {
          console.error('Session storage error:', sessionError);
          Alert.alert('Error', 'Failed to store session data');
        }
      } else {
        Alert.alert('Login Failed', 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login error details:', error);
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
    <View style={globalStyles.stepContainer}>
      <InputField
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        secureTextEntry={false}
      />
      <InputField
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <Button title="Login" onPress={handleLogin} />

    </View>
  );
};

export default LoginForm;