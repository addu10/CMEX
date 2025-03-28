import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, FlatList, SafeAreaView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFonts, Lexend_400Regular, Lexend_600SemiBold } from '@expo-google-fonts/lexend';
import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router';
import Header from '../../../components/Header';
import FeaturedDealsSlider from '../../../components/FeaturedDealsSlider'
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../lib/supabase';

export default function HomeScreen() {
  const [categories, setCategories] = useState<Array<{ id: string; name: string; icon: string }>>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  let [fontsLoaded] = useFonts({
    LexendRegular: Lexend_400Regular,
    LexendBold: Lexend_600SemiBold,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  // Navigation handlers
  const handleSellPress = () => {
    router.push('/sell');
  };

  const handleBuyPress = () => {
    // Navigate to Explore screen with 'sell' filter
    router.push({
      pathname: '/explore',
      params: { listingType: 'sell' }
    });
  };

  const handleRentPress = () => {
    // Navigate to Explore screen with 'rent' filter
    router.push({
      pathname: '/explore',
      params: { listingType: 'rent' }
    });
  };

  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    // Navigate to Explore screen with category filter
    router.push({
      pathname: '/explore',
      params: { categoryId, categoryName }
    });
  };

  const handleContinueSellingPress = () => {
    // Navigate to My Listings page
    router.push('/user/my-listings');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to Explore screen with search query
      router.push({
        pathname: '/explore',
        params: { searchQuery: searchQuery.trim() }
      });
    }
  };

  const actions = [
    { id: '1', name: 'Sell', icon: 'pricetag-outline', onPress: handleSellPress },
    { id: '2', name: 'Buy', icon: 'cart-outline', onPress: handleBuyPress },
    { id: '3', name: 'Rent', icon: 'home-outline', onPress: handleRentPress },
  ];

  const renderCategoryItem = ({ item }: { item: { id: string; name: string; icon: string } }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(item.id, item.name)}
    >
      <Ionicons name={(item.icon as any) || 'grid-outline'} size={32} color="#333" />
      <Text style={styles.categoryText}>{item.name}</Text>
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
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search for products..." 
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {actions.map((item) => (
            <TouchableOpacity key={item.id} style={styles.actionButton} onPress={item.onPress}>
              <Ionicons name={item.icon as any} size={28} color="#000" />
              <Text style={styles.actionText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Deals - Now with horizontal scrolling */}
        <View style={styles.salePlaceholder}>
          <Text style={styles.saleText}>Featured Deals</Text>
          <FeaturedDealsSlider />
        </View>

        {/* Shop by Category */}
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        {loadingCategories ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#b1f03d" />
          </View>
        ) : (
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          />
        )}

        {/* Continue Selling (Now with iOS Arrow Icon) */}
        <TouchableOpacity 
          style={styles.continueSellingCard}
          onPress={handleContinueSellingPress}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.continueSellingTitle}>Continue Selling</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#777" />
          </View>
          <View style={styles.continueSellingRow}>
            <Text style={styles.continueSellingText}>Your recently added products will appear here.</Text>
           
          </View>
        </TouchableOpacity>

        
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
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 3,
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
    paddingVertical: 23,
    marginHorizontal: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 1,
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
    marginRight: 12,
    padding: 13,
    backgroundColor: '#fffff',
    borderRadius: 15,
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
    elevation: 1,
    gap: 10,
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
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
});