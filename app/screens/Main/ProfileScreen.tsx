import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Header from '@/components/Header';
import { globalStyles } from '../../../theme/styles';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Button from '@/components/Button';

const Hi = () => {
    console.log("Hi");
  };

const ProfileScreen = () => {
  // Sample user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    profilePicture: 'https://source.unsplash.com/100x100/?portrait', // Placeholder image
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f6f6f6', padding: 16 }}>
      <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} />
      <Text style={globalStyles.title}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <Button title="Edit Profile" onPress={Hi} />

      <Button title="Back" onPress={Hi} />
    </View>
  );
};

const styles = StyleSheet.create({
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  email: {
    fontSize: 16,
    color: Colors.secondary,
    marginBottom: 20,
  },
});

export default ProfileScreen;