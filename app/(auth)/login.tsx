import { useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/hooks/useTheme';
import { fonts, radius, spacing } from '@/constants/theme';

type Mode = 'signin' | 'signup';

export default function LoginScreen() {
  const { colors } = useTheme();
  const [mode, setMode] = useState<Mode>('signin');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const scrollToForm = () => {
    // Auf Tastatur-Fokus: Form ans Ende der ScrollView scrollen,
    // damit die Felder ueber der Tastatur sichtbar bleiben.
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  async function submit() {
    setLoading(true);
    try {
      if (mode === 'signup') {
        if (!firstName.trim() || !lastName.trim()) {
          throw new Error('Bitte Vor- und Nachnamen angeben.');
        }
        if (password.length < 8) {
          throw new Error('Passwort muss mindestens 8 Zeichen haben.');
        }
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { first_name: firstName.trim(), last_name: lastName.trim() },
          },
        });
        if (error) throw error;
        if (!data.session) {
          Alert.alert(
            'Fast fertig!',
            'Bitte prüfe deine Email und bestätige den Link, dann kannst du loslegen.'
          );
          setLoading(false);
          return;
        }
        router.replace('/(auth)/onboarding');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        router.replace('/(tabs)');
      }
    } catch (err) {
      Alert.alert(mode === 'signup' ? 'Registrierung fehlgeschlagen' : 'Anmeldung fehlgeschlagen', (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={[colors.brand, '#0f2f33']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          style={{ flex: 1 }}
        >
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={[styles.container, showForm && styles.containerForm]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.topBlock, showForm && styles.topBlockForm]}>
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
            </View>

            <View style={styles.ctaStack}>
              {showForm ? (
                <>
                  <View style={styles.tabRow}>
                    <TabButton
                      label="Anmelden"
                      active={mode === 'signin'}
                      onPress={() => setMode('signin')}
                      colors={colors}
                    />
                    <TabButton
                      label="Neu registrieren"
                      active={mode === 'signup'}
                      onPress={() => setMode('signup')}
                      colors={colors}
                    />
                  </View>

                  {mode === 'signup' && (
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <TextInput
                        style={[styles.input, { flex: 1, color: colors.brandInk, borderColor: colors.brandInk + '40' }]}
                        placeholder="Vorname"
                        placeholderTextColor={colors.brandInk + '80'}
                        value={firstName}
                        onChangeText={setFirstName}
                        onFocus={scrollToForm}
                        autoCapitalize="words"
                      />
                      <TextInput
                        style={[styles.input, { flex: 1, color: colors.brandInk, borderColor: colors.brandInk + '40' }]}
                        placeholder="Nachname"
                        placeholderTextColor={colors.brandInk + '80'}
                        value={lastName}
                        onChangeText={setLastName}
                        onFocus={scrollToForm}
                        autoCapitalize="words"
                      />
                    </View>
                  )}
                  <TextInput
                    style={[styles.input, { color: colors.brandInk, borderColor: colors.brandInk + '40' }]}
                    placeholder="Email"
                    placeholderTextColor={colors.brandInk + '80'}
                    value={email}
                    onChangeText={setEmail}
                    onFocus={scrollToForm}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                  />
                  <TextInput
                    style={[styles.input, { color: colors.brandInk, borderColor: colors.brandInk + '40' }]}
                    placeholder={mode === 'signup' ? 'Passwort (min. 8 Zeichen)' : 'Passwort'}
                    placeholderTextColor={colors.brandInk + '80'}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={scrollToForm}
                    secureTextEntry
                    autoComplete={mode === 'signup' ? 'new-password' : 'password'}
                  />
                  <Pressable
                    style={[styles.btn, { backgroundColor: colors.brandInk }]}
                    onPress={submit}
                    disabled={loading}
                  >
                    <Text style={[styles.btnText, { color: colors.brand }]}>
                      {loading ? 'Bitte warten...' : mode === 'signup' ? 'Konto anlegen' : 'Einloggen'}
                    </Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable
                    style={[styles.btn, { backgroundColor: colors.brandInk }]}
                    onPress={() => { setMode('signin'); setShowForm(true); }}
                  >
                    <Text style={[styles.btnText, { color: colors.brand }]}>Einloggen</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.btnGhost, { borderColor: colors.brandInk + '40' }]}
                    onPress={() => { setMode('signup'); setShowForm(true); }}
                  >
                    <Text style={[styles.btnText, { color: colors.brandInk }]}>Neu registrieren</Text>
                  </Pressable>
                </>
              )}

              <Text style={[styles.foot, { color: colors.brandInk + '99' }]}>
                Mit deiner Anmeldung akzeptierst du unsere AGB &amp; Datenschutzerklärung.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function TabButton({ label, active, onPress, colors }: { label: string; active: boolean; onPress: () => void; colors: any }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tabBtn,
        active && { backgroundColor: colors.brandInk },
      ]}
    >
      <Text style={[styles.tabBtnText, { color: active ? colors.brand : colors.brandInk + 'B3' }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // Wenn das Formular offen ist: kompakter oben, damit die Felder nicht
  // von der Tastatur verdeckt werden. topBlock verliert flex:1.
  containerForm: {
    justifyContent: 'flex-start',
    gap: 24,
    paddingTop: 60,
  },
  // Wrapper der Brand + Tagline haelt und beide mit space-evenly
  // vertikal verteilt: gleicher Abstand vom oberen Rand zur Brand
  // wie von Brand zur Tagline.
  topBlock: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  // Kompakter Header wenn Formular offen — keine flex:1, weniger vertikaler Raum
  topBlockForm: {
    flex: 0,
    gap: 12,
  },
  brand: { alignItems: 'center' },
  logoWord: { fontFamily: fonts.serifMedium, fontSize: 38, letterSpacing: 6 },
  logoSub: { fontFamily: fonts.sans, fontSize: 11.5, letterSpacing: 4, marginTop: 18 },
  taglineBlock: { width: '100%' },
  tagline: { fontFamily: fonts.serif, fontSize: 22, textAlign: 'center', lineHeight: 28 },
  ctaStack: { width: '100%', gap: spacing.md },
  tabRow: {
    flexDirection: 'row', gap: 4,
    padding: 4, borderRadius: 100,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 100, alignItems: 'center' },
  tabBtnText: { fontFamily: fonts.sansBold, fontSize: 13, fontWeight: '600' },
  input: {
    fontFamily: fonts.sans, fontSize: 15,
    borderWidth: 1, borderRadius: radius.md,
    paddingHorizontal: 18, paddingVertical: 14,
  },
  btn: { paddingVertical: 16, borderRadius: 100, alignItems: 'center' },
  btnGhost: { paddingVertical: 15, borderRadius: 100, borderWidth: 1, alignItems: 'center' },
  btnText: { fontFamily: fonts.sansBold, fontSize: 15, fontWeight: '600' },
  foot: { fontFamily: fonts.sans, fontSize: 11.5, textAlign: 'center', marginTop: 8, lineHeight: 16 },
});
