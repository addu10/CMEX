import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity, StyleSheet, View, GestureResponderEvent } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

import SignupScreen from "../app/screens/auth/SignupScreen";
import HomeScreen from "../app/screens/Main/HomeScreen";
import LoginScreen from "../app/screens/auth/LoginScreen";
import SearchScreen from "../app/screens/Main/ExploreScreen";
import WishlistScreen from "../app/screens/Main/SavedScreen";
import ProfileScreen from "../app/screens/Main/ProfileScreen";
import SellScreen from "../app/screens/Main/SellPageScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Floating "+" Button
const CustomTabBarButton = ({ onPress }: { onPress?: (event: GestureResponderEvent) => void }) => (
  <TouchableOpacity style={styles.sellButton} onPress={onPress}>
    <FontAwesome5 name="plus" size={24} color="black" />
  </TouchableOpacity>
);

// Curved Bottom Bar Background
const CurvedTabBarBackground = () => {
  return (
    <View style={styles.svgContainer}>
      <Svg width={250} height={70} viewBox="0 0 250 70">
        <Path
          d="M0 80 L0 0 Q125 60, 250 0 L250 80 Z"
          fill="black"
        />
        <Path d="M18  0 Q65 52, 110  0 Z" fill="#f6f6f6" />
      </Svg>
    </View>
  );
};

// Bottom Navigation Bar
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarBackground: () => <CurvedTabBarBackground />,
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
        component={SellScreen}
        options={{
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Stack Navigator
export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
    </Stack.Navigator>
  );
}

// Styles
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
    bottom:-10, // 
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

