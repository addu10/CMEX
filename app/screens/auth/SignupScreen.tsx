import React, { useState, useRef } from 'react';
import { ScrollView, Animated, Text, StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import { globalStyles } from '../../../theme/styles';
import Logo from '../../../components/Logo';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import BackButton from '../../../components/BackButton';
import PickerComponent from '../../../components/PickerComponent';
import UploadButton from '../../../components/UploadButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'; // Import the StackNavigationProp
import { RootStackParamList } from '../../../types/types'; // Import your types
import * as ImagePicker from "expo-image-picker";

type HeaderNavigationProp = StackNavigationProp<RootStackParamList, 'SignupScreen'>;



const SignupScreen = () => {
  const navigation = useNavigation<HeaderNavigationProp>();
  
  const [studentIdUploaded, setStudentIdUploaded] = useState(false);
  const [studentIdImage, setStudentIdImage] = useState<string | null>(null);
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (!result.canceled) {
      setStudentIdImage(result.assets[0].uri);
      handleChange('studentIdImage', result.assets[0].uri);
    }
  };

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
  const handleSignup = (): Promise<boolean> => {
    if (formData.password !== formData.confirmPassword) {
      return Promise.resolve(false);
    }
    console.log(formData);

    if (!formData.username || !formData.password || !formData.department || !formData.catRegNo) {
      alert('Error, All fields are required!');
      return Promise.resolve(false);
    }

    /* Navigate to CollegeVerificationScreen with the data
    navigation.navigate('CollegeVerification', {
      formData,
    });*/
    return Promise.resolve(true);
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
              <Button title="Continue" onPress={nextStep} />
            </View>
          </>
        )}
       
        {currentStep === 4 && (
          <>
            <View style={styles.uploadSection}>
              <UploadButton onPress={pickImage} />
              {studentIdImage && (
                <View style={styles.imagePreviewContainer}>
                  <Image 
                    source={{ uri: studentIdImage }} 
                    style={styles.imagePreview} 
                  />
                  <Text style={styles.successText}>Uploaded successfully ✓</Text>
                </View>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <BackButton onPress={prevStep} />
              <Button title="Sign Up" onPress={handleSignup} />
            </View>
          </>
        )}
      </Animated.View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  uploadBox: {
    width: 200,
    height: 100,
    borderWidth: 2,
    borderColor: "#00F5E0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginTop: 10,
  },
  uploadText: {
    color: "#777",
    fontSize: 14,
  },
  uploadedText: {
    color: "green",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  uploadSection: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  imagePreview: {
    width: 140,
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
  successText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 5,
  },
});
export default SignupScreen;