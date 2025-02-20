import React from 'react';
import { ScrollView, View } from 'react-native';
import Header from '../../../components/Header';
import ActionButtons from '../../../components/ActionButtons';
import SaleBanner from '../../../components/SaleBanner';
import CategoryList from '../../../components/CategoryList';
import ItemCarousel from '../../../components/ItemCarousel';
import SearchBar from '@/components/SearchBar';

export default function HomeScreen() {
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white', padding: 16 }}>
      <Header />
      <SearchBar />
      <ActionButtons />
      <SaleBanner />
      <CategoryList />
      <ItemCarousel />
    </ScrollView>
  );
}
