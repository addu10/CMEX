import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { router } from 'expo-router';

interface FeaturedItem {
  id: string;
  title: string;
  price: number;
  image_url: string;
  category_name: string;
}

const FeaturedDealsSlider = () => {
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedItems();
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      setLoading(true);

      // First get all categories
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (categoriesError) throw categoriesError;

      if (!categories || categories.length === 0) {
        setFeaturedItems([]);
        return;
      }

      // For each category, get the latest active listing
      const latestItemPromises = categories.map(async (category) => {
        const { data: items, error: itemsError } = await supabase
          .from('listings')
          .select(`
            id,
            title,
            price,
            image_url,
            category_id
          `)
          .eq('category_id', category.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1);

        if (itemsError) {
          console.error(`Error fetching items for category ${category.id}:`, itemsError);
          return null;
        }

        if (items && items.length > 0) {
          return {
            ...items[0],
            category_name: category.name
          };
        }

        return null;
      });

      const results = await Promise.all(latestItemPromises);
      const filteredResults = results.filter(item => item !== null) as FeaturedItem[];

      setFeaturedItems(filteredResults);
      setError(null);
    } catch (err) {
      console.error('Error fetching featured items:', err);
      setError('Failed to load featured items');
    } finally {
      setLoading(false);
    }
  };

  const handleViewItem = (itemId: string) => {
    // Navigate to item details page
    router.push({
      pathname: '/product/[id]',
      params: { id: itemId }
    });
  };

  const renderDealItem = ({ item }: { item: FeaturedItem }) => (
    <TouchableOpacity
      style={styles.dealItem}
      onPress={() => handleViewItem(item.id)}
    >
      <View style={styles.dealContent}>
        <Text style={styles.dealCategory}>{item.category_name}</Text>
        <Text style={styles.dealTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.dealPrice}>₹{item.price.toLocaleString()}</Text>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => handleViewItem(item.id)}
        >
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image_url }}
          style={styles.dealImage}
          resizeMode="cover"
        />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#b1f03d" />
      </View>
    );
  }

  if (error || featuredItems.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || "No featured items available"}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={featuredItems}
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
  dealCategory: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 2,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    flex: 1,
  },
  dealPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
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
    fontWeight: 'bold',
  },
  imageContainer: {
    width: 120,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dealImage: {
    width: 110,
    height: 110,
    borderRadius: 8,
  },
  loadingContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#777',
    textAlign: 'center',
  },
});

export default FeaturedDealsSlider;