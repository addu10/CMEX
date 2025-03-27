import React, { useState, useEffect, useContext } from 'react';
import { Text, View, Image, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppFonts } from '../../../assets/fonts/fonts';
import * as ImagePicker from 'expo-image-picker';
import Header from '@/components/Header';
import { supabase } from '../../../lib/supabase';
import { AuthContext } from '../../_layout';
import { router } from 'expo-router';
import { decode } from 'base64-arraybuffer';

const ProfileScreen = () => {
  const fontsLoaded = useAppFonts();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }

      if (user) {
        // Set user data from metadata
        setUserData({
          name: `${user.user_metadata.first_name || ''} ${user.user_metadata.last_name || ''}`.trim() || 'User',
          email: user.email || 'No email provided',
          ...user.user_metadata
        });

        // Check if user has a profile picture
        if (user.user_metadata.avatar_url) {
          setProfilePicture(user.user_metadata.avatar_url);
        } else {
          // Try to fetch profile picture from storage
          await fetchProfilePicture(user.id);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Alert.alert('Error', 'Failed to load profile information');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfilePicture = async (userId: string) => {
    try {
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(`${userId}/avatar`);
      
      const publicUrl = data.publicUrl;

      // Check if the image exists before setting it
      fetch(publicUrl, { method: 'HEAD' })
        .then(res => {
          if (res.ok) {
            setProfilePicture(publicUrl);
            // Update user metadata with avatar URL
            updateUserMetadata({ avatar_url: publicUrl });
          }
        })
        .catch(() => {
          // Use default if no image exists
          setProfilePicture('https://source.unsplash.com/100x100/?portrait');
        });
    } catch (error) {
      console.error('Error fetching avatar:', error);
      setProfilePicture('https://source.unsplash.com/100x100/?portrait');
    }
  };

  const updateUserMetadata = async (metadata: any) => {
    try {
      // If metadata contains phone field, rename it to phone_no for consistency
      if (metadata.phone !== undefined) {
        metadata.phone_no = metadata.phone;
        delete metadata.phone;
      }
      
      const { error } = await supabase.auth.updateUser({
        data: metadata
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating user metadata:', error);
    }
  };

  const uploadProfilePicture = async (base64Image: string, userId: string) => {
    try {
      setUploadingImage(true);
      
      // Clean up base64 string - remove prefix if exists
      const formattedBase64 = base64Image.includes('base64,') ? 
        base64Image.split('base64,')[1] : 
        base64Image;
      
      // Convert base64 to ArrayBuffer
      const arrayBuffer = decode(formattedBase64);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(`${userId}/avatar`, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (error) {
        throw error;
      }

      console.log('Profile picture uploaded successfully:', data);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(`${userId}/avatar`);

      const publicUrl = urlData.publicUrl;

      // Update profile picture state
      setProfilePicture(publicUrl);

      // Update user metadata with the new avatar URL
      await updateUserMetadata({ avatar_url: publicUrl });

      Alert.alert('Success', 'Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      Alert.alert('Error', 'Failed to upload profile picture');
    } finally {
      setUploadingImage(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photos to change the profile picture.');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        // Get current user
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          Alert.alert('Error', 'Failed to get user information');
          return;
        }

        // Upload profile picture
        await uploadProfilePicture(result.assets[0].base64, user.id);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select profile picture');
    }
  };

  const handleLogout = async () => {
    try {
      Alert.alert(
        "Log Out",
        "Are you sure you want to log out?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Log Out", 
            style: "destructive",
            onPress: async () => {
              setLoading(true);
              const { error } = await supabase.auth.signOut();
              
              if (error) {
                throw error;
              }
              
              // Session state will be handled by the auth listener in _layout.tsx
              setIsAuthenticated(false);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
      setLoading(false);
    }
  };

  const navigateTo = (screen: string) => {
    try {
      // Convert dash-case to camelCase if needed
      console.log(`[ProfileScreen] Attempting to navigate to: /user/${screen}`);
      
      // Handle each route explicitly for debugging
      if (screen === 'edit-profile') {
        router.push('/user/edit-profile' as any);
      } else if (screen === 'change-password') {
        router.push('/user/change-password' as any);
      } else if (screen === 'order-history') {
        router.push('/user/order-history' as any);
      } else if (screen === 'help-support') {
        router.push('/user/help-support' as any);
      } else if (screen === 'terms-conditions') {
        router.push('/user/terms-conditions' as any);
      } else if (screen === 'delete-account') {
        router.push('/user/delete-account' as any);
      } else if (screen === 'my-listings') {
        router.push('/user/my-listings' as any);
      } else {
        console.error(`Unknown screen: ${screen}`);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Try a backup method
      try {
        const route = `/user/${screen}`;
        console.log(`[ProfileScreen] Trying backup navigation to: ${route}`);
        router.push(route as any);
      } catch (backupError) {
        console.error('Backup navigation failed:', backupError);
      }
    }
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Header />
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer} disabled={uploadingImage}>
            {uploadingImage ? (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="small" color="#fff" />
              </View>
            ) : (
              <Image 
                source={{ uri: profilePicture || 'https://source.unsplash.com/100x100/?portrait' }} 
                style={styles.profilePicture} 
              />
            )}
            <View style={styles.editIconContainer}>
              <Ionicons name="camera" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{userData?.name}</Text>
          <Text style={styles.email}>{userData?.email}</Text>
        </View>
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionItem} onPress={() => navigateTo('edit-profile')}>
            <Ionicons name="person-circle-outline" size={24} color="#000" />
            <Text style={styles.optionText}>Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionItem} onPress={() => navigateTo('my-listings')}>
            <Ionicons name="list-outline" size={24} color="#000" />
            <Text style={styles.optionText}>My Listings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionItem} onPress={() => navigateTo('change-password')}>
            <Ionicons name="key-outline" size={24} color="#000" />
            <Text style={styles.optionText}>Change Password</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionItem} onPress={() => navigateTo('order-history')}>
            <Ionicons name="time-outline" size={24} color="#000" />
            <Text style={styles.optionText}>Order History</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionItem} onPress={() => navigateTo('help-support')}>
            <Ionicons name="help-circle-outline" size={24} color="#000" />
            <Text style={styles.optionText}>Help & Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionItem} onPress={() => navigateTo('terms-conditions')}>
            <Ionicons name="document-text-outline" size={24} color="#000" />
            <Text style={styles.optionText}>Terms & Conditions</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionItem} onPress={() => navigateTo('delete-account')}>
            <Ionicons name="trash-outline" size={24} color="#FF0000" />
            <Text style={[styles.optionText, { color: '#FF0000' }]}>Delete Account</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 55,
    padding: 5,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#b1f03d',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    width: 100,
    height: 100,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: 'gray',
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
  },
  logoutContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ProfileScreen;
