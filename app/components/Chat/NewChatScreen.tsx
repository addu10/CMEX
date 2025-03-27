import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { chatService } from '@/app/services/chatService';
import { ChatUserInfo } from '@/app/types/chat';
import { navigateToConversation } from '@/app/utils/navigation';

// Separate component for user item to properly use hooks
const UserItem = ({
  user,
  isSelected,
  onSelect
}: {
  user: ChatUserInfo;
  isSelected: boolean;
  onSelect: (user: ChatUserInfo) => void;
}) => {
  const [imageError, setImageError] = useState(false);
  
  const displayName = user.first_name && user.last_name 
    ? `${user.first_name} ${user.last_name}` 
    : user.email || 'Unknown';

  return (
    <TouchableOpacity
      style={[
        styles.userItem,
        isSelected ? styles.selectedUserItem : null
      ]}
      onPress={() => onSelect(user)}
    >
      <View style={styles.avatarContainer}>
        {user.avatar_url && !imageError ? (
          <Image 
            source={{ uri: user.avatar_url }} 
            style={styles.avatar}
            onError={() => setImageError(true)}
            defaultSource={require('../../../assets/images/default-avatar.png')}
          />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <Text style={styles.avatarLetter}>
              {displayName[0].toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{displayName}</Text>
        {user.email && (
          <Text style={styles.userEmail}>{user.email}</Text>
        )}
      </View>
      {isSelected && (
        <Ionicons name="checkmark-circle" size={24} color="#b1f03d" />
      )}
    </TouchableOpacity>
  );
};

interface NewChatScreenProps {
  onBack: () => void;
}

const NewChatScreen = ({ onBack }: NewChatScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<ChatUserInfo[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ChatUserInfo | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setUsers([]);
      return;
    }

    try {
      setError(null);
      setSearching(true);
      const results = await chatService.searchUsers(searchQuery.trim());
      setUsers(results);
    } catch (error) {
      console.error('Error searching users:', error);
      setError('Failed to search for users. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectUser = (user: ChatUserInfo) => {
    setSelectedUser(prev => prev?.id === user.id ? null : user);
  };

  const handleStartConversation = async () => {
    if (!selectedUser) return;

    try {
      setError(null);
      setCreating(true);
      const conversation = await chatService.createConversation(selectedUser.id);
      navigateToConversation(router, conversation.id);
    } catch (error) {
      console.error('Error creating conversation:', error);
      setError('Failed to start conversation. Please try again.');
      setCreating(false);
    }
  };

  const renderUserItem = ({ item }: { item: ChatUserInfo }) => {
    const isSelected = !!(selectedUser && selectedUser.id === item.id);
    return (
      <UserItem 
        user={item} 
        isSelected={isSelected} 
        onSelect={handleSelectUser} 
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>New Chat</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={searching}
          >
            {searching ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Ionicons name="search" size={20} color="#000" />
            )}
          </TouchableOpacity>
        </View>
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {users.length > 0 ? (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={renderUserItem}
            contentContainerStyle={styles.usersList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery.trim() 
                ? 'No users found. Try a different search.'
                : 'Search for users to start a conversation.'}
            </Text>
          </View>
        )}

        {selectedUser && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartConversation}
              disabled={creating}
            >
              {creating ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={styles.startButtonText}>Start Conversation</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#b1f03d',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  usersList: {
    paddingHorizontal: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedUserItem: {
    backgroundColor: 'rgba(177, 240, 61, 0.1)',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderAvatar: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#666',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  startButton: {
    backgroundColor: '#b1f03d',
    paddingVertical: 12,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default NewChatScreen; 