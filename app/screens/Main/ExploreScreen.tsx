import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '../../../lib/supabase';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  category_name: string;
  listing_type: 'sell' | 'rent';
  duration_unit?: string;
  user_details: {
    raw_user_meta_data: {
      first_name: string;
    };
  };
}

const ListingCard: React.FC<{ listing: Listing }> = ({ listing }) => (
  <View style={styles.card}>
    <Image source={{ uri: listing.image_url }} style={styles.cardImage} />
    <Text style={styles.cardTitle}>{listing.title}</Text>
    <Text style={styles.cardDescription} numberOfLines={2}>{listing.description}</Text>
    <Text style={styles.cardCategory}>{listing.category_name}</Text>
    <View style={styles.cardFooter}>
      <Text style={styles.cardPrice}>
        ₹{listing.price}
        {listing.listing_type === 'rent' && listing.duration_unit && 
          `/${listing.duration_unit}`
        }
      </Text>
      <Text style={styles.cardSeller}>
        by {listing.user_details?.raw_user_meta_data?.first_name || 'Unknown'}
      </Text>
    </View>
  </View>
);

export default function ExploreScreen() {
  const params = useLocalSearchParams();
  const initialListingType = params.listingType as 'all' | 'sell' | 'rent' || 'all';
  const initialCategoryId = params.categoryId as string || null;
  const initialSearchQuery = params.searchQuery as string || '';
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; icon: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategoryId);
  const [selectedType, setSelectedType] = useState<'all' | 'sell' | 'rent'>(initialListingType);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const listingTypes = [
    { id: 'all' as const, name: 'All' },
    { id: 'sell' as const, name: 'For Sale' },
    { id: 'rent' as const, name: 'For Rent' }
  ];

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Don't set error state as this is not a critical failure
    }
  };

  const fetchListings = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('listings')
        .select(`
          *,
          users!listings_user_id_fkey (
            first_name
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      // Apply category filter if selected and not "All"
      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      // Apply listing type filter if not "All"
      if (selectedType !== 'all') {
        query = query.eq('listing_type', selectedType);
      }

      // Apply search filter if there's a query
      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data: listingsData, error: listingsError } = await query;

      if (listingsError) throw listingsError;
      
      // Transform the data to match our Listing interface
      const transformedData = listingsData?.map(item => {
        // Find the matching category from our categories state
        const category = categories.find(cat => cat.id === item.category_id);
        
        return {
          ...item,
          category_name: category?.name || item.category_name || 'Unknown Category',
          user_details: {
            raw_user_meta_data: {
              first_name: item.users?.first_name || 'Unknown'
            }
          }
        };
      }) as Listing[];

      setListings(transformedData || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Handle filter changes
  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleTypeChange = (type: 'all' | 'sell' | 'rent') => {
    setSelectedType(type);
  };

  // Handle search with debounce
  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // Pull to refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    Promise.all([fetchCategories(), fetchListings()]);
  };

  // Effect to fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Effect to fetch listings when filters change
  useEffect(() => {
    fetchListings();
  }, [selectedCategory, selectedType, searchQuery]);

  const renderCategoryButton = (category: { id: string; name: string; icon: string }) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryButton,
        selectedCategory === category.id && styles.selectedCategoryButton
      ]}
      onPress={() => handleCategoryChange(category.id)}
    >
      <Ionicons 
        name={category.icon as any} 
        size={16} 
        color={selectedCategory === category.id ? '#000' : '#666'} 
        style={styles.categoryIcon}
      />
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === category.id && styles.selectedCategoryButtonText
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderAllCategoriesButton = () => (
    <TouchableOpacity
      key="all"
      style={[
        styles.categoryButton,
        selectedCategory === null && styles.selectedCategoryButton
      ]}
      onPress={() => handleCategoryChange(null)}
    >
      <Ionicons 
        name="grid-outline" 
        size={16} 
        color={selectedCategory === null ? '#000' : '#666'} 
        style={styles.categoryIcon}
      />
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === null && styles.selectedCategoryButtonText
      ]}>
        All
      </Text>
    </TouchableOpacity>
  );

  const renderTypeButton = (type: typeof listingTypes[number]) => (
    <TouchableOpacity
      key={type.id}
      style={[
        styles.typeButton,
        selectedType === type.id && styles.selectedTypeButton
      ]}
      onPress={() => handleTypeChange(type.id)}
    >
      <Text style={[
        styles.typeButtonText,
        selectedType === type.id && styles.selectedTypeButtonText
      ]}>
        {type.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search listings..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.typeFilters}
        >
          {listingTypes.map(renderTypeButton)}
        </ScrollView>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilters}
        >
          {renderAllCategoriesButton()}
          {categories.map(renderCategoryButton)}
        </ScrollView>
      </View>

      {loading && !isRefreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#b1f03d" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          renderItem={({ item }) => <ListingCard listing={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No listings found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filtersContainer: {
    marginBottom: 10,
  },
  typeFilters: {
    marginBottom: 10,
  },
  categoryFilters: {
    flexGrow: 0,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTypeButton: {
    backgroundColor: '#b1f03d',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  selectedTypeButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  selectedCategoryButton: {
    backgroundColor: '#b1f03d',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 10,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  cardCategory: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b1f03d',
  },
  cardSeller: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#666',
  },
  categoryIcon: {
    marginRight: 8,
  },
});
