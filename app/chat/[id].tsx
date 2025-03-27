import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ChatScreen from '../components/Chat/ChatScreen';

export default function ConversationScreen() {
  const { id } = useLocalSearchParams();
  const conversationId = Array.isArray(id) ? id[0] : id;

  return (
    <View style={styles.container}>
      <ChatScreen conversationId={conversationId || ''} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 