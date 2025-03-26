import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { AuthContext } from '@/app/_layout';

export default function DeleteAccount() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: confirmDeleteAccount }
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    if (!password) {
      Alert.alert('Error', 'Please enter your password to confirm deletion');
      return;
    }

    try {
      setLoading(true);
      
      // First verify the password is correct by signing in
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user?.email) {
        throw new Error('Unable to get user information');
      }
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.user.email,
        password: password,
      });

      if (signInError) {
        Alert.alert('Error', 'Password is incorrect');
        setLoading(false);
        return;
      }

      // Delete user
      const { error } = await supabase.auth.admin.deleteUser(userData.user.id);
      
      if (error) {
        // If admin delete fails, try self-deletion
        const { error: selfDeleteError } = await supabase.rpc('delete_user');
        if (selfDeleteError) {
          throw selfDeleteError;
        }
      }

      Alert.alert(
        "Account Deleted",
        "Your account has been successfully deleted.",
        [
          { 
            text: "OK", 
            onPress: () => {
              // Sign out and redirect to auth
              supabase.auth.signOut();
              setIsAuthenticated(false);
              router.replace('/(auth)');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert('Error', 'Failed to delete account. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delete Account</Text>
        <View style={styles.placeholderIcon} />
      </View>
      
      <View style={styles.content}>
        <Ionicons name="warning" size={60} color="#FF0000" style={styles.warningIcon} />
        
        <Text style={styles.warningTitle}>Delete Your Account</Text>
        
        <Text style={styles.warningText}>
          This action is permanent and cannot be undone. All your data, including profile information, 
          order history, and saved items will be permanently deleted.
        </Text>
        
        <View style={styles.separator} />
        
        <Text style={styles.confirmText}>
          Please enter your password to confirm:
        </Text>
        
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={handleDeleteAccount}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.deleteButtonText}>DELETE ACCOUNT</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  content: {
    padding: 20,
    alignItems: 'center',
  },
  warningIcon: {
    marginBottom: 20,
  },
  warningTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 15,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  confirmText: {
    fontSize: 16,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  passwordContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    width: '100%',
    marginBottom: 30,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  cancelButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#000',
  },
}); 