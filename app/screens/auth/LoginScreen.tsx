import React, { useState, useContext, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../../lib/supabase';
import { AuthContext } from '../../_layout';
import { globalStyles } from '../../../theme/styles';
import Logo from '../../../components/Logo';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    console.log('[LoginScreen] Component mounted');
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      console.log('[Login] Attempting login with email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('[Login] Authentication error:', error);
        Alert.alert('Login Failed', error.message);
        return;
      }

      if (!data.session) {
        console.log('[Login] No session returned');
        Alert.alert('Login Failed', 'Could not establish session');
        return;
      }

      console.log('[Login] Login successful, session established');
      setIsAuthenticated(true);
      
    } catch (error) {
      console.error('[Login] Login error details:', error);
      Alert.alert('Login Failed', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={globalStyles.container}>
              <View style={styles.logoWrapper}>
                <Logo />
              </View>
              <View style={globalStyles.logoContainer}>
                <Text style={styles.logoText}>C-MEX</Text>
                <Text style={globalStyles.subtitle}>Buy, Sell, Rent—All in One Place</Text>
              </View>
              
              <View style={styles.formContainer}>
                <Text style={globalStyles.title}>Login to Your Account</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <TextInput
                    style={globalStyles.input}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#999"
                  />
                </View>
                
                <TouchableOpacity 
                  style={styles.forgotPasswordContainer}
                  onPress={() => {/* Navigate to password reset */}}
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[globalStyles.button, isLoading && styles.buttonDisabled]} 
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <Text style={globalStyles.buttonText}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Text>
                </TouchableOpacity>
                
                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>Don't have an account? </Text>
                  <Link href="/(auth)/signup" asChild>
                    <TouchableOpacity>
                      <Text style={styles.signupLink}>Sign Up</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 50, // Add extra padding at the bottom
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: '#666',
    fontSize: 14,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
    color: '#666',
  },
  signupLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#b1f03d',
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 5,
  },
});

export default LoginScreen;
