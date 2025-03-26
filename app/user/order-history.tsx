import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { AuthContext } from '@/app/_layout';

type OrderItem = {
  id: string;
  title: string;
  price: number;
  date: string;
  status: 'completed' | 'processing' | 'cancelled';
  seller: string;
  image: string;
};

export default function OrderHistory() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)');
      return;
    }
    
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }

      // In a real app, you would fetch orders from a Supabase table
      // For now, using sample data
      setOrders([
        {
          id: '1',
          title: 'Data Structures & Algorithms Textbook',
          price: 450,
          date: '2023-03-20',
          status: 'completed',
          seller: 'John Doe',
          image: 'https://source.unsplash.com/100x100/?textbook'
        },
        {
          id: '2',
          title: 'Scientific Calculator',
          price: 800,
          date: '2023-03-15',
          status: 'completed',
          seller: 'Jane Smith',
          image: 'https://source.unsplash.com/100x100/?calculator'
        },
        {
          id: '3',
          title: 'Architecture Drawing Board',
          price: 1200,
          date: '2023-03-05',
          status: 'cancelled',
          seller: 'Robert Johnson',
          image: 'https://source.unsplash.com/100x100/?drawing'
        },
        {
          id: '4',
          title: 'Computer Science Notes',
          price: 250,
          date: '2023-02-28',
          status: 'processing',
          seller: 'Lisa Williams',
          image: 'https://source.unsplash.com/100x100/?notes'
        },
        {
          id: '5',
          title: 'Engineering Drafting Tools',
          price: 650,
          date: '2023-02-20',
          status: 'completed',
          seller: 'Michael Brown',
          image: 'https://source.unsplash.com/100x100/?tools'
        }
      ]);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed':
        return '#34C759';
      case 'processing':
        return '#FF9500';
      case 'cancelled':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderOrderItem = ({ item }: { item: OrderItem }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderDate}>Ordered on {formatDate(item.date)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.orderContent}>
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder} />
        </View>
        <View style={styles.orderDetails}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemPrice}>₹{item.price}</Text>
          <Text style={styles.sellerName}>Seller: {item.seller}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#b1f03d" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={styles.placeholderIcon} />
      </View>
      
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.ordersList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#d1d1d1" />
          <Text style={styles.emptyText}>You haven't placed any orders yet.</Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => router.push('/explore')}
          >
            <Text style={styles.shopButtonText}>SHOP NOW</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
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
  ordersList: {
    padding: 15,
  },
  orderItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  orderContent: {
    flexDirection: 'row',
  },
  imageContainer: {
    marginRight: 15,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  orderDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#b1f03d',
    marginBottom: 5,
  },
  sellerName: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: '#b1f03d',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  shopButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
}); 