import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { fonts, radius, spacing } from '@/constants/theme';
import {
  loadSettings,
  saveSettings,
  requestPermission,
  hasPermission,
  type ReminderSettings,
  type ReminderKey,
} from '@/lib/reminders';

const REMINDER_LABELS: Record<ReminderKey, { title: string; sub: string; time: string }> = {
  morning: {
    title: 'Morgen-Motivation',
    sub: 'Kurze Nachricht von Jana zum Start',
    time: '07:00',
  },
  water: {
    title: 'Wasser-Reminder',
    sub: 'Alle 3 Stunden, tagsueber',
    time: '9-21 Uhr',
  },
  movement: {
    title: 'Bewegungs-Impuls',
    sub: '5 Minuten aufstehen, Blutzucker senken',
    time: '12:30',
  },
  evening: {
    title: 'Abend-Reflexion',
    sub: 'Zusammenfassung deines Tages',
    time: '20:00',
  },
};

export default function EinstellungenScreen() {
  const { colors } = useTheme();
  const [settings, setSettings] = useState<ReminderSettings | null>(null);
  const [permissionOk, setPermissionOk] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      setSettings(await loadSettings());
      setPermissionOk(await hasPermission());
    })();
  }, []);

  const askForPermission = useCallback(async () => {
    const ok = await requestPermission();
    setPermissionOk(ok);
    if (!ok) {
      Alert.alert(
        'Berechtigung fehlt',
        'Ohne Benachrichtigungs-Berechtigung kann Jana dir keine Reminder schicken. Du kannst sie in den System-Einstellungen jederzeit erlauben.'
      );
    }
  }, []);

  const toggle = useCallback(
    async (key: ReminderKey) => {
      if (!settings) return;
      if (!permissionOk) {
        await askForPermission();
        if (!(await hasPermission())) return;
      }
      const next = { ...settings, [key]: !settings[key] };
      setSettings(next);
      await saveSettings(next);
    },
    [settings, permissionOk, askForPermission]
  );

  if (!settings) {
    return <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={[styles.back, { color: colors.brand }]}>← Zurueck</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.ink }]}>Einstellungen</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.section, { color: colors.inkMute }]}>REMINDER VON JANA</Text>

        {permissionOk === false && (
          <View style={[styles.permWarn, { backgroundColor: colors.accentSoft }]}>
            <Text style={[styles.permText, { color: colors.accent }]}>
              Benachrichtigungen sind deaktiviert. Tippe auf einen Schalter, um sie freizugeben.
            </Text>
          </View>
        )}

        <View style={[styles.list, { backgroundColor: colors.surface }]}>
          {(Object.keys(REMINDER_LABELS) as ReminderKey[]).map((key, i) => {
            const meta = REMINDER_LABELS[key];
            return (
              <View
                key={key}
                style={[
                  styles.row,
                  i > 0 && { borderTopColor: colors.lineSoft, borderTopWidth: 1 },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rowTitle, { color: colors.ink }]}>{meta.title}</Text>
                  <Text style={[styles.rowSub, { color: colors.inkMute }]}>
                    {meta.sub} · {meta.time}
                  </Text>
                </View>
                <Switch
                  value={settings[key]}
                  onValueChange={() => toggle(key)}
                  trackColor={{ true: colors.brand, false: colors.line }}
                  thumbColor={colors.surface}
                />
              </View>
            );
          })}
        </View>

        <Text style={[styles.hint, { color: colors.inkMute }]}>
          Alle Reminder sind sanft — kein Drueckertum, nur kurze Impulse. Du kannst sie
          jederzeit an- oder abschalten.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  back: { fontFamily: fonts.sansBold, fontSize: 14, fontWeight: '600' },
  title: { fontFamily: fonts.serifMedium, fontSize: 17 },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 40 },

  section: {
    fontFamily: fonts.sansBold,
    fontSize: 10.5,
    letterSpacing: 1.4,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 10,
  },
  permWarn: { padding: 14, borderRadius: radius.md, marginBottom: 12 },
  permText: { fontFamily: fonts.sans, fontSize: 12.5, lineHeight: 18 },

  list: { borderRadius: radius.lg, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  rowTitle: { fontFamily: fonts.serifMedium, fontSize: 15 },
  rowSub: { fontFamily: fonts.sans, fontSize: 12, marginTop: 2 },

  hint: {
    fontFamily: fonts.sans,
    fontSize: 11.5,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
});
