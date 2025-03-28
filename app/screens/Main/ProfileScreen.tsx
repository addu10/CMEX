import React, { useState, useEffect, useContext } from 'react';
import { Text, View, Image, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
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
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
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
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => navigateTo('edit-profile')}
              activeOpacity={0.7}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name="person-circle-outline" size={24} color="#666" />
              </View>
              <Text style={styles.optionText}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" style={styles.chevronIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => navigateTo('my-listings')}
              activeOpacity={0.7}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name="list-outline" size={24} color="#666" />
              </View>
              <Text style={styles.optionText}>My Listings</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" style={styles.chevronIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => navigateTo('change-password')}
              activeOpacity={0.7}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name="key-outline" size={24} color="#666" />
              </View>
              <Text style={styles.optionText}>Change Password</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" style={styles.chevronIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => navigateTo('order-history')}
              activeOpacity={0.7}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name="time-outline" size={24} color="#666" />
              </View>
              <Text style={styles.optionText}>Order History</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" style={styles.chevronIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => navigateTo('help-support')}
              activeOpacity={0.7}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name="help-circle-outline" size={24} color="#666" />
              </View>
              <Text style={styles.optionText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" style={styles.chevronIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => navigateTo('terms-conditions')}
              activeOpacity={0.7}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name="document-text-outline" size={24} color="#666" />
              </View>
              <Text style={styles.optionText}>Terms & Conditions</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" style={styles.chevronIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => navigateTo('delete-account')}
              activeOpacity={0.7}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
              </View>
              <Text style={[styles.optionText, { color: '#FF3B30' }]}>Delete Account</Text>
              <Ionicons name="chevron-forward" size={20} color="#FF3B30" style={styles.chevronIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.logoutIcon} />
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 15,
    marginHorizontal: 15,
    borderRadius: 15,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#b1f03d',
    borderRadius: 60,
    padding: 3,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  profilePicture: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#b1f03d',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    width: 110,
    height: 110,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  optionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 15,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  chevronIcon: {
    marginLeft: 8,
  },
  logoutContainer: {
    marginTop: 30,
    marginBottom: 30,
    paddingHorizontal: 15,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
});

export default ProfileScreen;
