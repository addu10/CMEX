# Chat Routes

## Current Structure
```
chat/
├── index.tsx          # Chat list/conversations screen
└── [id].tsx          # Dynamic chat room screen
```

## Route Definitions

### Dynamic Routes
The `[id].tsx` file creates dynamic routes for individual chat rooms:
```typescript
// Access chat ID in component
const { id } = useLocalSearchParams();
```

### Routes
- `/chat` - List of all conversations
- `/chat/[id]` - Individual chat room (e.g., `/chat/123`)

## Usage
```typescript
// Navigate to chat list
router.push('/chat');

// Navigate to specific chat
router.push(`/chat/${conversationId}`);

// Navigate with additional params
router.push({
  pathname: `/chat/${conversationId}`,
  params: { title: 'Chat Title' }
});
```

## Future Considerations

### Potential Additional Routes
1. `/chat/new`
   - New conversation screen
   - User search and selection

2. `/chat/[id]/info`
   - Chat details/settings
   - Participant management

3. `/chat/[id]/media`
   - Shared media gallery
   - File attachments view

4. `/chat/archived`
   - Archived conversations
   - Chat history

### Feature Enhancements
1. **Group Chats**
   - Support for multiple participants
   - Group management features

2. **Media Sharing**
   - Image/file sharing
   - Media preview

3. **Chat Features**
   - Message reactions
   - Message threading
   - Read receipts
   - Typing indicators

### Best Practices
- Implement real-time updates using Supabase subscriptions
- Handle offline message queuing
- Implement message pagination
- Cache chat history locally
- Handle media upload/download efficiently
- Implement proper error handling for network issues 