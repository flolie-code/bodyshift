import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/hooks/useTheme';
import { fonts, radius, spacing } from '@/constants/theme';

export default function LoginScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert('Anmeldung fehlgeschlagen', error.message);
      return;
    }
    router.replace('/(tabs)');
  }

  return (
    <LinearGradient
      colors={[colors.brand, '#0f2f33']}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}
        >
          <View style={styles.brand}>
            <Text style={[styles.logoWord, { color: colors.brandInk }]}>
              BODY<Text style={{ color: colors.accent }}>SHIFT</Text>
            </Text>
            <Text style={[styles.logoSub, { color: colors.brandInk + 'B3' }]}>
              KÖRPER NEU DENKEN
            </Text>
          </View>

          <View style={styles.taglineBlock}>
            <Text style={[styles.tagline, { color: colors.brandInk }]}>
              Dein Weg zum{' '}
              <Text style={{ color: colors.accent, fontStyle: 'italic' }}>Wunschgewicht</Text>{' '}
              — wissenschaftlich, alltagstauglich.
            </Text>
          </View>

          <View style={styles.ctaStack}>
            {showForm ? (
              <>
                <TextInput
                  style={[styles.input, { color: colors.brandInk, borderColor: colors.brandInk + '40' }]}
                  placeholder="Email"
                  placeholderTextColor={colors.brandInk + '80'}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />
                <TextInput
                  style={[styles.input, { color: colors.brandInk, borderColor: colors.brandInk + '40' }]}
                  placeholder="Passwort"
                  placeholderTextColor={colors.brandInk + '80'}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                />
                <Pressable
                  style={[styles.btn, { backgroundColor: colors.brandInk }]}
                  onPress={signIn}
                  disabled={loading}
                >
                  <Text style={[styles.btnText, { color: colors.brand }]}>
                    {loading ? 'Anmelden...' : 'Einloggen'}
                  </Text>
                </Pressable>
              </>
            ) : (
              <Pressable
                style={[styles.btn, { backgroundColor: colors.brandInk }]}
                onPress={() => setShowForm(true)}
              >
                <Text style={[styles.btnText, { color: colors.brand }]}>Einloggen</Text>
              </Pressable>
            )}

            <Pressable style={[styles.btnGhost, { borderColor: colors.brandInk + '40' }]}>
              <Text style={[styles.btnText, { color: colors.brandInk }]}>
                Konto aktivieren mit Code
              </Text>
            </Pressable>

            <Text style={[styles.foot, { color: colors.brandInk + '99' }]}>
              Nur für BodyShift-Kunden. Noch keinen Termin? Termin buchen
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingBottom: 34,
    alignItems: 'center',
  },
  brand: {
    marginTop: '26%',
    alignItems: 'center',
  },
  logoWord: {
    fontFamily: fonts.serifMedium,
    fontSize: 38,
    letterSpacing: 6,
  },
  logoSub: {
    fontFamily: fonts.sans,
    fontSize: 11.5,
    letterSpacing: 4,
    marginTop: 18,
  },
  taglineBlock: {
    marginTop: 'auto',
    marginBottom: 28,
  },
  tagline: {
    fontFamily: fonts.serif,
    fontSize: 22,
    textAlign: 'center',
    lineHeight: 28,
  },
  ctaStack: {
    width: '100%',
    gap: spacing.md,
  },
  input: {
    fontFamily: fonts.sans,
    fontSize: 15,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  btn: {
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
  },
  btnGhost: {
    paddingVertical: 15,
    borderRadius: 100,
    borderWidth: 1,
    alignItems: 'center',
  },
  btnText: {
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '600',
  },
  foot: {
    fontFamily: fonts.sans,
    fontSize: 11.5,
    textAlign: 'center',
    marginTop: 8,
  },
});
