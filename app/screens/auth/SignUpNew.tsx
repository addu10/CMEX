// screens/Auth/SignupScreen.tsx
import React, { useState, useRef, useContext } from 'react';
import { ScrollView, Animated, Text, Alert } from 'react-native';
import { globalStyles } from '../../../theme/styles';
import Logo from '../../../components/Logo';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import PickerComponent from '../../../components/PickerComponent';
import { supabase } from '../../../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../_layout';

const SignupScreen = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    catRegNo: '',
    phoneNo: '',
    department: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [key]: value });
    return Promise.resolve(true);
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const nextStep = (): Promise<boolean> => {
    return new Promise((resolve) => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(currentStep + 1);
        fadeIn();
        resolve(true);
      });
    });
  };

  const prevStep = (): Promise<boolean> => {
    return new Promise((resolve) => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentStep(currentStep - 1);
        fadeIn();
        resolve(true);
      });
    });
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleSignup = async (): Promise<boolean> => {
    try {
      setIsLoading(true);

      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match!');
        return false;
      }

      if (!formData.username || !formData.password || !formData.department || !formData.catRegNo) {
        Alert.alert('Error', 'All fields are required!');
        return false;
      }

      console.log('[Signup Debug] Attempting to create user...');

      // Insert the new user into the users table
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            username: formData.username,
            password: formData.password, // In production, ensure this is properly hashed
            first_name: formData.firstName,
            last_name: formData.lastName,
            cat_reg_no: formData.catRegNo,
            phone_no: formData.phoneNo,
            department: formData.department,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error('[Signup Debug] Error creating user:', insertError);
        Alert.alert('Error', insertError.message);
        return false;
      }

      console.log('[Signup Debug] User created successfully:', newUser);

      // Create a session token
      const sessionData = {
        id: newUser.id,
        username: newUser.username,
        timestamp: new Date().toISOString(),
      };

      // Store the session token
      await AsyncStorage.setItem('userToken', JSON.stringify(sessionData));
      console.log('[Signup Debug] Session stored successfully');

      // Update auth context
      setIsAuthenticated(true);
      console.log('[Signup Debug] Authentication state updated, redirecting...');
      
      // The router.replace call is no longer needed here as the useProtectedRoute hook
      // in the root layout will handle navigation based on auth state

      return true;
    } catch (error) {
      console.error('[Signup Debug] Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={globalStyles.container}>
      <Logo />
      <Text style={globalStyles.title}>Welcome to C-MEX!</Text>
      <Text style={globalStyles.subtitle}>Buy, Sell, Rent—All in One Place</Text>
      <Animated.View style={[globalStyles.stepContainer, { opacity: fadeAnim }]}>
        {currentStep === 1 && (
          <>
            <InputField placeholder="First Name" value={formData.firstName} onChangeText={(text) => handleChange('firstName', text)} />
            <InputField placeholder="Last Name" value={formData.lastName} onChangeText={(text) => handleChange('lastName', text)} />
            <Button title="Continue" onPress={nextStep} />
          </>
        )}
        {currentStep === 2 && (
          <>
            <InputField placeholder="CAT Registration No." value={formData.catRegNo} keyboardType="phone-pad" onChangeText={(text) => handleChange('catRegNo', text)} />
            <InputField placeholder="Phone Number" value={formData.phoneNo} keyboardType="phone-pad" onChangeText={(text) => handleChange('phoneNo', text)} />
            <PickerComponent
              selectedValue={formData.department}
              onValueChange={(value) => handleChange('department', value)}
              items={[
                { label: 'Select Department', value: '' },
                { label: 'IT', value: 'IT' },
                { label: 'SE', value: 'SE' },
                { label: 'CS', value: 'CS' },
                { label: 'EEE', value: 'EEE' },
                { label: 'CE', value: 'CE' },
                { label: 'EC', value: 'EC' },
                { label: 'ME', value: 'ME' },
              ]}
            />
            <Button title="Back" onPress={prevStep} />
            <Button title="Continue" onPress={nextStep} />
          </>
        )}
        {currentStep === 3 && (
          <>
            <InputField placeholder="Username" value={formData.username} onChangeText={(text) => handleChange('username', text)} />
            <InputField placeholder="Set Password" value={formData.password} secureTextEntry onChangeText={(text) => handleChange('password', text)} />
            <InputField placeholder="Confirm Password" value={formData.confirmPassword} secureTextEntry onChangeText={(text) => handleChange('confirmPassword', text)} />
            <Button title="Back" onPress={prevStep} />
            <Button 
              title={isLoading ? "Creating Account..." : "Sign Up"} 
              onPress={handleSignup}
              disabled={isLoading}
            />
          </>
        )}
      </Animated.View>
    </ScrollView>
  );
};

export default SignupScreen;
