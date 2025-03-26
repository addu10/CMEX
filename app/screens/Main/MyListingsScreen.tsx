import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '../../../lib/supabase';
import ListingCard from '../../components/ListingCard';

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
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'sold' | 'inactive'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const statusTypes = [
    { id: 'all' as const, name: 'All' },
    { id: 'active' as const, name: 'Active' },
    { id: 'sold' as const, name: 'Sold' },
    { id: 'inactive' as const, name: 'Inactive' }
  ];

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
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Apply status filter if not "all"
      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus);
      }

      const { data: listingsData, error: listingsError } = await query;

      if (listingsError) throw listingsError;
      
      const transformedData = listingsData?.map(item => ({
        ...item,
        category_name: item.categories?.name || item.category_name || 'Unknown Category',
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
  }, [selectedStatus]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchMyListings();
  };

  const handleStatusChange = (status: typeof selectedStatus) => {
    setSelectedStatus(status);
  };

  const handleEditListing = (listingId: string) => {
    // TODO: Implement edit functionality
    console.log('Edit listing:', listingId);
  };

  const handleDeleteListing = async (listingId: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status: 'inactive' })
        .eq('id', listingId);

      if (error) throw error;

      // Refresh the listings
      fetchMyListings();
    } catch (err) {
      console.error('Error deleting listing:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const renderStatusButton = (status: { id: typeof selectedStatus; name: string }) => (
    <TouchableOpacity
      key={status.id}
      style={[
        styles.statusButton,
        selectedStatus === status.id && styles.selectedStatusButton
      ]}
      onPress={() => handleStatusChange(status.id)}
    >
      <Text style={[
        styles.statusButtonText,
        selectedStatus === status.id && styles.selectedStatusButtonText
      ]}>
        {status.name}
      </Text>
    </TouchableOpacity>
  );

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
        <View style={styles.placeholderIcon} />
      </View>

      <View style={styles.statusFilters}>
        <FlatList
          horizontal
          data={statusTypes}
          renderItem={({ item }) => renderStatusButton(item)}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          style={styles.statusList}
        />
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
                {selectedStatus === 'all' 
                  ? "You haven't posted any listings yet"
                  : `You don't have any ${selectedStatus.toLowerCase()} listings`}
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
  statusFilters: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  statusList: {
    paddingHorizontal: 15,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  selectedStatusButton: {
    backgroundColor: '#b1f03d',
  },
  statusButtonText: {
    fontSize: 14,
    color: '#666',
  },
  selectedStatusButtonText: {
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
}); 