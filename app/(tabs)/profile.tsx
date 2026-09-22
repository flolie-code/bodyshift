import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/hooks/useTheme';
import { fonts, radius, spacing } from '@/constants/theme';

type Profile = {
  first_name: string | null;
  last_name: string | null;
  goal_kg: number | null;
  target_kcal_daily: number | null;
  height_cm: number | null;
  sex: 'male' | 'female' | 'other' | null;
};

export default function ProfileScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState<string>('');
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      setEmail(userData.user.email ?? '');
      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name, goal_kg, target_kcal_daily, height_cm, sex')
        .eq('user_id', userData.user.id)
        .maybeSingle();
      if (data) setProfile(data as Profile);
    })();
  }, []);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Fehler beim Abmelden', error.message);
      return;
    }
    router.replace('/(auth)/login');
  }

  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ');
  const initials = fullName
    ? fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerBlock}>
          <View style={[styles.avatarBig, { backgroundColor: colors.brand }]}>
            <Text style={[styles.avatarInit, { color: colors.brandInk }]}>{initials}</Text>
          </View>
          <Text style={[styles.name, { color: colors.ink }]}>
            {fullName || 'BodyShift Nutzer'}
          </Text>
          {email !== '' && (
            <Text style={[styles.email, { color: colors.inkMute }]}>{email}</Text>
          )}
        </View>

        {/* Kennzahlen */}
        {profile && (
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardTitle, { color: colors.ink }]}>Meine Ziele</Text>
            <Row
              label="Tages-Ziel"
              value={
                profile.target_kcal_daily
                  ? `${profile.target_kcal_daily.toLocaleString('de-AT')} kcal`
                  : '—'
              }
              colors={colors}
            />
            <Row
              label="Wunschgewicht"
              value={profile.goal_kg ? `${profile.goal_kg} kg` : '—'}
              colors={colors}
            />
            <Row
              label="Größe"
              value={profile.height_cm ? `${profile.height_cm} cm` : '—'}
              colors={colors}
              last
            />
          </View>
        )}

        {/* Navigations-Karten */}
        <MenuCard
          icon="📈"
          title="Fortschritt"
          sub="Gewicht tracken, Verlauf sehen"
          onPress={() => router.push('/fortschritt')}
          colors={colors}
        />
        <MenuCard
          icon="📅"
          title="Wochenkonto"
          sub="Budget flexibel verschieben, Gönn-Tag planen"
          onPress={() => router.push('/wochenkonto')}
          colors={colors}
        />
        <MenuCard
          icon="💡"
          title="Behandlungs-Termine"
          sub="Kommt bald"
          onPress={() => Alert.alert('Bald verfügbar', 'Deine ABL-Termine erscheinen hier automatisch.')}
          colors={colors}
          muted
        />

        <Pressable
          style={[styles.signOutBtn, { backgroundColor: colors.surface, borderColor: colors.line }]}
          onPress={signOut}
        >
          <Text style={[styles.signOutText, { color: colors.protein }]}>Abmelden</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  label,
  value,
  colors,
  last,
}: {
  label: string;
  value: string;
  colors: any;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.row,
        !last && { borderBottomColor: colors.lineSoft, borderBottomWidth: 1 },
      ]}
    >
      <Text style={[styles.rowLabel, { color: colors.inkMute }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.ink }]}>{value}</Text>
    </View>
  );
}

function MenuCard({
  icon,
  title,
  sub,
  onPress,
  colors,
  muted,
}: {
  icon: string;
  title: string;
  sub: string;
  onPress: () => void;
  colors: any;
  muted?: boolean;
}) {
  return (
    <Pressable
      style={[styles.menuCard, { backgroundColor: colors.surface, opacity: muted ? 0.6 : 1 }]}
      onPress={onPress}
    >
      <View style={[styles.menuIcon, { backgroundColor: colors.surfaceAlt }]}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.menuTitle, { color: colors.ink }]}>{title}</Text>
        <Text style={[styles.menuSub, { color: colors.inkMute }]}>{sub}</Text>
      </View>
      <Text style={[styles.menuArrow, { color: colors.inkMute }]}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.xl, paddingBottom: 40, gap: 12 },
  headerBlock: { alignItems: 'center', paddingVertical: spacing.md, gap: 6 },
  avatarBig: {
    width: 72,
    height: 72,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInit: { fontFamily: fonts.serifMedium, fontSize: 26 },
  name: { fontFamily: fonts.serifMedium, fontSize: 22, marginTop: 6 },
  email: { fontFamily: fonts.sans, fontSize: 13 },

  card: { borderRadius: radius.lg, padding: 16 },
  cardTitle: { fontFamily: fonts.serifMedium, fontSize: 15, marginBottom: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  rowLabel: { fontFamily: fonts.sans, fontSize: 13 },
  rowValue: { fontFamily: fonts.sansBold, fontSize: 13, fontWeight: '600' },

  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radius.md,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: { fontFamily: fonts.serifMedium, fontSize: 15 },
  menuSub: { fontFamily: fonts.sans, fontSize: 12, marginTop: 2 },
  menuArrow: { fontSize: 22, fontFamily: fonts.serif },

  signOutBtn: {
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  signOutText: { fontFamily: fonts.sansBold, fontSize: 14, fontWeight: '600' },
});
