import React, { useState } from 'react';
import { Text, StyleSheet, Pressable, Animated, View } from 'react-native';

interface ButtonProps {
  title?: string;
  onPress: () => Promise<boolean>; // Returns true if successful, false otherwise
}

const Button: React.FC<ButtonProps> = ({ title = "Post", onPress }) => {
  const [animatedValue] = useState(new Animated.Value(0));
  const [buttonText, setButtonText] = useState(title);
  const [disabled, setDisabled] = useState(false);

  const handlePressIn = async () => {
    if (disabled) return;

    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();

    setDisabled(true);
    const success = await onPress();

    if (success) {
      setButtonText("Submitted");
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start(() => setDisabled(false)); // Reset animation and re-enable button
    }
  };

  const fillWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'], // Smooth fill effect from left to right
  });

  return (
    <Pressable onPressIn={handlePressIn} style={styles.buttonContainer} disabled={disabled}>
      <View style={styles.button}>
        <Animated.View style={[styles.fill, { width: fillWidth }]} />
        <Text style={styles.text}>{buttonText}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    overflow: 'hidden',
    borderRadius: 10,
    padding: 5,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderWidth: 3,
    borderColor: '#b1f03d', // Green border
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#b1f03d',
    width: '0%',
    height: '100%',
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black', // Ensure text is always visible
    textAlign: 'center',
    zIndex: 1, // Keep text above animation
  },
});

export default Button;
