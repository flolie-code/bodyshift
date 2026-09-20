import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/hooks/useTheme';
import { fonts, radius, spacing } from '@/constants/theme';
import { calcBMR, calcTDEE, calcDailyTarget, calcMacros, type Sex, type ActivityLevel } from '@/lib/nutrition';

/**
 * Onboarding-Flow (nach Registrierung):
 * 1. Grunddaten (Geschlecht, Alter, Größe, Gewicht)
 * 2. Ziel (Wunschgewicht, Tempo)
 * 3. Zusammenfassung + Speichern → Home
 *
 * Für den ersten Wurf: alles in einem Screen mit Slidern und Buttons,
 * später aufteilen wenn Feedback zeigt dass es zu viel wird.
 */
export default function OnboardingScreen() {
  const { colors } = useTheme();
  const [sex, setSex] = useState<Sex>('female');
  const [age, setAge] = useState(30);
  const [heightCm, setHeightCm] = useState(170);
  const [currentWeight, setCurrentWeight] = useState(78);
  const [targetWeight, setTargetWeight] = useState(72);
  const [activity, setActivity] = useState<ActivityLevel>('light');
  const [saving, setSaving] = useState(false);

  const bmr = calcBMR({ sex, weightKg: currentWeight, heightCm, ageYears: age });
  const tdee = calcTDEE(bmr, activity);
  const goal = calcDailyTarget({ tdee, currentWeightKg: currentWeight, targetWeightKg: targetWeight, pace: 'moderate' });
  const macros = calcMacros(goal.dailyKcal);

  async function save() {
    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Kein User eingeloggt');

      const { error } = await supabase.from('profiles').upsert({
        id: userData.user.id,
        email: userData.user.email!,
        first_name: userData.user.user_metadata?.first_name ?? null,
        last_name: userData.user.user_metadata?.last_name ?? null,
        sex,
        birth_date: null,
        height_cm: heightCm,
        current_weight_kg: currentWeight,
        target_weight_kg: targetWeight,
        activity_level: activity,
        goal_pace: 'moderate',
        daily_kcal_target: goal.dailyKcal,
        daily_protein_g: macros.protein,
        daily_carbs_g: macros.carbs,
        daily_fat_g: macros.fat,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Speichern fehlgeschlagen', (err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.kicker, { color: colors.inkMute }]}>DEIN PROFIL</Text>
        <Text style={[styles.title, { color: colors.ink }]}>Kurz zu dir.</Text>
        <Text style={[styles.sub, { color: colors.inkSoft }]}>
          Damit wir dein Tages-Ziel und die Makro-Verteilung genau für dich berechnen können.
        </Text>

        <SegmentedControl
          label="Geschlecht"
          value={sex}
          options={[
            { value: 'female', label: 'Weiblich' },
            { value: 'male', label: 'Männlich' },
          ]}
          onChange={(v) => setSex(v as Sex)}
          colors={colors}
        />

        <NumberField label="Alter" value={age} unit="Jahre" min={16} max={99} onChange={setAge} colors={colors} />
        <NumberField label="Größe" value={heightCm} unit="cm" min={140} max={220} onChange={setHeightCm} colors={colors} />
        <NumberField label="Aktuelles Gewicht" value={currentWeight} unit="kg" min={40} max={200} step={0.5} onChange={setCurrentWeight} colors={colors} />
        <NumberField label="Wunschgewicht" value={targetWeight} unit="kg" min={40} max={200} step={0.5} onChange={setTargetWeight} colors={colors} />

        <SegmentedControl
          label="Aktivität"
          value={activity}
          options={[
            { value: 'sedentary', label: 'Wenig' },
            { value: 'light', label: 'Leicht' },
            { value: 'moderate', label: 'Mittel' },
            { value: 'active', label: 'Aktiv' },
          ]}
          onChange={(v) => setActivity(v as ActivityLevel)}
          colors={colors}
        />

        <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.summaryKicker, { color: colors.inkMute }]}>DEIN TÄGLICHES ZIEL</Text>
          <Text style={[styles.summaryBig, { color: colors.brand }]}>
            {goal.dailyKcal.toLocaleString('de-AT')}
            <Text style={[styles.summaryUnit, { color: colors.inkMute }]}> kcal</Text>
          </Text>
          <View style={[styles.macroRow, { borderTopColor: colors.lineSoft }]}>
            <MacroChip label="Protein" value={macros.protein} color={colors.protein} />
            <MacroChip label="Carbs" value={macros.carbs} color={colors.carbs} />
            <MacroChip label="Fett" value={macros.fat} color={colors.fat} />
          </View>
          <Text style={[styles.summaryFoot, { color: colors.accent }]}>
            Ziel: {Math.abs(targetWeight - currentWeight).toFixed(1)} kg in ca. {goal.weeksToGoal} Wochen — sanft &amp; nachhaltig
          </Text>
        </View>

        <Pressable style={[styles.btn, { backgroundColor: colors.brand }]} onPress={save} disabled={saving}>
          <Text style={[styles.btnText, { color: colors.brandInk }]}>
            {saving ? 'Speichere...' : 'Los geht\'s'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function SegmentedControl({ label, value, options, onChange, colors }: {
  label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void; colors: any;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, { color: colors.inkMute }]}>{label.toUpperCase()}</Text>
      <View style={[styles.segRow, { backgroundColor: colors.surfaceAlt }]}>
        {options.map((opt) => (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[
              styles.segItem,
              value === opt.value && { backgroundColor: colors.brand },
            ]}
          >
            <Text style={[styles.segText, { color: value === opt.value ? colors.brandInk : colors.inkSoft }]}>
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function NumberField({ label, value, unit, min, max, step = 1, onChange, colors }: {
  label: string; value: number; unit: string; min: number; max: number; step?: number; onChange: (v: number) => void; colors: any;
}) {
  const format = (v: number) => (step < 1 ? v.toFixed(1) : String(Math.round(v))).replace('.', ',');
  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, { color: colors.inkMute }]}>{label.toUpperCase()}</Text>
      <View style={styles.numRow}>
        <Pressable
          onPress={() => onChange(Math.max(min, value - step))}
          style={[styles.numBtn, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.numBtnText, { color: colors.brand }]}>−</Text>
        </Pressable>
        <View style={[styles.numValue, { backgroundColor: colors.surface }]}>
          <Text style={[styles.numValueText, { color: colors.ink }]}>{format(value)}</Text>
          <Text style={[styles.numUnit, { color: colors.inkMute }]}>{unit}</Text>
        </View>
        <Pressable
          onPress={() => onChange(Math.min(max, value + step))}
          style={[styles.numBtn, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.numBtnText, { color: colors.brand }]}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function MacroChip({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.macroChip}>
      <Text style={[styles.macroChipLabel, { color: '#8A928E' }]}>{label.toUpperCase()}</Text>
      <Text style={[styles.macroChipValue, { color }]}>{value}g</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.xl, paddingBottom: 40 },
  kicker: { fontFamily: fonts.sansBold, fontSize: 11, letterSpacing: 1.5, fontWeight: '600' },
  title: { fontFamily: fonts.serifMedium, fontSize: 28, marginTop: 6, marginBottom: 6 },
  sub: { fontFamily: fonts.sans, fontSize: 13.5, lineHeight: 20, marginBottom: spacing.xl },
  fieldGroup: { marginBottom: spacing.lg },
  fieldLabel: { fontFamily: fonts.sansBold, fontSize: 10.5, letterSpacing: 1.2, fontWeight: '600', marginBottom: 8 },
  segRow: { flexDirection: 'row', gap: 4, padding: 4, borderRadius: 100 },
  segItem: { flex: 1, paddingVertical: 10, borderRadius: 100, alignItems: 'center' },
  segText: { fontFamily: fonts.sansBold, fontSize: 13, fontWeight: '600' },
  numRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  numBtn: { width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  numBtnText: { fontFamily: fonts.serifMedium, fontSize: 24, fontWeight: '500' },
  numValue: { flex: 1, height: 44, borderRadius: radius.md, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 4 },
  numValueText: { fontFamily: fonts.serifMedium, fontSize: 20 },
  numUnit: { fontFamily: fonts.sans, fontSize: 12, fontWeight: '500' },
  summaryCard: {
    marginTop: spacing.lg, padding: spacing.xl, borderRadius: radius.lg,
    alignItems: 'center',
  },
  summaryKicker: { fontFamily: fonts.sansBold, fontSize: 10.5, letterSpacing: 1.2, fontWeight: '600', marginBottom: 4 },
  summaryBig: { fontFamily: fonts.serifMedium, fontSize: 40, letterSpacing: -1 },
  summaryUnit: { fontFamily: fonts.sans, fontSize: 15, fontWeight: '500' },
  macroRow: { flexDirection: 'row', gap: 12, marginTop: 14, paddingTop: 14, borderTopWidth: 1, width: '100%', justifyContent: 'space-around' },
  macroChip: { alignItems: 'center' },
  macroChipLabel: { fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 1, fontWeight: '600', marginBottom: 2 },
  macroChipValue: { fontFamily: fonts.serifMedium, fontSize: 18 },
  summaryFoot: { fontFamily: fonts.sans, fontSize: 12.5, marginTop: 12, textAlign: 'center' },
  btn: { marginTop: spacing.lg, paddingVertical: 16, borderRadius: 100, alignItems: 'center' },
  btnText: { fontFamily: fonts.sansBold, fontSize: 15, fontWeight: '600' },
});
