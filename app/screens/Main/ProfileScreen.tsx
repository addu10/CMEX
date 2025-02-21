import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Lexend_400Regular, Lexend_600SemiBold } from '@expo-google-fonts/lexend';
import * as ImagePicker from 'expo-image-picker';
import Header from '@/components/Header';
import Button from '@/components/Button';

const ProfileScreen = () => {
  const [profilePicture, setProfilePicture] = useState('https://source.unsplash.com/100x100/?portrait');
  const [fontsLoaded] = useFonts({
    Lexend_400Regular, Lexend_600SemiBold
  });

  if (!fontsLoaded) {
    return null;
  }

  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header />
      </View>
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        </TouchableOpacity>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionItem} onPress={() => console.log("Edit Profile Clicked")}>
          <Ionicons name="person-circle-outline" size={24} color="#000" />
          <Text style={styles.optionText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem} onPress={() => console.log("Change Password Clicked")}>
          <Ionicons name="key-outline" size={24} color="#000" />
          <Text style={styles.optionText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem} onPress={() => console.log("Order History Clicked")}>
          <Ionicons name="time-outline" size={24} color="#000" />
          <Text style={styles.optionText}>Order History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem} onPress={() => console.log("Help & Support Clicked")}>
          <Ionicons name="help-circle-outline" size={24} color="#000" />
          <Text style={styles.optionText}>Help & Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem} onPress={() => console.log("Terms & Conditions Clicked")}>
          <Ionicons name="document-text-outline" size={24} color="#000" />
          <Text style={styles.optionText}>Terms & Conditions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem} onPress={() => console.log("Delete Account Clicked")}>
          <Ionicons name="trash-outline" size={24} color="#FF0000" />
          <Text style={[styles.optionText, { color: '#FF0000' }]}>Delete Account</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.uiverseButton} onPress={() => console.log("Logout Clicked")}>
          <Text style={styles.uiverseButtonText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    padding: 16,
    alignItems: 'center',
  },
  headerContainer: {
    width: '100%',
    marginBottom: 10,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  imageContainer: {
    borderRadius: 60,
    overflow: 'hidden',
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#ddd',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    fontFamily: 'Lexend_600SemiBold',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    fontFamily: 'Lexend_400Regular',
  },
  optionsContainer: {
    width: '100%',
    marginTop: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
    fontFamily: 'Lexend_400Regular',
  },
  logoutContainer: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  uiverseButton: {
    position: 'relative',
    height: 50,
    paddingHorizontal: 30,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uiverseButtonText: {
    fontSize: 15,
    fontWeight: '600',
  }
});

export default ProfileScreen;
