import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { useAppFonts } from '../../../assets/fonts/fonts';
import Header from '../../../components/Header';
import { styles } from '../../../assets/styles/styles';
import { Colors } from '../../../assets/styles/colors';

interface Item {
  id: string;
  title: string;
}

const ExploreScreen: React.FC = () => {
  const fontsLoaded = useAppFonts();
  const [items, setItems] = useState<Item[]>([]);
  const [popularItems, setPopularItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.example.com/explore-items');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setItems(data.items);
      setPopularItems(data.popularItems);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderItem = useCallback(({ item }: { item: Item }) => (
    <TouchableOpacity style={styles.explore.itemContainer}>
      <Text style={styles.explore.itemTitle}>{item.title}</Text>
    </TouchableOpacity>
  ), []);

  if (!fontsLoaded) return null;
  if (loading) {
    return (
      <View style={styles.explore.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.explore.errorContainer}>
        <Text style={styles.explore.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.explore.container}>
      <Header />
      <Text style={styles.explore.sectionTitle}>Explore Marketplace</Text>

      <Text style={styles.explore.sectionTitle}>Popular Products</Text>
      <FlatList
        data={popularItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.explore.horizontalList}
      />

      <Text style={styles.explore.sectionTitle}>All Products</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.explore.row}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={
          <Text style={styles.explore.emptyText}>No items available</Text>
        }
      />
    </ScrollView>
  );
};

export default ExploreScreen;
