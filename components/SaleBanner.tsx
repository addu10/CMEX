// components/SaleBanner.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const SaleBanner = () => (
  <View style={{ flexDirection: 'row', marginBottom: 8 }}>
    <View
      style={{
        backgroundColor: '#d7f2a5',
        padding: 16,
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
      }}
    >
      <Text style={{ color: '#000', fontWeight: 'bold' }}>FOR SALE</Text>
      <Text style={{ color: '#000', marginTop: 8 }}>@399</Text>
    </View>
    <View
      style={{
        backgroundColor: '#d7f2a5',
        padding: 16,
        borderRadius: 8,
        flex: 1,
      }}
    >
      <Text style={{ color: '#000', fontWeight: 'bold' }}>CONTINUE SELLING</Text>
    </View>
  </View>
);

export default SaleBanner;
