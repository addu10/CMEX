import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, disabled = false }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button,
        disabled && styles.buttonDisabled
      ]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.buttonText,
        disabled && styles.buttonTextDisabled
      ]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#b1f03d", // Cyan color
    borderRadius: 50, // Rounded button
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
    opacity: 0.7,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonTextDisabled: {
    color: "#666666",
  },
});

export default CustomButton;
