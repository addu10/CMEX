import React, { useState } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppFonts } from '../../../assets/fonts/fonts';
import * as ImagePicker from 'expo-image-picker';
import Header from '@/components/Header';
import { styles } from '../../../assets/styles/styles';

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
        <TouchableOpacity style={styles.logoutButton} onPress={() => console.log("Logout Clicked")}>
          <Text style={styles.logoutButtonText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;
