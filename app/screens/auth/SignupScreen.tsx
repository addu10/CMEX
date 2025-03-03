import React, { useState, useRef } from 'react';
import { ScrollView, Animated, Text, StyleSheet, TouchableOpacity, Image, View, Platform } from 'react-native';
import { globalStyles } from '../../../theme/styles';
import Logo from '../../../components/Logo';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import BackButton from '../../../components/BackButton';
import PickerComponent from '../../../components/PickerComponent';
import UploadButton from '../../../components/UploadButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/types';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { supabase } from '../../../lib/supabase';

type HeaderNavigationProp = StackNavigationProp<RootStackParamList, 'SignupScreen'>;

const SignupScreen = () => {
  const navigation = useNavigation<HeaderNavigationProp>();
  
  const [studentIdUploaded, setStudentIdUploaded] = useState(false);
  const [studentIdImage, setStudentIdImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    catRegNo: '',
    phoneNo: '',
    department: '',
    username: '',
    password: '',
    confirmPassword: '',
    studentIdImage: '',
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.8,
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

  // Helper function to convert file URI to blob
  const uriToBlob = async (uri: string): Promise<Blob> => {
    // On Android, the file:// path can be sent directly to the fetch API
    // On iOS, we need to read the file and create a blob
    if (Platform.OS === 'ios') {
      const response = await fetch(uri);
      return await response.blob();
    } else {
      // For Android
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          resolve(xhr.response);
        };
        xhr.onerror = function() {
          reject(new Error('uriToBlob failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });
    }
  };

  const uploadImageToSupabase = async (uri: string) => {
    setIsUploading(true);
    try {
      if (!uri) return null;
      
      // Get file extension
      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${formData.username.replace(/\s+/g, '-')}-${Date.now()}.${fileExt}`;
      
      console.log(`Starting upload for file: ${fileName}`);
      console.log(`URI: ${uri}`);
      
      // For React Native, we need a different approach depending on platform
      try {
        // Convert URI to blob
        const fileBlob = await uriToBlob(uri);
        console.log(`Created blob of size: ${fileBlob.size} bytes`);
        
        // Upload to Supabase using their storage API
        const { data, error } = await supabase.storage
          .from('student_id_images')
          .upload(fileName, fileBlob, {
            contentType: `image/${fileExt}`,
            upsert: true
          });
        
        if (error) {
          console.error('Supabase storage error:', error);
          throw error;
        }
        
        console.log('Upload successful:', data);
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('student_id_images')
          .getPublicUrl(fileName);
          
        console.log('Public URL:', urlData.publicUrl);
        return urlData.publicUrl;
      } catch (uploadError) {
        console.error('Upload attempt failed:', uploadError);
        
        // Try alternative method for Android
        if (Platform.OS === 'android') {
          console.log('Trying alternative upload method for Android...');
          
          // Read the file
          const fileContent = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          
          // Convert base64 to blob
          const base64Data = `data:image/${fileExt};base64,${fileContent}`;
          const response = await fetch(base64Data);
          const blob = await response.blob();
          
          // Upload to Supabase
          const { data, error } = await supabase.storage
            .from('student_id_images')
            .upload(fileName, blob, {
              contentType: `image/${fileExt}`,
              upsert: true
            });
            
          if (error) {
            console.error('Alternative upload method error:', error);
            throw error;
          }
          
          // Get the public URL
          const { data: urlData } = supabase.storage
            .from('student_id_images')
            .getPublicUrl(fileName);
            
          console.log('Alternative upload successful, URL:', urlData.publicUrl);
          return urlData.publicUrl;
        }
        
        // If we've reached here, all attempts have failed
        throw uploadError;
      }
    } catch (error) {
      console.error('Image Upload Error:', error);
      alert(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    } finally {
      setIsUploading(false);
    }
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
    
    try {
      let studentIdImageUrl = null;
      
      if (studentIdImage) {
        studentIdImageUrl = await uploadImageToSupabase(studentIdImage);
        if (!studentIdImageUrl) {
          alert('Failed to upload student ID image. Please try again.');
          return;
        }
      }
  
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            cat_reg_no: formData.catRegNo,
            phone_no: formData.phoneNo,
            department: formData.department,
            username: formData.username,
            password: formData.password, // Note: In production, you should hash passwords
            student_id_image: studentIdImageUrl,
          },
        ]);
  
      if (error) {
        throw error;
      }
  
      alert('Signup successful!');
      navigation.navigate('LoginScreen');
    } catch (error) {
      if (error instanceof Error) {
        alert(`Signup failed: ${error.message}`);
      } else {
        alert('An unknown error occurred during signup.');
      }
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
                  <Text style={styles.successText}>Image selected ✓</Text>
                </View>
              )}
              {isUploading && <Text style={styles.uploadingText}>Uploading image...</Text>}
            </View>
            <View style={styles.buttonContainer}>
              <BackButton onPress={prevStep} />
              <Button 
                title={isUploading ? "Processing..." : "Sign Up"} 
                onPress={handleSignup}
                disabled={isUploading}
              />
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
  uploadingText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
    textAlign: 'center',
  }
});

export default SignupScreen;