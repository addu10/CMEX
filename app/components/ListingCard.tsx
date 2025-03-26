import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category_name: string;
  listing_type: 'sell' | 'rent';
  duration_unit?: string;
  user_details: {
    raw_user_meta_data: {
      first_name: string;
    };
  };
}

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => (
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
});

export default ListingCard; 