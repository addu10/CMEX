import React, { useState } from 'react';
import { Text, View, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppFonts } from '../../../assets/fonts/fonts';
import * as ImagePicker from 'expo-image-picker';
import Header from '@/components/Header';

const ProfileScreen = () => {
  const fontsLoaded = useAppFonts();
  const [profilePicture, setProfilePicture] = useState('https://source.unsplash.com/100x100/?portrait');

  if (!fontsLoaded) {
    return null;
  }

  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photos to change the profile picture.');
      return;
    }

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
      <Header />
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        </TouchableOpacity>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <View style={styles.optionsContainer}>
        {([
          { label: 'Edit Profile', icon: 'person-circle-outline', action: () => console.log('Edit Profile Clicked'), color: '#000' },
          { label: 'Change Password', icon: 'key-outline', action: () => console.log('Change Password Clicked'), color: '#000' },
          { label: 'Order History', icon: 'time-outline', action: () => console.log('Order History Clicked'), color: '#000' },
          { label: 'Help & Support', icon: 'help-circle-outline', action: () => console.log('Help & Support Clicked'), color: '#000' },
          { label: 'Terms & Conditions', icon: 'document-text-outline', action: () => console.log('Terms & Conditions Clicked'), color: '#000' },
          { label: 'Delete Account', icon: 'trash-outline', action: () => console.log('Delete Account Clicked'), color: '#FF0000' },
        ] as const).map(({ label, icon, action, color = '#000' }, index) => (
          <TouchableOpacity key={index} style={styles.optionItem} onPress={action}>
            <Ionicons name={icon} size={24} color={color} />
            <Text style={[styles.optionText, color === '#FF0000' && { color }]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={() => console.log('Logout Clicked')}>
          <Text style={styles.logoutButtonText}>LOGOUT</Text>
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
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
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
