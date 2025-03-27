import React, { useEffect, useState, useCallback, useContext } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Image,
  RefreshControl,
  SafeAreaView
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { chatService } from '@/app/services/chatService';
import { Conversation } from '@/app/types/chat';
import { format, formatDistanceToNow } from 'date-fns';
import { navigateToConversation } from '@/app/utils/navigation';
import { supabase } from '@/lib/supabase';
import { AuthContext } from '@/app/_layout';

// Styles for both components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  conversationInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  lastMessage: {
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  newChatButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 8,
  },
  retryButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#b1f03d',
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

// Separate component for conversation item
const ConversationItem = ({ 
  conversation, 
  otherParticipant, 
  onSelect 
}: { 
  conversation: Conversation;
  otherParticipant: { displayName: string; avatar_url: string | null | undefined };
  onSelect: (conversation: Conversation) => void;
}) => {
  const [imageError, setImageError] = useState(false);
  const lastMessage = conversation.last_message?.content || 'No messages yet';
  
  let timeAgo;
  try {
    timeAgo = conversation.last_message?.created_at 
      ? formatDistanceToNow(new Date(conversation.last_message.created_at), { addSuffix: true })
      : formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true });
  } catch (error) {
    timeAgo = 'recently';
  }

  const { displayName, avatar_url } = otherParticipant;

  return (
    <TouchableOpacity 
      style={styles.conversationItem}
      onPress={() => onSelect(conversation)}
    >
      <View style={styles.avatarContainer}>
        {avatar_url && !imageError ? (
          <Image 
            source={{ uri: avatar_url }} 
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
      <View style={styles.conversationInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={styles.time}>{timeAgo}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

interface ConversationsListProps {
  onNewChat: () => void;
}

const ConversationsList = ({ onNewChat }: ConversationsListProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated } = useContext(AuthContext);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error getting current user:', error);
          setError('Failed to authenticate user');
          setLoading(false);
          return;
        }
        setCurrentUser(data.user);
      } catch (error) {
        console.error('Error in getCurrentUser:', error);
        setError('Failed to authenticate user');
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      getCurrentUser();
    } else {
      setCurrentUser(null);
      setConversations([]);
      setLoading(false);
      setError(null);
    }
  }, [isAuthenticated]);

  // Load conversations and set up real-time subscription
  useEffect(() => {
    if (!currentUser || !isAuthenticated) {
      return;
    }

    let subscription: { unsubscribe: () => void } | null = null;

    const setupSubscription = () => {
      subscription = chatService.subscribeToConversations((updatedConversation) => {
        setConversations(prevConversations => {
          // Find if this conversation already exists
          const index = prevConversations.findIndex(c => c.id === updatedConversation.id);
          
          if (index !== -1) {
            // Update existing conversation
            const newConversations = [...prevConversations];
            newConversations[index] = updatedConversation;
            // Sort by updated_at
            return newConversations.sort((a, b) => 
              new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
            );
          } else {
            // Add new conversation
            return [updatedConversation, ...prevConversations].sort((a, b) => 
              new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
            );
          }
        });
      });
    };

    const initialize = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load initial conversations
        const conversationsData = await chatService.getConversations();
        setConversations(conversationsData);
        
        // Set up real-time subscription
        setupSubscription();
      } catch (err) {
        console.error('Error initializing conversations:', err);
        setError('Failed to load conversations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initialize();

    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [currentUser, isAuthenticated]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const conversationsData = await chatService.getConversations();
      setConversations(conversationsData);
      setError(null);
    } catch (err) {
      console.error('Error refreshing conversations:', err);
      setError('Failed to refresh conversations. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    navigateToConversation(router, conversation.id);
  };

  const getOtherParticipant = (conversation: Conversation) => {
    if (!conversation.participants || conversation.participants.length === 0) {
      return { displayName: 'Unknown', avatar_url: null };
    }

    // Find the participant that is not the current user
    const otherParticipant = conversation.participants.find(
      (p) => p.user_id !== currentUser?.id
    );

    if (!otherParticipant || !otherParticipant.user) {
      return { displayName: 'Unknown', avatar_url: null };
    }

    const { user: otherUser } = otherParticipant;
    const displayName = otherUser.first_name && otherUser.last_name
      ? `${otherUser.first_name} ${otherUser.last_name}`
      : otherUser.email || 'Unknown User';

    return {
      displayName,
      avatar_url: otherUser.avatar_url,
    };
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => {
    const otherParticipant = getOtherParticipant(item);
    return (
      <ConversationItem 
        conversation={item} 
        otherParticipant={otherParticipant} 
        onSelect={handleSelectConversation} 
      />
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#b1f03d" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity onPress={onNewChat} style={styles.newChatButton}>
          <Ionicons name="create-outline" size={24} color="#b1f03d" />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={handleRefresh}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : conversations.length > 0 ? (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderConversationItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={["#b1f03d"]} />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No conversations yet.</Text>
          <Text style={styles.emptyText}>Start a new chat to begin messaging.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ConversationsList;