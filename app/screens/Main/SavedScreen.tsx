import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Header from '@/components/Header';
import { globalStyles } from '../../../theme/styles'; // Adjust the path as necessary
import { Colors } from '../../../theme/colors';
import { ScrollView } from 'react-native-gesture-handler';




const SavedScreen: React.FC = () => {
    const SavedItems: any[] = []; // Replace with your wishlist items logic
  
    return (
    <View  style={{ flex: 1, backgroundColor: '#f6f6f6', padding: 16 }}>
      <Header />
      <ScrollView>
      {SavedItems.length === 0 ? (
        <Text style={styles.message}>There are no items marked in your wishlist.</Text>
      ) : (
        // Render wishlist items here
        <Text>Your Wishlist Items</Text>
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    fontSize: 18,
    textAlign: 'center',
    padding: 16,
    color: Colors.secondary,
  },
});

export default SavedScreen;