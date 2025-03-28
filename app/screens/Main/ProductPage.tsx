import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { supabase } from '../../../lib/supabase';
import { chatService } from '@/app/services/chatService';

interface ProductDetails {
    id: string;
    title: string;
    description: string;
    price: number;
    image_url: string;
    category_name: string;
    listing_type: 'sell' | 'rent';
    duration_unit?: string;
    status: 'active' | 'sold' | 'inactive';
    created_at: string;
    user_id: string;
    user_details?: {
        avatar_url?: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        phone_no?: string;
        rating?: number;
    };
}

const ProductPage = () => {
    const params = useLocalSearchParams();
    const productId = params.id as string;

    const [product, setProduct] = useState<ProductDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    const fetchProductDetails = async () => {
        if (!productId) {
            setError('Product ID is missing');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            // Fetch product details from Supabase with user details via foreign key
            const { data: listingData, error: listingError } = await supabase
                .from('listings')
                .select(`
                    *,
                    users!listings_user_id_fkey (
                        id,
                        first_name,
                        last_name,
                        email,
                        phone_no
                    )
                `)
                .eq('id', productId)
                .single();

            if (listingError) throw listingError;
            if (!listingData) throw new Error('Product not found');

            // Fetch category details separately
            const { data: categoryData, error: categoryError } = await supabase
                .from('categories')
                .select('name')
                .eq('id', listingData.category_id)
                .single();

            if (categoryError && categoryError.code !== 'PGRST116') {
                console.warn('Category not found:', categoryError);
            }

            // Get avatar URL from Supabase storage
            let avatarUrl = null;
            if (listingData.users) {
                // Try to get avatar from storage
                const { data: avatarData } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(`${listingData.user_id}/avatar`);

                if (avatarData && avatarData.publicUrl) {
                    avatarUrl = avatarData.publicUrl;
                }
            }

            // Structure the product data
            const productDetails: ProductDetails = {
                ...listingData,
                category_name: categoryData?.name || 'Unknown Category',
                user_details: {
                    first_name: listingData.users?.first_name || 'Unknown',
                    last_name: listingData.users?.last_name || '',
                    email: listingData.users?.email || '',
                    phone_no: listingData.users?.phone_no || '',
                    avatar_url: avatarUrl
                }
            };

            setProduct(productDetails);
            setError(null);
        } catch (err) {
            console.error('Error fetching product details:', err);
            setError('Failed to load product details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleContactUser = async () => {
        if (!product || !product.user_id) {
            Alert.alert('Error', 'Seller information is not available');
            return;
        }

        try {
            // Check if user is logged in
            const { data } = await supabase.auth.getUser();
            if (!data.user) {
                Alert.alert(
                    'Sign in required',
                    'Please sign in to contact the seller',
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

            // Don't allow contacting yourself
            if (data.user.id === product.user_id) {
                Alert.alert('Cannot contact yourself', 'This is your own listing');
                return;
            }

            // Create or get existing conversation
            const conversation = await chatService.createConversation(product.user_id);

            // Navigate to the chat screen
            router.push(`/chat/${conversation.id}`);
        } catch (error) {
            console.error('Error starting conversation:', error);
            Alert.alert('Error', 'Failed to start conversation. Please try again.');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#b1f03d" />
            </View>
        );
    }

    if (error || !product) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error || 'Product not found'}</Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header with back button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Product Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: product.image_url }}
                        style={styles.productImage}
                        resizeMode="cover"
                    />
                    <View style={styles.badgeContainer}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {product.listing_type === 'sell' ? 'For Sale' : 'For Rent'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Product Info */}
                <View style={styles.infoContainer}>
                    {/* Title and Price */}
                    <View style={styles.titlePriceContainer}>
                        <Text style={styles.title}>{product.title}</Text>
                        <Text style={styles.price}>
                            ₹{product.price}
                            {product.listing_type === 'rent' && product.duration_unit &&
                                `/${product.duration_unit}`
                            }
                        </Text>
                    </View>

                    {/* Category and Date */}
                    <View style={styles.metaContainer}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{product.category_name}</Text>
                        </View>
                        <Text style={styles.dateText}>
                            Listed on {formatDate(product.created_at)}
                        </Text>
                    </View>

                    {/* Description */}
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{product.description}</Text>
                    </View>

                    {/* Product Details - Key specs
                    <View style={styles.detailsRow}>
                        <View style={styles.detailItem}>
                            <Ionicons name="location-outline" size={20} color="#666" />
                            <Text style={styles.detailText}>1km away</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="pricetag-outline" size={20} color="#666" />
                            <Text style={styles.detailText}>Brand New</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="shield-checkmark-outline" size={20} color="#666" />
                            <Text style={styles.detailText}>VIP</Text>
                        </View>
                    </View> */}

                    {/* Seller Info */}
                    <View style={styles.sellerContainer}>
                        <Text style={styles.sectionTitle}>Seller Information</Text>
                        <View style={styles.sellerInfoCard}>
                            <View style={styles.sellerProfileContainer}>
                                {product.user_details?.avatar_url ? (
                                    <Image
                                        source={{ uri: product.user_details.avatar_url }}
                                        style={styles.sellerAvatar}
                                    />
                                ) : (
                                    <View style={styles.sellerAvatarPlaceholder}>
                                        <Text style={styles.sellerAvatarPlaceholderText}>
                                            {product.user_details?.first_name?.charAt(0) || 'U'}
                                        </Text>
                                    </View>
                                )}
                                <View style={styles.sellerInfo}>
                                    <Text style={styles.sellerName}>
                                        {product.user_details?.first_name || 'Unknown'} {product.user_details?.last_name || ''}
                                    </Text>
                                    {product.user_details?.phone_no ? (
                                        <View style={styles.contactInfoRow}>
                                            <Ionicons name="call-outline" size={16} color="#666" />
                                            <Text style={styles.contactInfoText}>
                                                {product.user_details.phone_no}
                                            </Text>
                                        </View>
                                    ) : (
                                        <Text style={styles.contactInfoText}>Contact via chat</Text>
                                    )}
                                    {product.user_details?.email && (
                                        <View style={styles.contactInfoRow}>
                                            <Ionicons name="mail-outline" size={16} color="#666" />
                                            <Text style={styles.contactInfoText}>
                                                {product.user_details.email}
                                            </Text>
                                        </View>
                                    )}
                                    <Text style={styles.sellerNote}>Tap the button below to chat with the seller</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Contact Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.contactButton} onPress={handleContactUser}>
                    <Ionicons name="chatbubble-outline" size={22} color="#fff" style={styles.contactButtonIcon} />
                    <Text style={styles.contactButtonText}>Chat with Seller</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    errorText: {
        fontSize: 16,
        color: '#ff3b30',
        textAlign: 'center',
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 8,
    },
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 280,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    badgeContainer: {
        position: 'absolute',
        top: 15,
        left: 15,
    },
    badge: {
        backgroundColor: '#b1f03d',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 12,
    },
    infoContainer: {
        padding: 20,
    },
    titlePriceContainer: {
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 5,
    },
    price: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#b1f03d',
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    categoryBadge: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 15,
        marginRight: 10,
    },
    categoryText: {
        fontSize: 12,
        color: '#666',
    },
    dateText: {
        fontSize: 12,
        color: '#999',
    },
    descriptionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000',
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 15,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        marginLeft: 5,
        fontSize: 12,
        color: '#666',
    },
    sellerContainer: {
        marginTop: 16,
        paddingBottom: 100, // Extra padding at the bottom for the fixed button
    },
    sellerInfoCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sellerProfileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sellerAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#eee',
    },
    sellerAvatarPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sellerAvatarPlaceholderText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    sellerInfo: {
        marginLeft: 16,
        flex: 1,
    },
    sellerName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    contactInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    contactInfoText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 6,
    },
    buttonContainer: {
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    contactButton: {
        backgroundColor: '#b1f03d',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    contactButtonIcon: {
        marginRight: 10,
    },
    contactButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButtonText: {
        color: '#007aff',
        fontSize: 16,
    },
    sellerNote: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
        marginTop: 8,
    },
});

export default ProductPage; 