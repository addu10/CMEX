import {
  Lexend_400Regular,
  Lexend_600SemiBold,
} from '@expo-google-fonts/lexend';
import { useFonts } from 'expo-font';

export const Fonts = {
  regular: 'Lexend_400Regular',
  semiBold: 'Lexend_600SemiBold',
};

export const fontConfig = {
  Lexend_400Regular,
  Lexend_600SemiBold,
};

export function useAppFonts() {
  const [fontsLoaded] = useFonts(fontConfig);
  return fontsLoaded;
} 