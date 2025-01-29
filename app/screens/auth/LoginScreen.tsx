import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import LoginForm from '../../../components/LoginForm'; // Importing the LoginForm component
import Footer from '../../../components/Footer'; // Importing Footer component
import Logo from '../../../components/Logo'
import { globalStyles } from '../../../theme/styles';


const LoginScreen = () => {
  return (
    <ScrollView contentContainerStyle={globalStyles.container}>
      <Logo />
      <Text style={globalStyles.title}>Welcome to C-MEX!</Text>
      <Text style={globalStyles.subtitle}>Buy, Sell, Rent—All in One Place</Text>
      <LoginForm />
      
      <Footer />
    </ScrollView>
  );
};

export default LoginScreen;
