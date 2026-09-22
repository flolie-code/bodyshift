import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { fonts, radius, spacing } from '@/constants/theme';
import {
  type WeekAccount,
  type Weekday,
  weekdayName,
  shiftBudget,
  planTreatDay,
  weekFeedback,
  totalAdjusted,
  totalConsumed,
} from '@/lib/weekAccount';

const WEEKLY_BUDGET = 1680 * 7; // 11.760 kcal
const BASE_DAILY = 1680;

function buildMockWeek(): WeekAccount {
  const monday = new Date();
  const dow = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - dow);
  const iso = (d: Date) => d.toISOString().slice(0, 10);

  const consumedMock = [1520, 1610, 1490, 1720, 1440, 0, 1180];

  return {
    weekStartISO: iso(monday),
    weeklyBudget: WEEKLY_BUDGET,
    days: Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return {
        weekday: i as Weekday,
        dateISO: iso(d),
        baseKcal: BASE_DAILY,
        adjustedKcal: BASE_DAILY,
        consumedKcal: consumedMock[i],
        isTreatDay: false,
      };
    }),
  };
}

export default function WochenkontoScreen() {
  const { colors } = useTheme();
  const [week, setWeek] = useState<WeekAccount>(buildMockWeek);
  const [selected, setSelected] = useState<Weekday>(((new Date().getDay() + 6) % 7) as Weekday);

  const today = ((new Date().getDay() + 6) % 7) as Weekday;
  const consumed = totalConsumed(week);
  const remaining = week.weeklyBudget - consumed;
  const adjusted = totalAdjusted(week);
  const drift = adjusted - week.weeklyBudget;
  const feedback = weekFeedback(week, today);

  const selectedDay = week.days.find((d) => d.weekday === selected)!;

  function shift(delta: number) {
    const donors = week.days
      .map((d) => d.weekday)
      .filter((w) => w !== selected) as Weekday[];
    setWeek(shiftBudget(week, selected, delta, donors));
  }

  function toggleTreat() {
    if (selectedDay.isTreatDay) {
      // Zurücksetzen auf Basis
      setWeek({
        ...week,
        days: week.days.map((d) =>
          d.weekday === selected ? { ...d, isTreatDay: false, adjustedKcal: d.baseKcal } : d
        ),
      });
      return;
    }
    Alert.alert(
      'Gönn-Tag planen',
      `${weekdayName(selected)} wird zum Gönn-Tag. +500 kcal, andere Tage gleichen aus.`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Los', onPress: () => setWeek(planTreatDay(week, selected, 500)) },
      ]
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={[styles.back, { color: colors.brand }]}>← Zurück</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.ink }]}>Wochenkonto</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Wochen-Hero */}
        <View style={[styles.hero, { backgroundColor: colors.surface }]}>
          <Text style={[styles.heroLabel, { color: colors.inkMute }]}>DIESE WOCHE</Text>
          <Text style={[styles.heroBig, { color: colors.ink }]}>
            {remaining.toLocaleString('de-AT')}
            <Text style={[styles.heroUnit, { color: colors.inkMute }]}> kcal übrig</Text>
          </Text>
          <View style={[styles.heroBarTrack, { backgroundColor: colors.track }]}>
            <View
              style={{
                height: '100%',
                width: `${Math.min(100, (consumed / week.weeklyBudget) * 100)}%`,
                backgroundColor: colors.brand,
                borderRadius: 4,
              }}
            />
          </View>
          <View style={styles.heroFoot}>
            <Text style={[styles.heroFootText, { color: colors.inkMute }]}>
              Verbraucht: {consumed.toLocaleString('de-AT')}
            </Text>
            <Text style={[styles.heroFootText, { color: colors.inkMute }]}>
              Budget: {week.weeklyBudget.toLocaleString('de-AT')}
            </Text>
          </View>
          <Text style={[styles.feedback, { color: colors.inkSoft }]}>
            <Text style={{ color: colors.success }}>✓ </Text>
            {feedback}
          </Text>
        </View>

        {/* Tages-Grid mit großen Ringen */}
        <View style={styles.gridWrap}>
          {week.days.map((d) => (
            <BigDayRing
              key={d.weekday}
              day={d}
              isToday={d.weekday === today}
              isSelected={d.weekday === selected}
              onPress={() => setSelected(d.weekday)}
              colors={colors}
            />
          ))}
        </View>

        {/* Ausgewählter Tag — Details */}
        <View style={[styles.detailCard, { backgroundColor: colors.surface }]}>
          <View style={styles.detailHead}>
            <View>
              <Text style={[styles.detailTitle, { color: colors.ink }]}>
                {weekdayName(selected)}{selectedDay.isTreatDay ? ' · Gönn-Tag 🎉' : ''}
              </Text>
              <Text style={[styles.detailSub, { color: colors.inkMute }]}>
                {selectedDay.dateISO}
              </Text>
            </View>
            <Text style={[styles.detailKcal, { color: colors.brand }]}>
              {selectedDay.adjustedKcal.toLocaleString('de-AT')}
              <Text style={[styles.detailKcalUnit, { color: colors.inkMute }]}> kcal</Text>
            </Text>
          </View>

          {/* Slider-Steuerung: 50-kcal-Schritte */}
          <Text style={[styles.sliderLabel, { color: colors.inkMute }]}>
            BUDGET FÜR {weekdayName(selected).toUpperCase()} VERSCHIEBEN
          </Text>
          <View style={styles.sliderRow}>
            <StepBtn label="−200" onPress={() => shift(-200)} colors={colors} />
            <StepBtn label="−50" onPress={() => shift(-50)} colors={colors} />
            <StepBtn label="+50" onPress={() => shift(50)} colors={colors} accent />
            <StepBtn label="+200" onPress={() => shift(200)} colors={colors} accent />
          </View>
          <Text style={[styles.sliderHint, { color: colors.inkMute }]}>
            Andere Tage gleichen automatisch aus. Wochensumme bleibt konstant.
          </Text>

          <Pressable
            style={[
              styles.treatBtn,
              {
                backgroundColor: selectedDay.isTreatDay ? colors.accentSoft : colors.brand,
              },
            ]}
            onPress={toggleTreat}
          >
            <Text
              style={[
                styles.treatBtnText,
                { color: selectedDay.isTreatDay ? colors.accent : colors.brandInk },
              ]}
            >
              {selectedDay.isTreatDay ? '↺ Gönn-Tag zurücksetzen' : '🎉 Gönn-Tag planen (+500 kcal)'}
            </Text>
          </Pressable>
        </View>

        {/* Drift-Info (nur zeigen wenn abweichend) */}
        {drift !== 0 && (
          <View style={[styles.driftCard, { backgroundColor: colors.accentSoft }]}>
            <Text style={[styles.driftText, { color: colors.accent }]}>
              {drift > 0
                ? `Verteiltes Budget liegt ${drift} kcal über der Wochensumme — passt sich beim nächsten Shift an.`
                : `Verteiltes Budget liegt ${Math.abs(drift)} kcal unter der Wochensumme — Reserve.`}
            </Text>
          </View>
        )}

        <Text style={[styles.footNote, { color: colors.inkMute }]}>
          Das Wochenkonto ist das Herz von BodyShift: Kein starres Tageslimit,
          sondern flexible Budget-Verteilung übers Wochenganze.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function BigDayRing({
  day,
  isToday,
  isSelected,
  onPress,
  colors,
}: {
  day: WeekAccount['days'][number];
  isToday: boolean;
  isSelected: boolean;
  onPress: () => void;
  colors: any;
}) {
  const r = 24;
  const circumference = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, day.consumedKcal / Math.max(1, day.adjustedKcal)));
  const offset = circumference * (1 - pct);
  const stroke = day.isTreatDay ? colors.carbs : isToday ? colors.accent : colors.brand;
  const labelColor = isSelected
    ? colors.ink
    : day.isTreatDay
    ? colors.carbs
    : isToday
    ? colors.accent
    : colors.inkMute;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.bigDayRing,
        isSelected && { backgroundColor: colors.surfaceAlt, borderColor: colors.line },
      ]}
    >
      <Svg width={58} height={58} viewBox="0 0 58 58">
        <Circle cx={29} cy={29} r={r} fill="none" stroke={colors.track} strokeWidth={6} />
        <Circle
          cx={29}
          cy={29}
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 29 29)"
        />
      </Svg>
      <Text style={[styles.bigDayLabel, { color: labelColor }]}>
        {weekdayName(day.weekday)}{day.isTreatDay ? ' 🎉' : ''}
      </Text>
      <Text style={[styles.bigDayKcal, { color: colors.inkMute }]}>
        {day.consumedKcal > 0 ? `${Math.round(day.consumedKcal / 100) * 100}` : '—'}
      </Text>
    </Pressable>
  );
}

function StepBtn({
  label,
  onPress,
  colors,
  accent = false,
}: {
  label: string;
  onPress: () => void;
  colors: any;
  accent?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.stepBtn,
        { backgroundColor: accent ? colors.brand : colors.surfaceAlt },
      ]}
    >
      <Text
        style={[
          styles.stepBtnText,
          { color: accent ? colors.brandInk : colors.ink },
        ]}
      >
        {label}
      </Text>
    </Pressable>
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

  hero: { borderRadius: radius.xl, padding: 22, marginBottom: 16 },
  heroLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '600',
    marginBottom: 4,
  },
  heroBig: { fontFamily: fonts.serifMedium, fontSize: 34, letterSpacing: -0.5, marginBottom: 12 },
  heroUnit: { fontFamily: fonts.sans, fontSize: 14, fontWeight: '500' },
  heroBarTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  heroFoot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  heroFootText: { fontFamily: fonts.sans, fontSize: 12 },
  feedback: {
    fontFamily: fonts.sans,
    fontSize: 13,
    marginTop: 12,
    lineHeight: 18,
  },

  gridWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  bigDayRing: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
    flex: 1,
  },
  bigDayLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  bigDayKcal: { fontFamily: fonts.sans, fontSize: 10 },

  detailCard: { borderRadius: radius.lg, padding: 18, marginBottom: 14 },
  detailHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  detailTitle: { fontFamily: fonts.serifMedium, fontSize: 20 },
  detailSub: { fontFamily: fonts.sans, fontSize: 11.5, marginTop: 2 },
  detailKcal: { fontFamily: fonts.serifMedium, fontSize: 22 },
  detailKcalUnit: { fontFamily: fonts.sans, fontSize: 12, fontWeight: '500' },

  sliderLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 10.5,
    letterSpacing: 1.2,
    fontWeight: '600',
    marginBottom: 10,
  },
  sliderRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  stepBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  stepBtnText: { fontFamily: fonts.sansBold, fontSize: 13, fontWeight: '600' },
  sliderHint: { fontFamily: fonts.sans, fontSize: 11.5, lineHeight: 16, marginTop: 4 },

  treatBtn: {
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 100,
    alignItems: 'center',
  },
  treatBtnText: { fontFamily: fonts.sansBold, fontSize: 14, fontWeight: '600' },

  driftCard: { padding: 14, borderRadius: radius.md, marginBottom: 14 },
  driftText: { fontFamily: fonts.sans, fontSize: 12.5, lineHeight: 18 },

  footNote: {
    fontFamily: fonts.sans,
    fontSize: 11.5,
    lineHeight: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
    marginTop: 6,
  },
});
