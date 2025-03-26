import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import ListingCard from '../components/ListingCard';

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
  status: 'active' | 'sold' | 'inactive';
  user_details: {
    raw_user_meta_data: {
      first_name: string;
    };
  };
}

export default function MyListingsScreen() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        router.replace('/(auth)');
        return;
      }

      let query = supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const { data: listingsData, error: listingsError } = await query;

      if (listingsError) throw listingsError;
      
      const transformedData = listingsData?.map(item => ({
        ...item,
        category_name: item.category_name || 'General',
        user_details: {
          raw_user_meta_data: {
            first_name: user.user_metadata.first_name || 'Unknown'
          }
        }
      })) as Listing[];

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

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchMyListings();
  };

  const handleEditListing = (listingId: string) => {
    // TODO: Implement edit functionality
    console.log('Edit listing:', listingId);
  };

  const handleDeleteListing = async (listingId: string) => {
    try {
      Alert.alert(
        "Delete Listing",
        "Are you sure you want to delete this listing? This action cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Delete", 
            style: "destructive",
            onPress: async () => {
              // Delete the listing from the database
              const { error } = await supabase
                .from('listings')
                .delete()
                .eq('id', listingId);

              if (error) throw error;

              // Refresh the listings
              fetchMyListings();
            } 
          }
        ]
      );
    } catch (err) {
      console.error('Error deleting listing:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      Alert.alert('Error', 'Failed to delete listing. Please try again.');
    }
  };

  const handleSellProduct = () => {
    router.push('/sell');
  };

  const ListingCardWithActions: React.FC<{ listing: Listing }> = ({ listing }) => (
    <View style={styles.listingContainer}>
      <ListingCard listing={listing} />
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditListing(listing.id)}
        >
          <Ionicons name="pencil" size={16} color="#000" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteListing(listing.id)}
        >
          <Ionicons name="trash" size={16} color="#fff" />
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Listings</Text>
        <TouchableOpacity onPress={handleSellProduct} style={styles.sellButton}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.sellProductsButton}
        onPress={handleSellProduct}
      >
        <Ionicons name="add-circle" size={20} color="#fff" />
        <Text style={styles.sellProductsButtonText}>Sell Products</Text>
      </TouchableOpacity>

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
          renderItem={({ item }) => <ListingCardWithActions listing={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No listings found</Text>
              <Text style={styles.emptySubtext}>
                You haven't posted any listings yet
              </Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 5,
  },
  placeholderIcon: {
    width: 34,
    height: 34,
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
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  listingContainer: {
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: '#b1f03d',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: '#fff',
  },
  sellButton: {
    width: 34,
    height: 34,
    backgroundColor: '#b1f03d',
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sellProductsButton: {
    flexDirection: 'row',
    backgroundColor: '#b1f03d',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 15,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellProductsButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
}); 