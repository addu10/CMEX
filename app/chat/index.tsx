import React, { useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import ConversationsList from '../components/Chat/ConversationsList';
import NewChatScreen from '../components/Chat/NewChatScreen';
import { AuthContext } from '@/app/_layout';

export default function ChatScreen() {
  const router = useRouter();
  const [showNewChat, setShowNewChat] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  // Set up keyboard listeners
  React.useEffect(() => {
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

  const handleNewChat = () => {
    setShowNewChat(true);
  };

  const handleBackFromNewChat = () => {
    setShowNewChat(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Main content */}
      <View style={styles.content}>
        {!isAuthenticated ? (
          <View style={styles.unauthenticatedContainer}>
            <Ionicons name="lock-closed" size={64} color="#ccc" />
            <Text style={styles.unauthenticatedText}>
              Please sign in to access your messages
            </Text>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => router.replace('/(auth)/login')}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        ) : showNewChat ? (
          <NewChatScreen onBack={handleBackFromNewChat} />
        ) : (
          <ConversationsList onNewChat={handleNewChat} />
        )}
      </View>

      {/* Tab Bar - only show when keyboard is not visible */}
      {!isKeyboardVisible && !showNewChat && (
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
              <Ionicons name="chatbubble" size={24} color="#b1f03d" />
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
  },
  unauthenticatedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unauthenticatedText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ccc',
  },
  signInButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#b1f03d',
    borderRadius: 5,
  },
  signInButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
}); 