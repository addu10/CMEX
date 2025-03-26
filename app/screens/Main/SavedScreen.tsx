import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Header from '@/components/Header';
import { globalStyles } from '../../../theme/styles'; // Adjust the path as necessary
import { Colors } from '../../../theme/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const SavedScreen: React.FC = () => {
    const savedItems: any[] = []; // Replace with actual wishlist items logic

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Header />
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {savedItems.length === 0 ? (
                        <View style={styles.emptyStateContainer}>
                            <Image 
                                source={{ uri: 'https://example.com/empty-wishlist.png' }} 
                                style={styles.emptyImage} 
                                accessibilityLabel="Empty wishlist illustration"
                            />
                            <Text style={styles.message} accessibilityRole="text">
                                Your wishlist is currently empty.
                            </Text>
                            <TouchableOpacity style={styles.button} onPress={() => console.log('Navigate to Browse')}
                                accessibilityRole="button"
                                accessibilityLabel="Browse products button">
                                <Text style={[styles.buttonText, { color: '#000', textAlign: 'center' }]}>Browse Products</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        // Render wishlist items here
                        <Text style={styles.message} accessibilityRole="text">Your saved items will appear here.</Text>
                    )}
                </ScrollView>
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
        padding: 16,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyImage: {
        width: 200,
        height: 200,
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
});

export default SavedScreen;
