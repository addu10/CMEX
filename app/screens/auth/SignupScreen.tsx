import React, { useState, useRef } from 'react';
import { ScrollView, Animated, Text, StyleSheet, View } from 'react-native';
import { globalStyles } from '../../../theme/styles';
import Logo from '../../../components/Logo';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import BackButton from '../../../components/BackButton';
import PickerComponent from '../../../components/PickerComponent';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/types';
import { supabase } from '../../../lib/supabase';
import { router } from 'expo-router';
type HeaderNavigationProp = StackNavigationProp<RootStackParamList, 'SignupScreen'>;

const SignupScreen = () => {
  const navigation = useNavigation<HeaderNavigationProp>();

  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!formData.username || !formData.password || !formData.department || !formData.catRegNo) {
      alert('All fields are required!');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting user data to Supabase...');


      const userData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        cat_reg_no: formData.catRegNo,
        phone_no: formData.phoneNo,
        department: formData.department,
        username: formData.username,
        password: formData.password, // Note: In production, you should hash passwords
      };

      console.log('User data being sent:', userData);

      // Using the Supabase client to insert data
      const { data, error } = await supabase
        .from('users')
        .insert([userData]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Signup successful!');
      alert('Signup successful!');
      router.push('/screens/auth/router/login')
    } catch (error) {
      console.error('Signup error details:', error);
      if (error instanceof Error) {
        alert(`Signup failed: ${error.message}`);
      } else {
        alert('An unknown error occurred during signup.');
      }
    } finally {
      setIsSubmitting(false);
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
            <View style={styles.buttonContainer}>
              <BackButton onPress={prevStep} />
              <Button title="Continue" onPress={nextStep} />
            </View>
          </>
        )}
        {currentStep === 3 && (
          <>
            <InputField placeholder="Username" value={formData.username} onChangeText={(text) => handleChange('username', text)} />
            <InputField placeholder="Set Password" value={formData.password} secureTextEntry onChangeText={(text) => handleChange('password', text)} />
            <InputField placeholder="Confirm Password" value={formData.confirmPassword} secureTextEntry onChangeText={(text) => handleChange('confirmPassword', text)} />
            <View style={styles.buttonContainer}>
              <BackButton onPress={prevStep} />
              <Button
                title={isSubmitting ? "Processing..." : "Sign Up"}
                onPress={handleSignup}
                disabled={isSubmitting}
              />
            </View>
          </>
        )}
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  }
});

export default SignupScreen;