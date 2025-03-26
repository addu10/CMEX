import React, { useState, useRef, useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { supabase } from '../lib/supabase';

// Hide splash screen on app load
SplashScreen.hideAsync().catch(error => {
  console.log("Failed to hide splash screen:", error);
});

// Context for tracking authentication state
export const AuthContext = React.createContext<{
  isAuthenticated: boolean | null;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
}>({
  isAuthenticated: null,
  setIsAuthenticated: () => null,
});

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const segments = useSegments();
  const router = useRouter();
  const initialRoute = useRef(true);

  useEffect(() => {
    // Listen for auth state changes
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Auth Debug] Auth state changed:', event, session ? 'Session exists' : 'No session');
      setIsAuthenticated(!!session);
    });

    // Initial session check
    checkSession();

    // Cleanup subscription
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  async function checkSession() {
    try {
      console.log('[Layout Debug] Checking session...');
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('[Layout Debug] Session check error:', error);
        setIsAuthenticated(false);
        return;
      }
      
      console.log('[Layout Debug] Session found:', !!data.session);
      setIsAuthenticated(!!data.session);
    } catch (error) {
      console.error('[Layout Debug] Session check exception:', error);
      setIsAuthenticated(false);
    }
  }

  // Handle navigation based on auth state
  useEffect(() => {
    if (isAuthenticated === null) {
      return; // Still loading
    }

    // Get the current route group (auth or main)
    const inAuthGroup = segments[0] === '(auth)';
    console.log('[Layout Debug] Auth state:', isAuthenticated, 'Current route:', segments.join('/'));

    // Prevent navigation on first render
    if (initialRoute.current) {
      initialRoute.current = false;
      return;
    }

    // Handle navigation
    if (!isAuthenticated && !inAuthGroup) {
      console.log('[Layout Debug] Not authenticated, redirecting to auth...');
      router.replace('/(auth)');
    } else if (isAuthenticated && inAuthGroup) {
      console.log('[Layout Debug] Authenticated, redirecting to main tabs...');
      router.replace('/');
    }
  }, [isAuthenticated, segments]);

  // Show loading screen while checking auth state
  if (isAuthenticated === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Auth Group */}
        <Stack.Screen
          name="(auth)"
          redirect={isAuthenticated}
        />

        {/* Use Slot for the main app navigation */}
        <Stack.Screen
          name="index"
          redirect={!isAuthenticated}
        />
        <Stack.Screen
          name="explore"
          redirect={!isAuthenticated}
        />
        <Stack.Screen
          name="saved"
          redirect={!isAuthenticated}
        />
        <Stack.Screen
          name="sell"
          redirect={!isAuthenticated}
        />
        <Stack.Screen
          name="profile"
          redirect={!isAuthenticated}
        />
        
        {/* User profile section routes */}
        <Stack.Screen
          name="user"
          redirect={!isAuthenticated}
        />
        <Stack.Screen
          name="user/edit-profile"
          redirect={!isAuthenticated}
        />
        <Stack.Screen
          name="user/my-listings"
          redirect={!isAuthenticated}
        />
        <Stack.Screen
          name="user/change-password"
          redirect={!isAuthenticated}
        />
        <Stack.Screen
          name="user/order-history"
          redirect={!isAuthenticated}
        />
        <Stack.Screen
          name="user/help-support"
          redirect={!isAuthenticated}
        />
        <Stack.Screen
          name="user/terms-conditions"
          redirect={!isAuthenticated}
        />
        <Stack.Screen
          name="user/delete-account"
          redirect={!isAuthenticated}
        />
      </Stack>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
