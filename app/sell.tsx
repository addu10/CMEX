import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import SellPageScreen from './screens/Main/SellPageScreen';

export default function Sell() {
  const router = useRouter();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  
  // Set up keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  
  // Type-safe navigation paths
  const goToHome = () => router.push('/');
  const goToExplore = () => router.push('/explore');
  const goToSell = () => router.push('/sell');
  const goToChat = () => router.push('/chat');
  const goToProfile = () => router.push('/profile');
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Main content */}
      <View style={styles.content}>
        <SellPageScreen />
      </View>
      
      {/* Tab Bar - only show when keyboard is not visible */}
      {!isKeyboardVisible && (
        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={goToHome}
            activeOpacity={0.7}
          >
            <View style={styles.tabItemContainer}>
              <Ionicons name="home" size={24} color="white" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={goToExplore}
            activeOpacity={0.7}
          >
            <View style={styles.tabItemContainer}>
              <Ionicons name="search" size={24} color="white" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.sellButton} 
            onPress={goToSell}
            activeOpacity={0.7}
          >
            <FontAwesome5 name="plus" size={24} color="black" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={goToChat}
            activeOpacity={0.7}
          >
            <View style={styles.tabItemContainer}>
              <Ionicons name="chatbubble" size={24} color="white" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={goToProfile}
            activeOpacity={0.7}
          >
            <View style={styles.tabItemContainer}>
              <Ionicons name="person" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: 'black',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    height: '100%',
  },
  tabItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  sellButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#b1f03d',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  }
}); 