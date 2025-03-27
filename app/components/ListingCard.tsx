import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

interface UserMetadata {
  first_name?: string;
  last_name?: string;
  phone_no?: string;
  cat_reg_no?: string;
  department?: string;
  avatar_url?: string;
}

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string | null;
  category_id: string;
  category_name?: string;
  listing_type: 'sell' | 'rent';
  duration_unit?: string;
  duration_value?: number;
  status: 'active' | 'sold' | 'inactive';
  created_at: string;
  updated_at?: string;
  user_id: string;
  user_details?: {
    raw_user_meta_data?: UserMetadata;
  } | null;
}

interface ListingCardProps {
  listing: Listing;
  onPress?: () => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push({
        pathname: '/product/[id]',
        params: { id: listing.id }
      } as any);
    }
  };

  const defaultImage = 'https://via.placeholder.com/300x200?text=No+Image';
  const sellerName = listing.user_details?.raw_user_meta_data?.first_name || 'Unknown';

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: listing.image_url || defaultImage }} 
        style={styles.cardImage}
        defaultSource={{ uri: defaultImage }}
      />
      <Text style={styles.cardTitle} numberOfLines={1}>
        {listing.title || 'Untitled'}
      </Text>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {listing.description || 'No description available'}
      </Text>
      <Text style={styles.cardCategory}>
        {listing.category_name || 'General'}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardPrice}>
          ₹{typeof listing.price === 'number' ? listing.price : 0}
          {listing.listing_type === 'rent' && listing.duration_unit &&
            `/${listing.duration_unit}`
          }
        </Text>
        <Text style={styles.cardSeller}>
          by {sellerName}
        </Text>
      </View>
      {listing.status !== 'active' && (
        <View style={styles.statusOverlay}>
          <Text style={styles.statusText}>
            {listing.status === 'sold' ? 'SOLD' : 'INACTIVE'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 10,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
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
  statusOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ListingCard; 