// components/CategoryCard.tsx
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface CategoryCardProps {
  icon: string;
  name: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ icon, name }) => (
  <TouchableOpacity style={styles.card}>
    <FontAwesome5 name={icon} size={24} color="#000" style={styles.icon} />
    <View style={styles.textContainer}>
      <Text style={styles.text}>{name}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: '48%', // Set width to almost half of the container
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebebeb',
    borderRadius: 25, // Make the card round
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 15, // Space between rows
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1, // Allow the text container to take up remaining space
    justifyContent: 'center', // Center the text vertically
  },
  text: {
    color: '#000',
    fontSize: 16, // Set a base font size
    textAlign: 'left', // Align text to the left
    flexWrap: 'wrap', // Allow text to wrap
  },
});

export default CategoryCard;