// components/ItemCarousel.tsx
import React from 'react';
import { ScrollView, Image } from 'react-native';

const ItemCarousel = () => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {['https://via.placeholder.com/100', 'https://via.placeholder.com/100', 'https://via.placeholder.com/100'].map(
      (uri, index) => (
        <Image
          key={index}
          source={{ uri }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 8,
            marginRight: 8,
          }}
        />
      )
    )}
  </ScrollView>
);

export default ItemCarousel;
