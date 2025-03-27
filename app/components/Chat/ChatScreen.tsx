import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  Keyboard,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { chatService } from '@/app/services/chatService';
import { Conversation, Message } from '@/app/types/chat';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';

interface ChatScreenProps {
  conversationId: string;
}

const ChatScreen = ({ conversationId }: ChatScreenProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [otherUser, setOtherUser] = useState<{ name: string; avatar_url?: string } | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const listRef = useRef<FlatList>(null);
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Get current user
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          setCurrentUser(data.user.id);
        }

        // Get conversation details
        const conversationData = await chatService.getConversationById(conversationId);
        setConversation(conversationData);

        // Get other user in conversation
        if (conversationData.participants && conversationData.participants.length > 0) {
          const otherParticipant = data.user ? 
            conversationData.participants.find(p => p.user_id !== data.user.id) :
            conversationData.participants[0];

          if (otherParticipant && otherParticipant.user) {
            const user = otherParticipant.user;
            const userName = user.first_name && user.last_name 
              ? `${user.first_name} ${user.last_name}` 
              : user.email || 'Unknown';
            
            setOtherUser({
              name: userName,
              avatar_url: user.avatar_url
            });
          }
        }

        // Get messages
        const messagesData = await chatService.getMessages(conversationId);
        setMessages(messagesData);

        // Mark messages as read
        await chatService.markMessagesAsRead(conversationId);
      } catch (error) {
        console.error('Error loading chat data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Set up real-time subscription to new messages
    const subscription = chatService.subscribeToMessages(conversationId, (newMsg) => {
      setMessages(prevMessages => {
        // Check if the message is already in the list
        const exists = prevMessages.some(msg => msg.id === newMsg.id);
        if (exists) return prevMessages;
        
        // Mark messages as read if they're from the other user
        if (newMsg.sender_id !== currentUser) {
          chatService.markMessagesAsRead(conversationId);
        }
        
        return [...prevMessages, newMsg];
      });
      
      // Scroll to bottom
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId, currentUser]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && !loading) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: false });
      }, 200);
    }
  }, [messages, loading]);

  // Handle keyboard appearance
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        // Scroll to bottom when keyboard appears
        setTimeout(() => {
          listRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      const trimmedMessage = newMessage.trim();
      setNewMessage('');
      
      // Optimistically add message to list
      const optimisticMsg: Message = {
        id: `temp-${Date.now()}`,
        conversation_id: conversationId,
        sender_id: currentUser || '',
        content: trimmedMessage,
        created_at: new Date().toISOString(),
        read: false
      };
      
      setMessages(prev => [...prev, optimisticMsg]);
      
      // Scroll to bottom
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);

      // Send actual message
      await chatService.sendMessage(conversationId, trimmedMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => !msg.id.startsWith('temp-')));
    } finally {
      setSending(false);
      Keyboard.dismiss();
    }
  };

  const handleBackPress = () => {
    router.back();
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isMyMessage = item.sender_id === currentUser;
    const messageDate = new Date(item.created_at);
    
    // Format time as HH:MM
    let timeString;
    try {
      timeString = format(messageDate, 'h:mm a');
    } catch (error) {
      timeString = 'Unknown time';
    }

    return (
      <View style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessageContainer : styles.theirMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessageBubble : styles.theirMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.theirMessageText
          ]}>
            {item.content}
          </Text>
        </View>
        <Text style={[
          styles.messageTime,
          isMyMessage ? styles.myMessageTime : styles.theirMessageTime
        ]}>
          {timeString}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#b1f03d" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 40}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            {otherUser?.avatar_url && !imageError ? (
              <View style={styles.avatarContainer}>
                <Image 
                  source={{ uri: otherUser.avatar_url }} 
                  style={styles.avatar}
                  onError={() => setImageError(true)}
                  defaultSource={require('../../../assets/images/default-avatar.png')}
                />
              </View>
            ) : (
              <View style={styles.avatarContainer}>
                <View style={[styles.avatar, styles.placeholderAvatar]}>
                  <Text style={styles.avatarLetter}>
                    {otherUser?.name?.[0]?.toUpperCase() || '?'}
                  </Text>
                </View>
              </View>
            )}
            <Text style={styles.userName}>{otherUser?.name || 'Unknown'}</Text>
          </View>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={[
            styles.messagesList,
            messages.length === 0 && styles.emptyMessagesList
          ]}
          onLayout={() => {
            if (messages.length > 0) {
              listRef.current?.scrollToEnd({ animated: false });
            }
          }}
          ListEmptyComponent={
            <View style={styles.emptyMessagesContainer}>
              <Ionicons name="chatbubble-ellipses-outline" size={64} color="#ccc" />
              <Text style={styles.emptyMessagesText}>No messages yet</Text>
              <Text style={styles.emptyMessagesSubtext}>Start the conversation by sending a message</Text>
            </View>
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !newMessage.trim() || sending ? styles.sendButtonDisabled : null
            ]}
            onPress={handleSend}
            disabled={!newMessage.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Ionicons name="send" size={20} color={!newMessage.trim() ? '#aaa' : '#000'} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    height: 60,
  },
  backButton: {
    padding: 8,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  placeholderAvatar: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
  },
  theirMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  myMessageBubble: {
    backgroundColor: '#b1f03d',
  },
  theirMessageBubble: {
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#000',
  },
  theirMessageText: {
    color: '#000',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 2,
  },
  myMessageTime: {
    color: '#666',
    alignSelf: 'flex-end',
  },
  theirMessageTime: {
    color: '#666',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 120,
  },
  sendButton: {
    backgroundColor: '#b1f03d',
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  emptyMessagesList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessagesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyMessagesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyMessagesSubtext: {
    fontSize: 14,
    color: '#666',
  },
});

export default ChatScreen; 