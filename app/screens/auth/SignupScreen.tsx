import React, { useState, useRef, useContext } from 'react';
import { 
  ScrollView, 
  Animated, 
  Text, 
  StyleSheet, 
  View, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView
} from 'react-native';
import { globalStyles } from '../../../theme/styles';
import Logo from '../../../components/Logo';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import BackButton from '../../../components/BackButton';
import PickerComponent from '../../../components/PickerComponent';
import { supabase } from '../../../lib/supabase';
import { AuthContext } from '../../_layout';

const SignupScreen = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    catRegNo: '',
    phoneNo: '',
    department: '',
    email: '',
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
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!formData.email || !formData.password || !formData.department || !formData.catRegNo) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('[Signup Debug] Submitting user data to Supabase Auth...');

      // Use Supabase Auth signUp instead of direct table insert
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            cat_reg_no: formData.catRegNo,
            phone_no: formData.phoneNo,
            department: formData.department
          }
        }
      });

      if (error) {
        console.error('[Signup Debug] Supabase error:', error);
        throw error;
      }

      if (!data.user) {
        throw new Error('No user data returned');
      }

      console.log('[Signup Debug] User created successfully:', data.user);

      // Check if email confirmation is required
      const requiresEmailConfirmation = !data.session;
      
      if (requiresEmailConfirmation) {
        Alert.alert(
          'Verification Required',
          'Please check your email to verify your account before logging in.'
        );
        // Navigate back to login screen or stay on current screen
      } else {
        // Auto-login if email confirmation is disabled
        setIsAuthenticated(true);
        console.log('[Signup Debug] Authentication state updated, redirecting...');
      }
      
    } catch (error) {
      console.error('[Signup Debug] Signup error details:', error);
      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          Alert.alert('Network Error', 'Please check your internet connection and try again.');
        } else {
          Alert.alert('Signup Failed', error.message);
        }
      } else {
        Alert.alert('Error', 'An unknown error occurred during signup.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logoWrapper}>
              <Logo />
            </View>
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
                  <InputField 
                    placeholder="Email" 
                    value={formData.email} 
                    onChangeText={(text) => handleChange('email', text)} 
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
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
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 50,
    alignItems: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 5,
  },
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