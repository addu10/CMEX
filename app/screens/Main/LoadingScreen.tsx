import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence } from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

export default function LoadingScreen({ navigation }: any) {
  const greenRotation = useSharedValue(0);
  const blackRotation = useSharedValue(0);
  const arrowX = useSharedValue(50);
  const arrowY = useSharedValue(50);
  const [showShortName, setShowShortName] = useState(false);

  useEffect(() => {
    // Rotations
    greenRotation.value = withRepeat(withTiming(360, { duration: 3000 }), -1);
    blackRotation.value = withRepeat(withTiming(-360, { duration: 3000 }), -1);

    // Random arrow movement
    const interval = setInterval(() => {
      arrowX.value = Math.random() * 200;
      arrowY.value = Math.random() * 200;
    }, 500);

    // After 3s, move arrow to final position
    setTimeout(() => {
      clearInterval(interval);
      arrowX.value = withTiming(100, { duration: 1000 });
      arrowY.value = withTiming(100, { duration: 1000 });

      // After 1s, show CMEX
      setTimeout(() => {
        setShowShortName(true);
      }, 1000);
      
      // Navigate to MainApp after animation completes
      setTimeout(() => {
        navigation.replace("MainApp");
      }, 2000);
    }, 3000);
  }, []);

  const greenStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${greenRotation.value}deg` }],
  }));

  const blackStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${blackRotation.value}deg` }],
  }));

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: arrowX.value }, { translateY: arrowY.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Animated.View style={[styles.greenCircle, greenStyle]}>
          <Svg width="150" height="150" viewBox="0 0 200 200">
            <Circle cx="100" cy="100" r="90" stroke="#7BEA4F" strokeWidth="10" fill="none" />
          </Svg>
        </Animated.View>

        <Animated.View style={[styles.blackCircle, blackStyle]}>
          <Svg width="150" height="150" viewBox="0 0 200 200">
            <Circle cx="100" cy="100" r="70" stroke="black" strokeWidth="10" fill="none" />
          </Svg>
        </Animated.View>

        <Animated.View style={[styles.arrow, arrowStyle]}>
          <Svg width="50" height="50" viewBox="0 0 100 100">
            <Path d="M10 50 L50 10 L50 30 L90 30 L90 70 L50 70 L50 90 Z" fill="#7BEA4F" />
          </Svg>
        </Animated.View>
      </View>

      <Text style={styles.text}>{showShortName ? "CMEX" : "Cusat Market Exchange"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logoContainer: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  greenCircle: {
    position: "absolute",
  },
  blackCircle: {
    position: "absolute",
  },
  arrow: {
    position: "absolute",
  },
  text: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
});
