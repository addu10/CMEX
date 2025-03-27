-- Function to find a conversation between two users
CREATE OR REPLACE FUNCTION find_conversation_between_users(user1_id UUID, user2_id UUID)
RETURNS UUID
LANGUAGE SQL
AS $$
  SELECT c.id
  FROM conversations c
  JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
  JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
  WHERE cp1.user_id = user1_id AND cp2.user_id = user2_id
  LIMIT 1;
$$; 