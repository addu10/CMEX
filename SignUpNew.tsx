{/*

// screens/Auth/SignupScreen.tsx
import React, { useState, useRef } from 'react';
import { ScrollView, Animated, Text } from 'react-native';
import { globalStyles } from '../../../theme/styles';
import Logo from '../../../components/Logo';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import PickerComponent from '../../../components/PickerComponent';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'; // Import the StackNavigationProp
import { RootStackParamList } from '../../../types/types'; // Import your types

type HeaderNavigationProp = StackNavigationProp<RootStackParamList, 'SignupScreen'>;

const SignupScreen = () => {
  const navigation = useNavigation<HeaderNavigationProp>();
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
  };

  const [currentStep, setCurrentStep] = useState(1);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const nextStep = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentStep(currentStep + 1);
      fadeIn();
    });
  };

  const prevStep = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentStep(currentStep - 1);
      fadeIn();
    });
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleSignup = () => {
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log(formData);

    if (!formData.username || !formData.password || !formData.department || !formData.catRegNo) {
      alert('Error, All fields are required!');
      return;
    }

    /* Navigate to CollegeVerificationScreen with the data
    navigation.navigate('CollegeVerification', {
      formData,
    });*/
  };
{/*
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
            <Button title="Sign Up" onPress={handleSignup} />
          </>
        )}
      </Animated.View>
    </ScrollView>
  );
};

export default SignupScreen;
*/}