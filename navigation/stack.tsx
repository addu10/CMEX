import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import SignupScreen from "../app/screens/auth/SignupScreen";
import HomeScreen from "../app/screens/Main/HomeScreen";
import LoginScreen from "../app/screens/auth/LoginScreen";
import { RootStackParamList } from "../types/types";

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
    </Stack.Navigator>
  );
};