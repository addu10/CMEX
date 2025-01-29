// components/CategoryCard.tsx
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface CategoryCardProps {
  icon: string;
  name: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ icon, name }) => (
  <TouchableOpacity
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#ebebeb',
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginBottom: 15,
    }}
  >
    <FontAwesome5 name={icon} size={24} color="#000" style={{ marginRight: 15 }} />
    <Text style={{ color: '#000', fontSize: 18, textAlign: 'center' }}>{name}</Text>
  </TouchableOpacity>
);

export default CategoryCard;
