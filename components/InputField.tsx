import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { globalStyles } from '../theme/styles';

interface InputFieldProps {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}

const InputField: React.FC<InputFieldProps> = ({ value, placeholder, onChangeText, secureTextEntry, keyboardType }) => (
  <TextInput
    style={globalStyles.input}
    value={value}
    placeholder={placeholder}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    keyboardType={keyboardType}
  />
);

export default InputField;
