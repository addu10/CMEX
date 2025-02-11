// components/CategoryList.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CategoryCard from './CategoryCard';

const categories = [
  { name: 'Clothing', icon: 'tshirt' },
  { name: 'Stationary Items', icon: 'pen' },
  { name: 'Second Hand Bikes', icon: 'bicycle' },
  { name: 'Kitchen Appliances', icon: 'blender' },
  { name: 'Electronics', icon: 'tv' },
  { name: 'Sport Accessories', icon: 'volleyball-ball' },
];



const CategoryList = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Browse by Category</Text>
    <View style={styles.cardContainer}>
      {categories.map((category, index) => (
        <CategoryCard key={index} icon={category.icon} name={category.name} />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow wrapping to the next line
    justifyContent: 'space-between', // Space between cards
  },
});

export default CategoryList;