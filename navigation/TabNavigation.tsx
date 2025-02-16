import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  GestureResponderEvent,
} from "react-native";
import Svg, { Path } from "react-native-svg";

import SignupScreen from "../app/screens/auth/SignupScreen";
import HomeScreen from "../app/screens/Main/HomeScreen";
import LoginScreen from "../app/screens/auth/LoginScreen";
import SearchScreen from "../app/screens/Main/ExploreScreen";
import WishlistScreen from "../app/screens/Main/SavedScreen";
import ProfileScreen from "../app/screens/Main/ProfileScreen";
import SellScreen from "../app/screens/Main/SellPageScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({
  onPress,
}: {
  onPress?: (event: GestureResponderEvent) => void;
}) => (
  <TouchableOpacity style={styles.sellButton} onPress={onPress}>
    <FontAwesome5 name="plus" size={24} color="white" />
  </TouchableOpacity>
);

const CurvedTabBarBackground = () => {
  return (
    <View style={styles.svgContainer}>
      <Svg width={75} height={61} viewBox="0 0 75 61">
        <Path
          d="M0 0h75v30c-15 15-45 15-75 0V0z"
          fill="#000"
        />
      </Svg>
    </View>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarBackground: () => <CurvedTabBarBackground />, // Add curved background
        tabBarIcon: ({ focused }) => {
          let iconName: any;
          let color = focused ? "#D7F2A5" : "white";

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Search":
              iconName = "search";
              break;
            case "Wishlist":
              iconName = "heart";
              break;
            case "Profile":
              iconName = "person";
              break;
          }

          return <Ionicons name={iconName} size={24} color={color} />;
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

// ✅ HomeStack should NOT have NavigationContainer!
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
    backgroundColor: "transparent",
    borderTopWidth: 0,
    height: 80,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  svgContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "#000",
  },
  sellButton: {
    backgroundColor: "#D7F2A5",
    borderRadius: 35,
    height: 70,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 25, // Adjusted to match the first layout
    alignSelf: "center",
  },
});