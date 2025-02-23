import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Header from '@/components/Header';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import PickerComponent from '@/components/PickerComponent';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../../FirebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { createClient } from '@supabase/supabase-js';

interface Category {
  id: string;
  Name: string;
}

export function SellPageScreen() {
  const db = getFirestore(app);
  const supabase = createClient(
    'https://lsojaxaqxxxvesztcccn.supabase.co',
    'SUPABASE_ANON_KEY'
  );

  const [categoryList, setCategoryList] = useState<{ label: string; value: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Category'));
        const categories: { label: string; value: string }[] = querySnapshot.docs.map(doc => ({
          label: doc.data().Name,
          value: doc.id,
        }));
        setCategoryList(categories);
        if (categories.length > 0) setSelectedCategory(categories[0].value);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
      return true;
    };
    fetchCategories();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const validateInputs = () => {
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
      const { data, error } = await supabase.storage.from('images').upload(fileName, blob, {
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
  const onSubmitMethod = async (): Promise<boolean> => {
    if (!validateInputs()) return false;
    setLoading(true);
    const uploadedImageUrl = await uploadImage();
    console.log({ title, description, price, duration, selectedCategory, address, uploadedImageUrl });
    Alert.alert('Success', 'Your item has been listed successfully!');
    setLoading(false);
    return true;
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Sell Your Item</Text>
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>Tap to select an image</Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <InputField placeholder='Title' value={title} onChangeText={setTitle} style={styles.inputSpacing} />
          <InputField placeholder='Description' value={description} onChangeText={setDescription} style={[styles.textArea, styles.inputSpacing]} />
          <InputField placeholder='Price' value={price} onChangeText={setPrice} keyboardType='numeric' style={styles.inputSpacing} />
          <InputField placeholder='Duration (Days)' value={duration} onChangeText={setDuration} keyboardType='numeric' style={styles.inputSpacing} />
          <PickerComponent selectedValue={selectedCategory} onValueChange={setSelectedCategory} items={categoryList} />
          <InputField placeholder='Address' value={address} onChangeText={setAddress} style={styles.inputSpacing} />
        </View>
        {loading ? <ActivityIndicator size='large' color='#0000ff' /> : <Button title='Submit' onPress={onSubmitMethod} />}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    alignSelf: 'center',
  },
  imageContainer: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    overflow: 'hidden',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 320,
    width: 320,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  inputSpacing: {
    marginBottom: 15,
  },
  textArea: {
    height: 140,
    textAlignVertical: 'top',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 10,
  },
  bottomSpacing: {
    height: 50,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    color: '#aaa',
    fontSize: 18,
  },
});

export default SellPageScreen;
