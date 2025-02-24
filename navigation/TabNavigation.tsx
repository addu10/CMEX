import React, { useState, useEffect, useRef } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity, StyleSheet, View, GestureResponderEvent, Animated } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigationState } from "@react-navigation/native";

import SignupScreen from "../app/screens/auth/SignupScreen";
import HomeScreen from "../app/screens/Main/HomeScreen";
import LoginScreen from "../app/screens/auth/LoginScreen";
import SearchScreen from "../app/screens/Main/ExploreScreen";
import WishlistScreen from "../app/screens/Main/SavedScreen";
import ProfileScreen from "../app/screens/Main/ProfileScreen";
import SellPageScreen from "../app/screens/Main/SellPageScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ onPress, setSvgVisible }: { onPress?: (event: GestureResponderEvent) => void, setSvgVisible: (visible: boolean) => void }) => {
  const buttonAnim = useRef(new Animated.Value(1)).current; // Button starts visible
  const currentRoute = useNavigationState((state) => state.routes[state.index]?.name);

  useEffect(() => {
    if (currentRoute !== "Sell") {
      // SVG appears first, then the button
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 300,
        delay: 200, // Small delay for staggered effect
        useNativeDriver: true,
      }).start();
      setSvgVisible(true);
    }
  }, [currentRoute]);

  const handlePress = (event: GestureResponderEvent) => {
    if (onPress) onPress(event);

    // SVG disappears first, then the button
    setSvgVisible(false);
    setTimeout(() => {
      Animated.timing(buttonAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 200); // Delay hiding the button after SVG
  };

  return (
    <Animated.View style={[styles.sellButton, { opacity: buttonAnim }]}>
      <TouchableOpacity onPress={handlePress}>
        <FontAwesome5 name="plus" size={24} color="black" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const CurvedTabBarBackground = ({ isVisible }: { isVisible: boolean }) => {
  const svgAnim = useRef(new Animated.Value(isVisible ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(svgAnim, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  return (
    <Animated.View style={[styles.svgContainer, { opacity: svgAnim }]}>
      <Svg width={250} height={70} viewBox="0 0 250 70">
        <Path d="M0 80 L0 0 Q125 60, 250 0 L250 80 Z" fill="black" />
        <Path d="M18  0 Q65 52, 110  0 Z" fill="#f6f6f6" />
      </Svg>
    </Animated.View>
  );
};

const BottomTabNavigator = () => {
  const [svgVisible, setSvgVisible] = useState(true);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarBackground: () => <CurvedTabBarBackground isVisible={svgVisible} />,
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          let iconName;
          let color = focused ? "#d7f2a5" : "white";

          switch (route.name) {
            case "Home":
              iconName = <Ionicons name="home" size={24} color={color} />;
              break;
            case "Search":
              iconName = <Ionicons name="search" size={24} color={color} />;
              break;
            case "Wishlist":
              iconName = <Ionicons name="heart" size={24} color={color} />;
              break;
            case "Profile":
              iconName = <Ionicons name="person" size={24} color={color} />;
              break;
          }

          return iconName;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen
        name="Sell"
        component={SellPageScreen}
        options={{
          tabBarButton: (props) => <CustomTabBarButton {...props} setSvgVisible={setSvgVisible} />,
        }}
      />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "black",
    borderTopWidth: 0,
    height: 70,
    position: "absolute",
    bottom: -10, 
    left: '35%',
    right: '35%',
    elevation: 6,
    borderTopLeftRadius: 15,  
    borderTopRightRadius: 15,
    overflow: "visible",
  },
  svgContainer: {
    position: "absolute",
    bottom: -10, 
    left: '35%',
    right: '35%',
    height: 80,
    backgroundColor: "transparent",
  },
  sellButton: {
    backgroundColor: "#d7f2a5",
    borderRadius: 35,
    height: 70,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 53, 
    alignSelf: "center",
    elevation: 10,
  },
});
