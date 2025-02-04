import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import Header from '@/components/Header';



export function ExploreScreen() {
 

  return (
    <View  style={{ flex: 1, backgroundColor: '#f6f6f6', padding: 16 }}>
      <Header />
      <ScrollView>
        
      </ScrollView>
    </View>
  );
}

export default ExploreScreen;