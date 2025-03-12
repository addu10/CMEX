import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Sample data for featured deals
const featuredDeals = [
  {
    id: '1',
    title: 'Wireless Earbuds',
    price: '₹1,999',
    image: require('../assets/images/earbuds.png') // Replace with your actual image paths
  },
  {
    id: '2',
    title: 'Study Desk Lamp',
    price: '₹899',
    image: require('../assets/images/placeholder-lamp.png')
  },
  {
    id: '3',
    title: 'Engineering Calculator',
    price: '₹1,299',
    image: require('../assets/images/placeholder-calculator.png')
  },
  {
    id: '4',
    title: 'Bluetooth Speaker',
    price: '₹2,499',
    image: require('../assets/images/placeholder-speaker.png')
  },
  {
    id: '5',
    title: 'Laptop Cooling Pad',
    price: '₹1,199',
    image: require('../assets/images/placeholder-coolingpad.png')
  }
];

const FeaturedDealsSlider = () => {
  const renderDealItem = ({ item }) => (
    <TouchableOpacity style={styles.dealItem}>
      <View style={styles.dealContent}>
        <Text style={styles.dealTitle}>{item.title}</Text>
        <Text style={styles.dealPrice}>{item.price}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Ionicons name="star" size={14} color="#FFD700" />
          <Ionicons name="star" size={14} color="#FFD700" />
          <Ionicons name="star" size={14} color="#FFD700" />
          <Ionicons name="star-half" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>(4.5)</Text>
        </View>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer}>
        <Image 
          source={item.image} 
          style={styles.dealImage} 
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={featuredDeals}
      renderItem={renderDealItem}
      keyExtractor={item => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.sliderContainer}
      snapToAlignment="start"
      decelerationRate="fast"
      snapToInterval={280} // Adjust this to match the width of your items plus padding
    />
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  dealItem: {
    width: 260,
    height: 150,
    backgroundColor: '#b1f03d',
    borderRadius: 10,
    marginRight: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    padding: 10,
  },
  dealContent: {
    flex: 1,
    paddingRight: 8,
    justifyContent: 'space-between',
  },
  dealTitle: {
    fontSize: 16,
    fontFamily: 'LexendBold',
    color: '#333',
    marginBottom: 4,
  },
  dealPrice: {
    fontSize: 18,
    fontFamily: 'LexendBold',
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#555',
    marginLeft: 4,
    fontFamily: 'LexendRegular',
  },
  viewButton: {
    backgroundColor: '#333',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  viewButtonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'LexendBold',
  },
  imageContainer: {
    width: 120,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dealImage: {
    width: 100,
    height: 100,
  },
});

export default FeaturedDealsSlider;