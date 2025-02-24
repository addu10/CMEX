import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, ScrollView, Image, TextInput, Dimensions } from 'react-native';
import Header from '@/components/Header';

const { width } = Dimensions.get('window');

export const LocalColors = {
    primary: '#b1f03d',
    secondary: '#333',
    background: '#fff',
    inputBackground: '#f9f9f9',
    border: '#ddd',
    buttonText: '#000',
    titleText: '#333',
    subtitleText: '#777',
    gray: '#7f8c8d',
};

interface Item {
  id: string;
  title: string;
  image: string;
  description: string;
  owner: string;
  price: string;
}

const PopularProductCard: React.FC<{ item: Item }> = ({ item }) => (
  <View style={styles.card}>
    <Image source={{ uri: item.image }} style={styles.image} />
    <Text style={styles.cardTitle}>{item.title}</Text>
    <Text style={styles.cardDescription}>{item.description}</Text>
    <Text style={styles.cardOwner}>Seller: {item.owner}</Text>
    <Text style={styles.cardPrice}>Price: ₹{item.price}</Text>
  </View>
);

const ExploreScreen: React.FC = () => {
  const [popularItems, setPopularItems] = useState<Item[]>([]);
  const [latestItems, setLatestItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://jsonplaceholder.typicode.com/posts'); // Test API
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setPopularItems(data.slice(0, 10).map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        image: 'https://via.placeholder.com/150',
        description: 'Lorem ipsum dolor sit amet',
        owner: 'John Doe',
        price: '1,500',
      })));
      setLatestItems(data.slice(10, 20).map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        image: 'https://via.placeholder.com/150',
        description: 'Lorem ipsum dolor sit amet',
        owner: 'Jane Doe',
        price: '2,000',
      })));
    } catch (err) {
      console.log("Network Error:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={LocalColors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: 'red' }]}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Header />
      <TextInput
        style={styles.searchBar}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <Text style={styles.sectionTitle}>Popular Products</Text>
      <FlatList
        data={popularItems}
        renderItem={({ item }) => <PopularProductCard item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListFooterComponent={<View style={{ height: 20 }} />} // Space after last card
      />

      <Text style={styles.sectionTitle}>Latest Products</Text>
      <FlatList
        data={latestItems}
        renderItem={({ item }) => <PopularProductCard item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListFooterComponent={<View style={{ height: 40, bottom: 50 }} />} // More space after last card
      />
    </ScrollView>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LocalColors.background,
    padding: 12,
  },
  searchBar: {
    height: 40,
    borderColor: LocalColors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: LocalColors.inputBackground,
    marginBottom: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    color: LocalColors.primary,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: LocalColors.inputBackground,
    borderRadius: 8,
    padding: 10,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    width: (width / 2) - 20,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4,
    color: LocalColors.titleText,
  },
  cardDescription: {
    fontSize: 12,
    color: LocalColors.subtitleText,
  },
  cardOwner: {
    fontSize: 12,
    color: LocalColors.gray,
    marginTop: 2,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: LocalColors.primary,
    marginTop: 6,
  },
  bottomSpacing: {
    height: 150,
  },
});

export default ExploreScreen;
