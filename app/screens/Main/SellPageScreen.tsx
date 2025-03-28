import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import PickerComponent from '@/components/PickerComponent';
import { Colors } from '../../../assets/styles/colors'; // Keeping your original colors
import Header from '@/components/Header';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Category {
  id: string;
  name: string;
  icon: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const SellPageScreen = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [durationValue, setDurationValue] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('hour');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [categoryList, setCategoryList] = useState<{ label: string; value: string }[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listingType, setListingType] = useState('sell');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    getCategoryList(0);
  }, []);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getCategoryList = async (retryCount: number = 0) => {
    setIsLoadingCategories(true);
    try {
      // Check if Supabase client is initialized
      if (!supabase) {
        throw new Error('Supabase client is not initialized');
      }

      const { data: categories, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (error) throw error;

      if (!categories || categories.length === 0) {
        throw new Error('No categories found');
      }

      const formattedCategories = categories.map(category => ({
        label: category.name,
        value: category.id
      }));

      setCategoryList(formattedCategories);
      if (formattedCategories.length > 0) {
        setSelectedCategory(formattedCategories[0].value);
        setSelectedCategoryName(formattedCategories[0].label);
      }
      setUploadError(null);
    } catch (error: any) {
      console.error("Error fetching categories:", error);

      // Retry logic
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying category fetch... Attempt ${retryCount + 1}`);
        await delay(RETRY_DELAY);
        return getCategoryList(retryCount + 1);
      }

      // If all retries failed, set a user-friendly error
      setUploadError(
        "Unable to load categories. Please check your internet connection and try again."
      );

      // Set default categories if available
      const defaultCategories = [
        { label: 'Fashion', value: '51f0986a-29b3-49d3-942d-afe2345c2d30' },
        { label: 'Electronics', value: '8a61e341-2c18-4c40-961c-0d1f44fd4a4c' },
        { label: 'Sports', value: '8f421dfc-8ad8-4b11-8615-cdd05b4f4943' }
      ];
      setCategoryList(defaultCategories);
      setSelectedCategory(defaultCategories[0].value);
      setSelectedCategoryName(defaultCategories[0].label);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setUploadError('Failed to pick image. Please try again.');
    }
  };

  const uploadImageToSupabase = async (uri: string): Promise<string | null> => {
    try {
      // Convert URI to Base64
      const response = await fetch(uri);
      const blob = await response.blob();

      // Convert Blob to Base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64Data = reader.result as string;
            const base64Content = base64Data.split(',')[1];

            // Generate unique filename
            const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
            const fileName = `${Date.now()}.${fileExt}`;

            // Upload to Supabase
            const { data, error: uploadError } = await supabase.storage
              .from('listings')
              .upload(fileName, decode(base64Content), {
                contentType: `image/${fileExt}`,
                cacheControl: '3600',
                upsert: false
              });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from('listings')
              .getPublicUrl(fileName);

            resolve(publicUrl);
          } catch (error) {
            console.error('Error in base64 upload:', error);
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      if (error instanceof Error) {
        setUploadError(`Failed to upload image: ${error.message}`);
      } else {
        setUploadError('Failed to upload image. Please try again.');
      }
      return null;
    }
  };

  // Add decode function for base64
  function decode(base64: string) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let bufferLength = base64.length * 0.75,
      len = base64.length,
      i,
      p = 0,
      encoded1,
      encoded2,
      encoded3,
      encoded4;

    if (base64[base64.length - 1] === '=') {
      bufferLength--;
      if (base64[base64.length - 2] === '=') {
        bufferLength--;
      }
    }

    const arraybuffer = new ArrayBuffer(bufferLength),
      bytes = new Uint8Array(arraybuffer);

    for (i = 0; i < len; i += 4) {
      encoded1 = chars.indexOf(base64[i]);
      encoded2 = chars.indexOf(base64[i + 1]);
      encoded3 = chars.indexOf(base64[i + 2]);
      encoded4 = chars.indexOf(base64[i + 3]);

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return arraybuffer;
  }

  const onSubmit = async () => {
    if (!image || !title || !description || !selectedCategory) {
      setUploadError('Please fill in all required fields and add an image');
      return;
    }

    if (listingType === 'sell' && !price) {
      setUploadError('Please enter a price for your item');
      return;
    }

    if (listingType === 'rent' && !durationValue) {
      setUploadError('Please enter a rental price');
      return;
    }

    setLoading(true);
    setUploadError(null);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Upload image to Supabase storage
      const imageUrl = await uploadImageToSupabase(image);
      if (!imageUrl) {
        throw new Error('Failed to upload image');
      }

      // Save listing details to Supabase database
      const { data, error } = await supabase
        .from('listings')
        .insert([
          {
            title,
            description,
            price: parseFloat(price || durationValue),
            category_id: selectedCategory,
            category_name: selectedCategoryName,
            duration_value: listingType === 'rent' ? parseFloat(durationValue) : null,
            duration_unit: listingType === 'rent' ? selectedDuration : null,
            image_url: imageUrl,
            listing_type: listingType,
            user_id: user.id,
            status: 'active'
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      // Reset form
      setTitle('');
      setDescription('');
      setPrice('');
      setDurationValue('');
      setImage(null);
      setUploadError(null);

      // Navigate to home screen after successful submission
      router.push('/');

    } catch (error: any) {
      console.error('Error creating listing:', error);
      setUploadError(error.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Header />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.imagePreview}>
              <View style={styles.imagePreviewInner}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.image} />
                ) : (
                  <View style={styles.imagePlaceholderContainer}>
                    <Ionicons name="image-outline" size={60} color="#666" />
                    <Text style={styles.imagePlaceholder}>Tap to add image</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            {uploadError && (
              <TouchableOpacity
                onPress={() => getCategoryList(0)}
                style={styles.errorContainer}
              >
                <Text style={styles.errorText}>{uploadError}</Text>
                <Text style={styles.retryText}>Tap to retry</Text>
              </TouchableOpacity>
            )}

            {isLoadingCategories ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <PickerComponent
                selectedValue={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  const selectedCategoryData = categoryList.find(category => category.value === value);
                  setSelectedCategoryName(selectedCategoryData ? selectedCategoryData.label : '');
                }}
                items={categoryList}
              />
            )}

            <PickerComponent
              selectedValue={listingType}
              onValueChange={(value) => {
                setListingType(value);
                if (value === 'sell') {
                  setSelectedDuration('hour');
                  setDurationValue('');
                }
              }}
              items={[
                { label: 'Sell', value: 'sell' },
                { label: 'Rent', value: 'rent' }
              ]}
            />

            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#8A8A8A"
            />

            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              multiline
              placeholderTextColor="#8A8A8A"
            />

            {/* Price input field (only when "Sell" is selected) */}
            {listingType === 'sell' && (
              <TextInput
                style={styles.input}
                placeholder="Price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                placeholderTextColor="#8A8A8A"
              />
            )}

            {listingType === 'rent' && (
              <>
                <PickerComponent
                  selectedValue={selectedDuration}
                  onValueChange={setSelectedDuration}
                  items={[
                    { label: 'Hour', value: 'hour' },
                    { label: 'Day', value: 'day' },
                    { label: 'Week', value: 'week' },
                    { label: 'Month', value: 'month' },
                  ]}
                />

                <TextInput
                  style={styles.input}
                  placeholder={`Standard Price per ${selectedDuration}`}
                  value={durationValue}
                  onChangeText={setDurationValue}
                  keyboardType="numeric"
                  placeholderTextColor="#8A8A8A"
                />
              </>
            )}

            <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
              <Text style={styles.submitButtonText}>Submit Listing</Text>
            </TouchableOpacity>

            <View style={styles.bottomSpacing} />
          </View>
        </ScrollView>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.white} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePreview: {
    width: 220,
    height: 200,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    padding: 2,
  },
  imagePreviewInner: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FB',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  imagePlaceholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    color: '#666',
    marginTop: 8,
    fontSize: 14,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },

  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#d7f2a5',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacing: {
    height: 50,
  },
  topSpacing: {
    height: 10,
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
    textAlign: 'center',
  },
  retryText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default SellPageScreen;
