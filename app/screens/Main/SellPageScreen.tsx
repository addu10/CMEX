import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import Header from '@/components/Header';
import InputField from '@/components/InputField'; // Adjust the import path as necessary
import Button from '@/components/Button'; // Adjust the import path as necessary
import PickerComponent from '@/components/PickerComponent'; // Import your custom PickerComponent
import { globalStyles } from '../../../theme/styles';
import { getFirestore } from "firebase/firestore";
import { app } from "../../../FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";

interface Category {
  id: string;
  name: string;
}

export function SellPageScreen() {
  const db = getFirestore(app);
  const [categoryList, setCategoryList] = useState<{ label: string; value: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // State for selected category
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [address, setAddress] = useState('');

  const getCategoryList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Category"));
      const categories: { label: string; value: string }[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Category;
        console.log(doc.id, " => ", data);
        categories.push({ label: data.name, value: doc.id });
      });
      console.log("Fetched categories:", categories);
      setCategoryList(categories);
      if (categories.length > 0) {
        setSelectedCategory(categories[0].value);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const testFirestore = async () => {
    const querySnapshot = await getDocs(collection(db, "Category"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  };


  useEffect(() => {
    getCategoryList();
  }, []);


  const handleSubmit = () => {
    console.log({
      title,
      description,
      price,
      duration,
      category: selectedCategory, // Use selectedCategory state
      address,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f6f6f6', padding: 16 }}>
      <Header />
      <ScrollView contentContainerStyle={globalStyles.container}>
        <Text style={globalStyles.title}>Sell Your Item</Text>
        <InputField
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <InputField
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <InputField
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <InputField
          placeholder="Duration (Days)"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />
        <PickerComponent
          selectedValue={selectedCategory} // Use selectedCategory state
          onValueChange={setSelectedCategory} // Update selected category
          items={categoryList} // Pass the categories to the PickerComponent
        />
        <InputField
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
        <Button title="Submit" onPress={handleSubmit} />
      </ScrollView>
    </View>
  );
}

export default SellPageScreen;