import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from 'react-native';
import { initReminders } from '@/lib/reminders';

export default function RootLayout() {
  const scheme = useColorScheme();

  useEffect(() => {
    // Notification-Handler + geplante Reminders reaktivieren beim App-Start
    initReminders().catch(() => {
      // Berechtigung noch nicht erteilt oder Fehler — kein Blocker
    });
  }, []);

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
        <Stack.Screen name="ki-foto" options={{ presentation: 'modal' }} />
        <Stack.Screen name="workout/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="einstellungen" options={{ presentation: 'card' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
