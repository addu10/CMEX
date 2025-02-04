import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';

const SearchBar = () => {

  return (
    <View style={{  padding: 5, backgroundColor: 'white', borderRadius: 40, alignItems:'center', flexDirection:'row'}}>
        <Octicons name="search" size={24} color="black" style={{marginLeft: 10}}/>
        <TextInput placeholder='Search' style={{ flex:1, marginLeft:10, height:40  }} /> 
    </View>
  );
};
export default SearchBar;
