import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, SafeAreaView, FlatList, ActivityIndicator, Alert } from 'react-native';
import Header from '@/components/Header';
import { globalStyles } from '../../../theme/styles'; // Adjust the path as necessary
import { Colors } from '../../../theme/colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { supabase } from '../../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface SavedItem {
    id: string;
    listing_id: string;
    user_id: string;
    created_at: string;
    listing: {
        id: string;
        title: string;
        description: string;
        price: number;
        image_url: string;
        category_name?: string;
        listing_type: 'sell' | 'rent';
        duration_unit?: string;
        user_id: string;
        user?: {
            first_name: string;
        };
    };
}

const SavedItemCard: React.FC<{ 
    item: SavedItem;
    onRemove: (itemId: string) => void;
}> = ({ item, onRemove }) => {
    const router = useRouter();
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    
    const handleViewListing = () => {
        // Navigate to product detail page with the listing ID
        router.push({
            pathname: '/product/[id]',
            params: { id: item.listing_id }
        });
    };
    
    const renderPlaceholder = () => {
        if (imageLoading || imageError) {
            return (
                <View style={[styles.cardImage, styles.imagePlaceholder]}>
                    {imageError ? (
                        <Ionicons name="image-outline" size={60} color="#ccc" />
                    ) : (
                        <ActivityIndicator size="large" color={Colors.primary} />
                    )}
                </View>
            );
        }
        return null;
    };
    
    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image 
                    source={{ uri: item.listing.image_url }} 
                    style={styles.cardImage}
                    onLoadStart={() => setImageLoading(true)}
                    onLoadEnd={() => setImageLoading(false)}
                    onError={() => {
                        setImageLoading(false);
                        setImageError(true);
                    }}
                />
                {renderPlaceholder()}
            </View>
            <TouchableOpacity 
                style={styles.removeButton} 
                onPress={() => onRemove(item.id)}
            >
                <Ionicons name="heart" size={24} color="#f03d3d" />
            </TouchableOpacity>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.listing.title}</Text>
                <Text style={styles.cardDescription} numberOfLines={1}>{item.listing.description}</Text>
                <View style={styles.cardFooter}>
                    <Text style={styles.cardPrice}>
                        ₹{item.listing.price}
                        {item.listing.listing_type === 'rent' && item.listing.duration_unit && 
                            `/${item.listing.duration_unit}`
                        }
                    </Text>
                    <TouchableOpacity 
                        style={styles.viewButton}
                        onPress={handleViewListing}
                    >
                        <Text style={styles.viewButtonText}>View</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const SavedScreen: React.FC = () => {
    const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
    const router = useRouter();

    // Get current user and load saved items
    useEffect(() => {
        const fetchCurrentUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.error('Error fetching user:', error);
                setLoading(false);
                return;
            }
            
            if (data?.user) {
                setCurrentUser({ id: data.user.id });
                fetchSavedItems(data.user.id);
            } else {
                setLoading(false);
            }
        };
        
        fetchCurrentUser();
    }, []);

    const fetchSavedItems = async (userId: string) => {
        try {
            setLoading(true);
            
            const { data, error } = await supabase
                .from('saved_items')
                .select(`
                    *,
                    listing:listings(
                        id, title, description, price, image_url, listing_type, duration_unit, user_id, 
                        users:users(first_name)
                    )
                `)
                .eq('user_id', userId);
                
            if (error) throw error;
            
            // Transform data to include product information
            const transformedData = data?.map(item => ({
                ...item,
                listing: {
                    ...item.listing,
                    user: item.listing.users
                }
            })) as SavedItem[];
            
            setSavedItems(transformedData || []);
        } catch (err) {
            console.error('Error fetching saved items:', err);
            Alert.alert('Error', 'Failed to load saved items. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveSavedItem = async (itemId: string) => {
        try {
            // Delete the saved item
            const { error } = await supabase
                .from('saved_items')
                .delete()
                .eq('id', itemId);
                
            if (error) throw error;
            
            // Update the UI
            setSavedItems(savedItems.filter(item => item.id !== itemId));
        } catch (err) {
            console.error('Error removing saved item:', err);
            Alert.alert('Error', 'Failed to remove item. Please try again.');
        }
    };

    const handleBrowseProducts = () => {
        router.push('/explore');
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeContainer}>
                <View style={styles.container}>
                    <Header />
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>
                <Header />
                
                {!currentUser ? (
                    <View style={styles.emptyStateContainer}>
                        <Text style={styles.message}>
                            Please sign in to view your saved items.
                        </Text>
                        <TouchableOpacity style={styles.button} onPress={() => router.push('/(auth)')}>
                            <Text style={[styles.buttonText, { color: '#000', textAlign: 'center' }]}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                ) : savedItems.length === 0 ? (
                    <View style={styles.emptyStateContainer}>
                        <Ionicons name="heart-outline" size={80} color="#ccc" style={styles.emptyIcon} />
                        <Text style={styles.message}>
                            Your wishlist is currently empty.
                        </Text>
                        <TouchableOpacity style={styles.button} onPress={handleBrowseProducts}>
                            <Text style={[styles.buttonText, { color: '#000', textAlign: 'center' }]}>Browse Products</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={savedItems}
                        renderItem={({ item }) => <SavedItemCard item={item} onRemove={handleRemoveSavedItem} />}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyStateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyImage: {
        width: 200,
        height: 200,
        marginBottom: 16,
    },
    emptyIcon: {
        marginBottom: 16,
    },
    message: {
        fontSize: 18,
        textAlign: 'center',
        color: Colors.secondary,
        marginBottom: 16,
    },
    button: {
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        textAlign: 'center',
    },
    listContainer: {
        paddingTop: 10,
        paddingBottom: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
    },
    imageContainer: {
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: 180,
    },
    imagePlaceholder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    cardContent: {
        padding: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    viewButton: {
        padding: 6,
        paddingHorizontal: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
    },
    viewButtonText: {
        fontWeight: 'bold',
        color: '#444',
    },
});

export default SavedScreen;
