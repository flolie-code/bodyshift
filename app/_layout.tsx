import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const scheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="recipe/[slug]" options={{ presentation: 'card' }} />
        <Stack.Screen name="wochenkonto" options={{ presentation: 'card' }} />
        <Stack.Screen name="fortschritt" options={{ presentation: 'card' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
