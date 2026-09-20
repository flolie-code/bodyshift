import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/hooks/useTheme';
import { fonts, radius, spacing } from '@/constants/theme';

export default function ProfileScreen() {
  const { colors } = useTheme();

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Fehler beim Abmelden', error.message);
      return;
    }
    router.replace('/(auth)/login');
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.ink }]}>Profil</Text>
        <Text style={[styles.sub, { color: colors.inkSoft }]}>
          Behandlungs-Termine, Ziele, Coach-Chat, Apple Health — kommt als nächstes.
        </Text>

        <Pressable
          style={[styles.btn, { backgroundColor: colors.surface }]}
          onPress={signOut}
        >
          <Text style={[styles.btnText, { color: colors.protein }]}>Abmelden</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', gap: spacing.xl },
  title: { fontFamily: fonts.serifMedium, fontSize: 28 },
  sub: { fontFamily: fonts.sans, fontSize: 14, textAlign: 'center' },
  btn: {
    paddingHorizontal: 28, paddingVertical: 14, borderRadius: radius.md,
  },
  btnText: { fontFamily: fonts.sansBold, fontSize: 14, fontWeight: '600' },
});
