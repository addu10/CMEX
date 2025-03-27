export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  participants?: ConversationParticipant[];
  last_message?: Message;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  created_at: string;
  user?: {
    id: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender?: {
    id: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

export interface ChatUserInfo {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar_url?: string;
} 