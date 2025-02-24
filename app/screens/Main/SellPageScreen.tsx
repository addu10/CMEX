import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
  StyleSheet
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../../FirebaseConfig';
import PickerComponent from '@/components/PickerComponent';
import { Colors } from '../../../assets/styles/colors'; // Keeping your original colors
import Header from '@/components/Header';

interface Category {
  id: string;
  Name: string;
}

const SellPageScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(''); // New state for price
  const [durationValue, setDurationValue] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('hour');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [categoryList, setCategoryList] = useState<{ label: string; value: string }[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listingType, setListingType] = useState('sell');

  const db = getFirestore(app);

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Category "));
      const categories: { label: string; value: string }[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Category;
        categories.push({ label: data.Name, value: doc.id });
      });
      setCategoryList(categories);
      if (categories.length > 0) {
        setSelectedCategory(categories[0].value);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const onSubmit = () => {
    console.log('Form submitted');
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.imagePreview}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Text style={styles.imagePlaceholder}>Tap to add image</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <PickerComponent
            selectedValue={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
              const selectedCategoryData = categoryList.find(category => category.value === value);
              setSelectedCategoryName(selectedCategoryData ? selectedCategoryData.label : '');
            }}
            items={categoryList}
          />

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
  );
};

const styles = StyleSheet.create({
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
    width: 120,
    height: 120,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imagePlaceholder: {
    color: '#666',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFF',
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
});

export default SellPageScreen;
