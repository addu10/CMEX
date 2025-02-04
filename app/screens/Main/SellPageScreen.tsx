import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import Header from '@/components/Header';
import InputField from '@/components/InputField'; // Adjust the import path as necessary
import Button from '@/components/Button'; // Adjust the import path as necessary
import PickerComponent from '@/components/PickerComponent'; // Import your custom PickerComponent
import { globalStyles } from '../../../theme/styles';

const categories = [
  { label: 'Second Hand Bikes', value: 'second_hand_bikes' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Stationary Items', value: 'stationary_items' },
  { label: 'Kitchen Appliances', value: 'kitchen_appliances' },
  { label: 'Electronics', value: 'electronics' },
];

export function SellPageScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState(categories[0].value); // Set initial value based on the new format
  const [address, setAddress] = useState('');

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log({
      title,
      description,
      price,
      duration,
      category,
      address,
    });
  };

  return (
    <View  style={{ flex: 1, backgroundColor: '#f6f6f6', padding: 16 }}>
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
            selectedValue={category}
            onValueChange={setCategory}
            items={categories} // Pass the categories to the PickerComponent
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