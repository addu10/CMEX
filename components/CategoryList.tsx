// components/CategoryList.tsx
import React from 'react';
import { View, Text } from 'react-native';
import CategoryCard from './CategoryCard';

const categories = [
  { name: 'Clothing', icon: 'tshirt' },
  { name: 'Stationary Items', icon: 'pen' },
  { name: 'Second Hand Bikes', icon: 'bicycle' },
  { name: 'Kitchen Appliances', icon: 'blender' },
  { name: 'Electronics', icon: 'tv' },
];

const CategoryList = () => (
  <View style={{ padding: 20 }}>
    <Text style={{ fontSize: 24, color: '#000', fontWeight: 'bold' }}>Browse by Category</Text>
    <View style={{ marginTop: 10 }}>
      {categories.map((category, index) => (
        <CategoryCard key={index} icon={category.icon} name={category.name} />
      ))}
    </View>
  </View>
);

export default CategoryList;
