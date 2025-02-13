import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { globalStyles } from '../theme/styles';

interface InputFieldProps {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  style?: object; // Add this line to accept custom styles
}

const InputField: React.FC<InputFieldProps> = ({ 
  value, 
  placeholder, 
  onChangeText, 
  secureTextEntry, 
  keyboardType, 
  style // Destructure the style prop
}) => (
  <TextInput
    style={[globalStyles.input, style]} // Combine global styles with custom styles
    value={value}
    placeholder={placeholder}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    keyboardType={keyboardType}
  />
);

export default InputField;