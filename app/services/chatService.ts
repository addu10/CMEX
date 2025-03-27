import { supabase } from '@/lib/supabase';
import { Conversation, Message, ConversationParticipant, ChatUserInfo } from '../types/chat';

class ChatService {
  /**
   * Get all conversations for the current user
   */
  async getConversations(): Promise<Conversation[]> {
    try {
      // Get current user
      const { data, error: userError } = await supabase.auth.getUser();
      
      // Return empty conversations if no user or error
      if (userError || !data?.user) {
        console.log('User not authenticated, returning empty conversations');
        return [];
      }
      
      const user = data.user;

      // First get user's conversation IDs
      const { data: userConversations, error: conversationsError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (conversationsError) {
        console.warn('Error fetching conversation participants:', conversationsError);
        return [];
      }
      
      if (!userConversations?.length) return [];
      
      const conversationIds = userConversations.map(uc => uc.conversation_id);
      
      // Then get all conversations with these IDs
      const { data: conversations, error: conversationDetailsError } = await supabase
        .from('conversations')
        .select('*')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });

      if (conversationDetailsError) throw conversationDetailsError;
      if (!conversations?.length) return [];
      
      // Get participants for all conversations
      const { data: participants, error: participantsError } = await supabase
        .from('conversation_participants')
        .select('id, user_id, conversation_id')
        .in('conversation_id', conversationIds);
        
      if (participantsError) throw participantsError;
      
      // Get all user IDs from participants
      const userIds = participants?.map(p => p.user_id) || [];
      
      // Get user details
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, email, first_name, last_name')
        .in('id', userIds);
        
      if (usersError) throw usersError;
      
      // Combine the data
      const conversationsWithParticipants = conversations.map(conversation => {
        // Find participants for this conversation
        const conversationParticipants = participants?.filter(
          p => p.conversation_id === conversation.id
        ).map(participant => {
          // Find user for this participant
          const participantUser = users?.find(u => u.id === participant.user_id);
          
          // Add avatar URL
          let avatar_url = null;
          if (participantUser) {
            avatar_url = supabase.storage.from('avatars').getPublicUrl(`${participantUser.id}/avatar`).data.publicUrl;
          }
          
          return {
            ...participant,
            user: participantUser ? {
              ...participantUser,
              avatar_url
            } : undefined
          };
        });
        
        return {
          ...conversation,
          participants: conversationParticipants
        };
      });
      
      // Get the last message for each conversation for preview
      const conversationsWithLastMessage = await Promise.all(
        conversationsWithParticipants.map(async (conversation) => {
          const { data: lastMessage, error: lastMessageError } = await supabase
            .from('messages')
            .select('id, content, created_at, sender_id, read')
            .eq('conversation_id', conversation.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          if (lastMessageError && lastMessageError.code !== 'PGRST116') {
            console.error('Error fetching last message:', lastMessageError);
          }
          
          // Add sender info if we have a last message
          let messageWithSender = lastMessage;
          if (lastMessage) {
            // Find sender info
            const sender = users?.find(u => u.id === lastMessage.sender_id);
            if (sender) {
              const avatar_url = supabase.storage.from('avatars').getPublicUrl(`${sender.id}/avatar`).data.publicUrl;
              messageWithSender = {
                ...lastMessage,
                sender: {
                  ...sender,
                  avatar_url
                }
              } as Message;
            }
          }
          
          return {
            ...conversation,
            last_message: messageWithSender || undefined
          };
        })
      );
      
      return conversationsWithLastMessage || [];
    } catch (error) {
      console.error('Error in getConversations:', error);
      throw error;
    }
  }

  /**
   * Get messages for a specific conversation
   */
  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      // Get current user to verify authentication
      const { data, error: userError } = await supabase.auth.getUser();
      
      // Return empty messages if no user or error
      if (userError || !data?.user) {
        console.log('User not authenticated, returning empty messages');
        return [];
      }

      // Get messages
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Error fetching messages:', error);
        return [];
      }
      
      if (!messages?.length) return [];
      
      // Get all unique sender IDs
      const senderIds = [...new Set(messages.map(m => m.sender_id))];
      
      // Get senders information
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, first_name, last_name, email')
        .in('id', senderIds);
        
      if (usersError) {
        console.warn('Error fetching user details:', usersError);
        return messages;
      }
      
      // Add sender information to messages
      const messagesWithSenders = messages.map(message => {
        const sender = users?.find(u => u.id === message.sender_id);
        
        if (sender) {
          const avatar_url = supabase.storage.from('avatars').getPublicUrl(`${sender.id}/avatar`).data.publicUrl;
          return {
            ...message,
            sender: {
              ...sender,
              avatar_url
            }
          } as Message;
        }
        
        return message;
      });
      
      return messagesWithSenders;
    } catch (error) {
      console.error('Error in getMessages:', error);
      return []; // Return empty array instead of throwing
    }
  }

  /**
   * Send a message in a conversation
   */
  async sendMessage(conversationId: string, content: string): Promise<Message | null> {
    try {
      // Get current user
      const { data, error: userError } = await supabase.auth.getUser();
      
      // Check for authentication
      if (userError || !data?.user) {
        console.warn('User not authenticated, cannot send message');
        return null;
      }

      const { data: messageData, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: data.user.id,
          content
        })
        .select()
        .single();

      if (error) {
        console.warn('Error sending message:', error);
        return null;
      }
      
      // Update conversation's updated_at timestamp
      try {
        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId);
      } catch (err: unknown) {
        console.warn('Failed to update conversation timestamp:', err);
      }
        
      return messageData;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      return null;
    }
  }

  /**
   * Create a new conversation with a user
   */
  async createConversation(otherUserId: string): Promise<Conversation> {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      // Check if conversation already exists
      const { data: existingParticipants, error: existingError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);
        
      if (existingError) throw existingError;
      
      if (existingParticipants && existingParticipants.length > 0) {
        // Get conversation IDs where current user is a participant
        const currentUserConversationIds = existingParticipants.map(p => p.conversation_id);
        
        // Check if other user is part of any of these conversations
        const { data: otherUserParticipants, error: otherUserError } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', otherUserId)
          .in('conversation_id', currentUserConversationIds);
          
        if (otherUserError) throw otherUserError;
        
        // If we find a conversation with both users, return it
        if (otherUserParticipants && otherUserParticipants.length > 0) {
          return this.getConversationById(otherUserParticipants[0].conversation_id);
        }
      }

      // Create new conversation
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({})
        .select()
        .single();

      if (conversationError) throw conversationError;
      
      // Add participants
      const participants = [
        { conversation_id: conversation.id, user_id: user.id },
        { conversation_id: conversation.id, user_id: otherUserId }
      ];
      
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert(participants);
        
      if (participantsError) throw participantsError;
      
      return this.getConversationById(conversation.id);
    } catch (error) {
      console.error('Error in createConversation:', error);
      throw error;
    }
  }

  /**
   * Get a conversation by ID
   */
  async getConversationById(conversationId: string): Promise<Conversation> {
    try {
      // Get the conversation
      const { data: conversation, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (error) throw error;

      // Get participants
      const { data: participants, error: participantsError } = await supabase
        .from('conversation_participants')
        .select('id, user_id, conversation_id')
        .eq('conversation_id', conversationId);
        
      if (participantsError) throw participantsError;
      
      // Get user details for all participants
      const userIds = participants?.map(p => p.user_id) || [];
      
      if (userIds.length > 0) {
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('id, email, first_name, last_name')
          .in('id', userIds);
          
        if (usersError) throw usersError;
        
        // Combine the data
        const participantsWithUsers = participants.map(participant => {
          const user = users?.find(u => u.id === participant.user_id);
          let avatar_url = null;
          
          if (user) {
            avatar_url = supabase.storage.from('avatars').getPublicUrl(`${user.id}/avatar`).data.publicUrl;
          }
          
          return {
            ...participant,
            user: user ? { ...user, avatar_url } : undefined
          };
        });
        
        return {
          ...conversation,
          participants: participantsWithUsers
        };
      }
      
      return {
        ...conversation,
        participants: []
      };
    } catch (error) {
      console.error('Error in getConversationById:', error);
      throw error;
    }
  }

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(conversationId: string): Promise<void> {
    try {
      // Get current user
      const { data, error: userError } = await supabase.auth.getUser();
      
      // Silently fail if not authenticated
      if (userError || !data?.user) {
        console.log('User not authenticated, skipping markMessagesAsRead');
        return;
      }

      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', data.user.id)
        .eq('read', false);

      if (error) {
        console.warn('Error marking messages as read:', error);
      }
    } catch (error) {
      console.error('Error in markMessagesAsRead:', error);
      // Don't throw, just log
    }
  }

  /**
   * Subscribe to new messages in a conversation
   */
  subscribeToMessages(conversationId: string, callback: (message: Message) => void) {
    try {
      // Basic validation
      if (!conversationId) {
        console.warn('Invalid conversation ID for subscription');
        return { unsubscribe: () => {} };
      }
      
      // First check if user is authenticated
      const subscription = supabase
        .channel(`messages:${conversationId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        }, payload => {
          try {
            callback(payload.new as Message);
          } catch (error) {
            console.error('Error in message subscription callback:', error);
          }
        })
        .subscribe((status) => {
          if (status !== 'SUBSCRIBED') {
            console.warn(`Subscription status: ${status}`);
          }
        });
        
      return {
        unsubscribe: () => {
          try {
            subscription.unsubscribe();
          } catch (error) {
            console.error('Error unsubscribing from channel:', error);
          }
        }
      };
    } catch (error) {
      console.error('Error subscribing to messages:', error);
      // Return a dummy subscription that can be safely "unsubscribed"
      return {
        unsubscribe: () => {}
      };
    }
  }

  /**
   * Search for users to start a conversation
   */
  async searchUsers(query: string): Promise<ChatUserInfo[]> {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('users')
        .select('id, email, first_name, last_name')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
        .neq('id', user.id)
        .limit(10);

      if (error) throw error;

      // Add avatar URLs from storage for each user
      const usersWithAvatars = data?.map(user => {
        const avatarUrl = supabase.storage.from('avatars').getPublicUrl(`${user.id}/avatar`).data.publicUrl;
        return {
          ...user,
          avatar_url: avatarUrl
        };
      }) || [];

      return usersWithAvatars;
    } catch (error) {
      console.error('Error in searchUsers:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const chatService = new ChatService(); 