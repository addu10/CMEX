import React from 'react';
import { ScrollView, View, Text, StyleSheet, FlatList, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { useFonts, Lexend_400Regular, Lexend_600SemiBold } from '@expo-google-fonts/lexend';
import * as SplashScreen from 'expo-splash-screen';
import Header from '../../../components/Header';
import SaleBanner from '../../../components/SaleBanner';
import ItemCarousel from '../../../components/ItemCarousel';
import { Ionicons } from '@expo/vector-icons';

SplashScreen.preventAutoHideAsync();

export default function HomeScreen() {
  let [fontsLoaded] = useFonts({
    LexendRegular: Lexend_400Regular,
    LexendBold: Lexend_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  } else {
    SplashScreen.hideAsync();
  }

  const categories = [
    { id: '1', name: 'Fashion', icon: 'shirt-outline' },
    { id: '2', name: 'Stationery', icon: 'create-outline' },
    { id: '3', name: 'Vehicles', icon: 'car-outline' },
    { id: '4', name: 'Kitchen', icon: 'fast-food-outline' },
    { id: '5', name: 'Electronics', icon: 'tv-outline' },
    { id: '6', name: 'Sports', icon: 'football-outline' },
  ];

  const actions = [
    { id: '1', name: 'Sell', icon: 'pricetag-outline' },
    { id: '2', name: 'Buy', icon: 'cart-outline' },
    { id: '3', name: 'Rent', icon: 'home-outline' },
  ];

  const renderCategoryItem = ({ item }: { item: { id: string; name: string; icon: string } }) => (
    <View style={styles.categoryItem}>
      <Ionicons name={item.icon as any} size={32} color="#333" />
      <Text style={styles.categoryText}>{item.name}</Text>
    </View>
  );

  const renderActionButton = ({ item }: { item: { id: string; name: string; icon: string } }) => (
    <TouchableOpacity style={styles.actionButton}>
      <Ionicons name={item.icon as any} size={28} color="#000" />
      <Text style={styles.actionText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Header */}
        <Header />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Search for products..." placeholderTextColor="#999" />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {actions.map((item) => renderActionButton({ item }))}
        </View>


        {/* Placeholder for Sale Products (Scrolling Horizontally) */}
        <View style={styles.salePlaceholder}>
          <Text style={styles.saleText}>Featured Deals</Text>
          <View style={styles.saleBox}>
            <Text style={styles.salePlaceholderText}>Products will appear here</Text>
          </View>
        </View>

        {/* Shop by Category */}
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />

        {/* Continue Selling (Now with iOS Arrow Icon) */}
        <TouchableOpacity style={styles.continueSellingCard}>
          <Text style={styles.continueSellingTitle}>Continue Selling</Text>
          <View style={styles.continueSellingRow}>
            <Text style={styles.continueSellingText}>Your recently added products will appear here.</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#777" />
          </View>
        </TouchableOpacity>

        {/* Featured Items */}
        <Text style={styles.sectionTitle}>Featured Items</Text>
        <ItemCarousel />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'LexendRegular',
    color: '#333',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'LexendBold',
    color: '#333',
    marginTop: 6,
  },
  salePlaceholder: {
    marginTop: 20,
    paddingHorizontal: 4,
  },
  saleText: {
    fontSize: 18,
    fontFamily: 'LexendBold',
    color: '#333',
    marginBottom: 8,
  },
  saleBox: {
    height: 150,
    backgroundColor: '#d7f2a5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  salePlaceholderText: {
    fontSize: 16,
    color: '#777',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'LexendBold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  categoryList: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'LexendRegular',
    color: '#333',
    marginTop: 6,
    textAlign: 'center',
  },
  continueSellingCard: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  continueSellingTitle: {
    fontSize: 18,
    fontFamily: 'LexendBold',
    color: '#333',
    marginBottom: 5,
  },
  continueSellingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  continueSellingText: {
    fontSize: 14,
    fontFamily: 'LexendRegular',
    color: '#666',
  },
});