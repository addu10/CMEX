import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import HomeScreen from '@/app/screens/Main/HomeScreen';
import ProfileScreen from '@/app/screens/Main/ProfileScreen';
import SellPageScreen from '@/app/screens/Main/SellPageScreen';
import SavedScreen from '@/app/screens/Main/SavedScreen';
import ExploreScreen from '@/app/screens/Main/ExploreScreen';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#d7f2a5',
                tabBarStyle: {
                    backgroundColor: '#000', // Background color of the tab bar
                    borderTopWidth: 0, // Remove the top border
                    position: 'absolute', // Positioning
                    height: 60, // Height of the tab bar
                    bottom: 20,
                    borderRadius: 25,
                    paddingBottom: 10,
                },
                tabBarItemStyle: {
                    height: 60, // Ensures tab items have enough space
                    justifyContent: 'center', // Centers icon vertically
                    alignItems: 'center', // Centers icon horizontally
                  },
                  tabBarIconStyle: {
                    marginBottom: 0, // Removes any unnecessary bottom margin
                  },
                  tabBarLabelStyle: {
                    fontSize: 12, // Adjust font size if needed
                    marginBottom: 5, // Moves the label up slightly
                  },
            }}
        >
            <Tab.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home', // Use tabBarLabel for the text
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="home" size={size} color={color} /> // Only the icon
                    ),
                }}
            />
            <Tab.Screen
                name="ExploreScreen"
                component={ExploreScreen}
                options={{
                    tabBarLabel: 'Explore', // Use tabBarLabel for the text
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="search1" size={size} color={color} /> // Only the icon
                    ),
                }}
            />
            <Tab.Screen
                name="SellPageScreen"
                component={SellPageScreen}
                options={{
                    tabBarLabel: 'Sell', // Use tabBarLabel for the text
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="add-circle-outline" size={size} color={color} /> // Only the icon
                    ),
                }}
            />
            <Tab.Screen
                name="SavedScreen"
                component={SavedScreen}
                options={{
                    tabBarLabel: 'Wishlist', // Use tabBarLabel for the text
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="heart" size={size} color={color} /> // Only the icon
                    ),
                }}
            />
            <Tab.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile', // Use tabBarLabel for the text
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="profile" size={size} color={color} /> // Only the icon
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

// Styles for the tab items
const styles = StyleSheet.create({
    tabItem: {
        backgroundColor: '#d7f2a5', // Background color for the tab item
        borderRadius: 10, // Curved borders
        paddingVertical: 10, // Adjusted vertical padding
        paddingHorizontal: 15, // Adjusted horizontal padding
        flexDirection: 'row', // Align items side by side
        alignItems: 'center', // Center the icon and text vertically
        justifyContent: 'center', // Center the icon and text horizontally
        marginHorizontal: 5, // Space between tabs
    },
    tabLabel: {
        color: 'black', // Text color
        marginLeft: 5, // Space between icon and text
        fontSize: 14, // Adjusted font size for better fit
    },
});