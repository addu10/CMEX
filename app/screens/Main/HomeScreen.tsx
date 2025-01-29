import React from 'react';
import { ScrollView, View } from 'react-native';
import Header from '../../../components/Header';
import ActionButtons from '../../../components/ActionButtons';
import SaleBanner from '../../../components/SaleBanner';
import CategoryList from '../../../components/CategoryList';
import ItemCarousel from '../../../components/ItemCarousel';

const HomeScreen = () => (
  <ScrollView style={{ flex: 1, backgroundColor: '#f6f6f6', padding: 16 }}>
    <Header />
    <ActionButtons />
    <SaleBanner />
    <CategoryList />
    <ItemCarousel />
  </ScrollView>
);

export default HomeScreen;
