import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Text
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { app } from '../../../FirebaseConfig';
import { supabase } from '../../../lib/supabase';
import { styles } from '../../../assets/styles/styles';
import { Colors } from '../../../assets/styles/colors';

interface ImagePickerResult {
  canceled: boolean;
  assets: Array<{
    uri: string;
  }>;
}

export default function SellPageScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [address, setAddress] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async (): Promise<void> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const validateInputs = (): boolean => {
    if (!title || !description || !price || !duration || !address) {
      Alert.alert('Missing Fields', 'Please fill all the required fields.');
      return false;
    }
    if (isNaN(Number(price)) || isNaN(Number(duration))) {
      Alert.alert('Invalid Input', 'Price and Duration should be valid numbers.');
      return false;
    }
    return true;
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!image) return null;
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const fileName = `images/${Date.now()}.jpg`;
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
        });
      
      if (error) throw error;
      return data.path;
    } catch (error) {
      console.error('Image Upload Error:', error);
      Alert.alert('Upload Failed', 'There was an error uploading the image.');
      return null;
    }
  };

  const onSubmit = async (): Promise<boolean> => {
    if (!validateInputs()) return false;
    setLoading(true);
    
    try {
      const uploadedImageUrl = await uploadImage();
      console.log({
        title,
        description,
        price,
        duration,
        selectedCategory,
        address,
        uploadedImageUrl
      });
      Alert.alert('Success', 'Your item has been listed successfully!');
      return true;
    } catch (error) {
      Alert.alert('Error', 'Failed to submit listing');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.sell.container}>
      <ScrollView contentContainerStyle={styles.sell.scrollContainer}>
        <View style={styles.sell.imageContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.sell.imagePreview}>
            {image ? (
              <Image source={{ uri: image }} style={styles.sell.imagePreview} />
            ) : (
              <Text>Tap to add image</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.sell.formContainer}>
          <TextInput
            style={styles.sell.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={Colors.gray}
          />

          <TextInput
            style={[styles.sell.input, styles.sell.descriptionInput]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            placeholderTextColor={Colors.gray}
          />

          <TextInput
            style={styles.sell.input}
            placeholder="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholderTextColor={Colors.gray}
          />

          <TextInput
            style={styles.sell.input}
            placeholder="Duration (in days)"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
            placeholderTextColor={Colors.gray}
          />

          <View style={styles.sell.pickerContainer}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(value: string) => setSelectedCategory(value)}
            >
              <Picker.Item label="Select Category" value="" />
              <Picker.Item label="Electronics" value="electronics" />
              <Picker.Item label="Books" value="books" />
              <Picker.Item label="Furniture" value="furniture" />
              <Picker.Item label="Others" value="others" />
            </Picker>
          </View>

          <TextInput
            style={styles.sell.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            multiline
            placeholderTextColor={Colors.gray}
          />

          <TouchableOpacity
            style={styles.sell.submitButton}
            onPress={onSubmit}
          >
            <Text style={styles.sell.submitButtonText}>Submit Listing</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.sell.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.white} />
        </View>
      )}
    </View>
  );
}
