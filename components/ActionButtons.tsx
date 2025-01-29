// components/ActionButtons.tsx
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ActionButtons = () => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
    {[
      { title: 'SELL', icon: 'briefcase' },
      { title: 'BUY', icon: 'cart' },
      { title: 'RENT', icon: 'car' },
    ].map((item, index) => (
      <TouchableOpacity
        key={index}
        style={{
          backgroundColor: '#ebebeb',
          borderRadius: 8,
          padding: 12,
          alignItems: 'center',
          flex: 1,
          marginHorizontal: index === 1 ? 8 : 0,
        }}
      >
        <Ionicons name={item.icon} size={24} color="#000" />
        <Text style={{ color: '#000', marginTop: 8 }}>{item.title}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default ActionButtons;
