import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { fonts, radius, spacing } from '@/constants/theme';

/**
 * Dashboard — der Screen der 20× am Tag geöffnet wird.
 * Aufbau (aus dem Prototyp):
 * - Greeting mit Streak
 * - Großer Tages-Kalorien-Ring + Makro-Balken
 * - Wochenkonto (kompakt: 7 kleine Ringe)
 * - Schnellzugriff (Schritte, Wasser)
 * - Rezept des Tages
 * - Alltags-Hack
 */
export default function HomeScreen() {
  const { colors } = useTheme();

  // Mock-Daten — später aus Supabase
  const dailyGoal = 1680;
  const consumed = 1140;
  const remaining = dailyGoal - consumed;
  const progress = consumed / dailyGoal;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.ink }]}>Guten Morgen, Florian</Text>
            <Text style={[styles.streak, { color: colors.inkMute }]}>Tag 23 · Streak: 12 🔥</Text>
          </View>
          <View style={[styles.avatar, { backgroundColor: colors.brand }]}>
            <Text style={[styles.avatarText, { color: colors.brandInk }]}>FL</Text>
          </View>
        </View>

        <View style={[styles.calorieHero, { backgroundColor: colors.surface }]}>
          <View style={styles.calRingWrap}>
            <CalorieRing consumed={consumed} goal={dailyGoal} color={colors.accent} trackColor={colors.track} inkColor={colors.ink} inkMute={colors.inkMute} />
            <View style={styles.calStats}>
              <Text style={[styles.label, { color: colors.inkMute }]}>VERBLEIBEND</Text>
              <Text style={[styles.bigNumber, { color: colors.ink }]}>
                {remaining}
                <Text style={[styles.unit, { color: colors.inkMute }]}> kcal</Text>
              </Text>
              <Text style={[styles.remainingHint, { color: colors.success }]}>
                ✓ Gut im Plan · Ziel {dailyGoal.toLocaleString('de-AT')} kcal
              </Text>
            </View>
          </View>

          <View style={[styles.macros, { borderTopColor: colors.lineSoft }]}>
            <MacroBar label="Protein" current={95} goal={140} color={colors.protein} trackColor={colors.track} inkColor={colors.ink} inkMute={colors.inkMute} />
            <MacroBar label="Carbs" current={92} goal={170} color={colors.carbs} trackColor={colors.track} inkColor={colors.ink} inkMute={colors.inkMute} />
            <MacroBar label="Fett" current={23} goal={55} color={colors.fat} trackColor={colors.track} inkColor={colors.ink} inkMute={colors.inkMute} />
          </View>
        </View>

        {/* TODO: Wochenkonto-Card, Streak-Cards, Rezept des Tages, Hack */}
        <View style={[styles.placeholder, { backgroundColor: colors.surface }]}>
          <Text style={[styles.placeholderText, { color: colors.inkMute }]}>
            Wochenkonto, Rezept des Tages und Hack kommen als nächstes.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CalorieRing({ consumed, goal, color, trackColor, inkColor, inkMute }: {
  consumed: number; goal: number; color: string; trackColor: string; inkColor: string; inkMute: string;
}) {
  const r = 55;
  const circumference = 2 * Math.PI * r;
  const progress = Math.min(1, consumed / goal);
  const offset = circumference * (1 - progress);

  return (
    <Svg width={130} height={130} viewBox="0 0 130 130">
      <Circle cx={65} cy={65} r={r} fill="none" stroke={trackColor} strokeWidth={12} />
      <Circle
        cx={65}
        cy={65}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 65 65)`}
      />
    </Svg>
  );
}

function MacroBar({ label, current, goal, color, trackColor, inkColor, inkMute }: {
  label: string; current: number; goal: number; color: string; trackColor: string; inkColor: string; inkMute: string;
}) {
  const pct = Math.min(1, current / goal);
  return (
    <View style={styles.macro}>
      <View style={styles.macroHead}>
        <Text style={[styles.macroName, { color: inkMute }]}>{label.toUpperCase()}</Text>
        <Text style={[styles.macroVal, { color: inkColor }]}>
          {current}
          <Text style={{ color: inkMute, fontWeight: '400' }}>/{goal}g</Text>
        </Text>
      </View>
      <View style={[styles.macroBar, { backgroundColor: trackColor }]}>
        <View style={{ height: '100%', width: `${pct * 100}%`, backgroundColor: color, borderRadius: 3 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.xl, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  greeting: { fontFamily: fonts.serifMedium, fontSize: 22 },
  streak: { fontFamily: fonts.sans, fontSize: 12.5, marginTop: 2 },
  avatar: {
    width: 42, height: 42, borderRadius: 100,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.serifMedium, fontSize: 16 },
  calorieHero: {
    borderRadius: radius.xl,
    padding: 22,
    marginTop: spacing.sm,
  },
  calRingWrap: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  calStats: { flex: 1 },
  label: {
    fontFamily: fonts.sans, fontSize: 11, fontWeight: '600',
    letterSpacing: 1.5, marginBottom: 2,
  },
  bigNumber: { fontFamily: fonts.serifMedium, fontSize: 32, letterSpacing: -0.5 },
  unit: { fontFamily: fonts.sans, fontSize: 13, fontWeight: '500' },
  remainingHint: { fontFamily: fonts.sans, fontSize: 13, fontWeight: '500', marginTop: 8 },
  macros: {
    flexDirection: 'row', gap: 10,
    marginTop: 16, paddingTop: 16, borderTopWidth: 1,
  },
  macro: { flex: 1, gap: 6 },
  macroHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  macroName: { fontFamily: fonts.sans, fontSize: 11, fontWeight: '600', letterSpacing: 1 },
  macroVal: { fontFamily: fonts.sans, fontSize: 12.5, fontWeight: '600' },
  macroBar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  placeholder: {
    marginTop: spacing.md, padding: spacing.xl, borderRadius: radius.lg,
    alignItems: 'center',
  },
  placeholderText: { fontFamily: fonts.sans, fontSize: 13, textAlign: 'center' },
});
