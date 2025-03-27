import { useRouter, useSegments } from 'expo-router';

export const navigateToChat = (router: ReturnType<typeof useRouter>, id: string) => {
  // Cast to any to work around the type issues
  (router as any).push(`/chat/${id}`);
};

export const navigateToConversation = (router: ReturnType<typeof useRouter>, conversationId: string) => {
  // Cast to any to work around the type issues
  (router as any).push(`/chat/${conversationId}`);
}; 