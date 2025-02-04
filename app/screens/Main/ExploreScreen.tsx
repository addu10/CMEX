import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '@/components/Header';
import { globalStyles } from '../../../theme/styles'; // Adjust the path as necessary
import { Colors } from '../../../theme/colors';

interface Item {
  id: string;
  title: string;
}

const items: Item[] = [
  { id: '1', title: 'Item 1' },
  { id: '2', title: 'Item 2' },
  { id: '3', title: 'Item 3' },
  { id: '4', title: 'Item 4' },
  { id: '5', title: 'Item 5' },
  { id: '6', title: 'Item 6' },
  // Add more items as needed
];

const ExploreScreen = () => {
  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f6f6f6', padding: 16 }}>
      <Header />
      <Text style={globalStyles.title}>Explore Marketplace</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2} // Set the number of columns to 2
        columnWrapperStyle={styles.row} // Optional: style for the row
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1, // Allow the item to take up space in the row
    padding: 16,
    margin: 8, // Add margin to create space between items
    backgroundColor: Colors.inputBackground,
    borderRadius: 8,
    borderColor: Colors.border,
    borderWidth: 1,
  },
  itemTitle: {
    fontSize: 18,
    color: Colors.secondary,
  },
  row: {
    justifyContent: 'space-between', // Optional: space between items in the row
  },
});

export default ExploreScreen;