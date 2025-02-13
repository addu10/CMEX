import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Image, Platform, TouchableOpacity } from 'react-native';
import Header from '@/components/Header';
import InputField from '@/components/InputField'; // Adjust the import path as necessary
import Button from '@/components/Button'; // Adjust the import path as necessary
import PickerComponent from '@/components/PickerComponent'; // Import your custom PickerComponent
import { globalStyles } from '../../../theme/styles';
import { getFirestore } from "firebase/firestore";
import { app } from "../../../FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';

interface Category {
  id: string;
  Name: string;
}

export function SellPageScreen() {
  const db = getFirestore(app);

  useEffect(() => {
    getCategoryList();
  }, []);


  const [categoryList, setCategoryList] = useState<{ label: string; value: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // State for selected category
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');

  /*const getCategoryList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db,'Category'));
      console.log("Entered getList");
      // const categories: { label: string; value: string }[] = [];
      querySnapshot.forEach((doc) => {
        console.log("Entered forEach")
        //const data = doc.data() as Category;
        //console.log(doc.id, " => ", data);
        //categories.push({ label: data.name, value: doc.id });
        console.log("Docs:",doc.data());
      });
      /*console.log("Fetched categories:", categories);
      setCategoryList(categories);
      if (categories.length > 0) {
        setSelectedCategory(categories[0].value);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } 
  };*/

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const getCategoryList = async () => {
    console.log("Fetching categories...");
    try {
      const querySnapshot = await getDocs(collection(db, "Category "));
      console.log("Query Snapshot:", querySnapshot); // Log the snapshot
      if (querySnapshot.empty) {
        console.log("No documents found in the Category collection.");
        return; // Exit if no documents are found
      }
      
      const categories: { label: string; value: string }[] = [];
      querySnapshot.forEach((doc) => { 
        const data = doc.data() as Category;
        console.log(doc.id, " => ", data);
        categories.push({ label: data.Name, value: doc.id }); // Ensure the field name matches
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



  const handleSubmit = () => {
    console.log({
      title,
      description,
      price,
      duration,
      category: selectedCategoryName, // Use selectedCategory state
      address,
      image,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f6f6f6', padding: 16 }}>
      <Header />
      <ScrollView contentContainerStyle={globalStyles.container}>
        <Text style={globalStyles.title}>Sell Your Item</Text>
        
        <TouchableOpacity onPress={pickImage}>
        {image?
        <Image source={{uri:image}} style={{width:300,height:300,borderRadius:10,borderColor:"black",borderWidth:1}}/>
        :<Image style={{width:300,height:300,borderRadius:10,borderColor:"black",borderWidth:1}} source={require('../../../assets/images/hue_shifted_transparent.png')}/>
        }</TouchableOpacity>
        <InputField
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <InputField
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={{ height: 130}}
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
          selectedValue={selectedCategory}
          onValueChange={(value) => {
            setSelectedCategory(value);
            const selectedCategoryData = categoryList.find(category => category.value === value);
            setSelectedCategoryName(selectedCategoryData ? selectedCategoryData.label : '');
          }}
          items={categoryList}
        />
        <InputField
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
        <Button title="Submit" onPress={handleSubmit}/>

      </ScrollView>
    </View>
  );
}

export default SellPageScreen;