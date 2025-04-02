import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, ScrollView, Image, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
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
  is_saved?: boolean;
}

const ListingCard: React.FC<{
  listing: Listing;
  onToggleSave: (listingId: string, isSaved: boolean) => void;
  onPress?: () => void;
}> = ({ listing, onToggleSave, onPress }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleToggleSave = (e: any) => {
    e.stopPropagation(); // Prevent triggering card press
    onToggleSave(listing.id, !listing.is_saved);
  };

  const renderPlaceholder = () => {
    if (imageLoading || imageError) {
      return (
        <View style={[styles.cardImage, styles.imagePlaceholder]}>
          {imageError ? (
            <Ionicons name="image-outline" size={40} color="#ccc" />
          ) : (
            <ActivityIndicator size="small" color="#b1f03d" />
          )}
        </View>
      );
    }
    return null;
  };
  
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {listing.image_url ? (
          <Image
            source={{ uri: listing.image_url }}
            style={styles.cardImage}
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
            defaultSource={require('../../../assets/images/default-avatar.png')}
          />
        ) : (
          <View style={[styles.cardImage, styles.imagePlaceholder]}>
            <Ionicons name="image-outline" size={40} color="#ccc" />
          </View>
        )}
        {renderPlaceholder()}
      </View>
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleToggleSave}
      >
        <Ionicons
          name={listing.is_saved ? "heart" : "heart-outline"}
          size={24}
          color={listing.is_saved ? "#f03d3d" : "white"}
        />
      </TouchableOpacity>
      <Text style={styles.cardTitle} numberOfLines={1}>{listing.title}</Text>
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
    </TouchableOpacity>
  );
};

export default function ExploreScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const initialListingType = params.listingType as 'all' | 'sell' | 'rent' || 'all';
  const initialCategoryId = params.categoryId as string || null;
  const initialSearchQuery = params.searchQuery as string || '';

  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; icon: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategoryId);
  const [selectedType, setSelectedType] = useState<'all' | 'sell' | 'rent'>(initialListingType);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);

  // Add focus effect to refresh saved items
  useFocusEffect(
    React.useCallback(() => {
      if (currentUser) {
        // Only fetch saved items if user is logged in
        const updateSavedItems = async () => {
          const savedIds = await fetchSavedListings(currentUser.id);
          setListings(currentListings => 
            currentListings.map(listing => ({
              ...listing,
              is_saved: savedIds.includes(listing.id)
            }))
          );
        };
        updateSavedItems();
      }
    }, [currentUser])
  );

  const listingTypes = [
    { id: 'all' as const, name: 'All' },
    { id: 'sell' as const, name: 'For Sale' },
    { id: 'rent' as const, name: 'For Rent' }
  ];

  // Navigation to listing details
  const navigateToListing = (listingId: string) => {
    router.push({
      pathname: '/product/[id]',
      params: { id: listingId }
    });
  };

  // Debounce search query to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        return;
      }

      if (data?.user) {
        setCurrentUser({ id: data.user.id });
      }
    };

    fetchCurrentUser();
  }, []);

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

  const fetchSavedListings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('saved_items')
        .select('listing_id')
        .eq('user_id', userId);

      if (error) throw error;

      return data?.map(item => item.listing_id) || [];
    } catch (err) {
      console.error('Error fetching saved items:', err);
      return [];
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
      if (debouncedSearchQuery) {
        query = query.ilike('title', `%${debouncedSearchQuery}%`);
      }

      const { data: listingsData, error: listingsError } = await query;

      if (listingsError) throw listingsError;

      // Get saved listings if user is logged in
      let savedListingIds: string[] = [];
      if (currentUser) {
        savedListingIds = await fetchSavedListings(currentUser.id);
      }

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
          },
          is_saved: savedListingIds.includes(item.id)
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

  const toggleSaveItem = async (listingId: string, shouldSave: boolean) => {
    if (!currentUser) {
      Alert.alert(
        'Sign in required',
        'Please sign in to save items',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign In',
            onPress: () => router.push('/(auth)/login')
          }
        ]
      );
      return;
    }

    // Immediately update UI state
    setListings(listings.map(listing =>
      listing.id === listingId
        ? { ...listing, is_saved: shouldSave }
        : listing
    ));

    try {
      if (shouldSave) {
        // Add to saved items
        const { error } = await supabase
          .from('saved_items')
          .insert({
            user_id: currentUser.id,
            listing_id: listingId
          });

        if (error) throw error;
      } else {
        // Remove from saved items
        const { error } = await supabase
          .from('saved_items')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('listing_id', listingId);

        if (error) throw error;
      }
    } catch (err) {
      console.error('Error toggling saved item:', err);
      Alert.alert('Error', 'Failed to update saved items. Please try again.');

      // Revert UI state if the operation failed
      setListings(listings.map(listing =>
        listing.id === listingId
          ? { ...listing, is_saved: !shouldSave }
          : listing
      ));
    }
  };

  // Handle filter changes
  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleTypeChange = (type: 'all' | 'sell' | 'rent') => {
    setSelectedType(type);
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

  // Effect to fetch listings when filters change or user changes
  useEffect(() => {
    fetchListings();
  }, [selectedCategory, selectedType, debouncedSearchQuery, currentUser]);

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
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search listings..."
            value={searchQuery}
            onChangeText={setSearchQuery}
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
            <Ionicons name="alert-circle-outline" size={64} color="#f03d3d" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchListings}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={listings}
            renderItem={({ item }) => (
              <ListingCard
                listing={item}
                onToggleSave={toggleSaveItem}
                onPress={() => navigateToListing(item.id)}
              />
            )}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
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
  categoryIcon: {
    marginRight: 4,
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
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
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
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
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
    color: '#999',
  },
  saveButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  retryButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#b1f03d',
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
