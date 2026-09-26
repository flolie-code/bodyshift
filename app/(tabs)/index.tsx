import { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { router, useFocusEffect } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { fonts, radius, spacing } from '@/constants/theme';
import { DayRing } from '@/components/DayRing';
import { JanaCard } from '@/components/JanaCard';
import { FadeInView } from '@/components/FadeInView';
import { AnimatedPress } from '@/components/AnimatedPress';
import { WaterWidget } from '@/components/WaterWidget';
import { listRecipes, type Recipe } from '@/lib/recipes';
import { useHomeData } from '@/hooks/useHomeData';
import { getJanaMessage } from '@/lib/jana';

const WEEK_LABELS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] as const;

export default function HomeScreen() {
  const { colors } = useTheme();
  const home = useHomeData();
  const [recipeOfDay, setRecipeOfDay] = useState<Recipe | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const dailyGoal = home.dailyGoal;
  const consumed = home.todayTotals.kcal;
  const remaining = Math.max(0, dailyGoal - consumed);
  const onTrack = consumed <= dailyGoal;
  const todayIdx = (new Date().getDay() + 6) % 7;

  const weekRings = home.weekConsumed.map((kcal, i) => {
    const pct = kcal / dailyGoal;
    return {
      label: WEEK_LABELS[i],
      percent: Math.max(0, Math.min(1, pct)),
      variant: (i === todayIdx ? 'today' : 'default') as 'today' | 'default' | 'treat',
    };
  });
  const weekTotalConsumed = home.weekConsumed.reduce((a, b) => a + b, 0);
  const weekRemaining = home.weekMeta.weekBudget - weekTotalConsumed;

  const initials = home.firstName ? home.firstName.slice(0, 2).toUpperCase() : 'BS';

  const janaMessage = getJanaMessage({
    firstName: home.firstName,
    hour: new Date().getHours(),
    dailyGoalKcal: dailyGoal,
    consumedKcal: consumed,
    remainingKcal: remaining,
    weekRemainingKcal: weekRemaining,
  });

  async function loadRecipeOfDay() {
    try {
      const list = await listRecipes({ limit: 20 });
      if (list.length > 0) {
        const idx = new Date().getDate() % list.length;
        setRecipeOfDay(list[idx]);
      }
    } catch {
      // Rezept-Card faellt still weg wenn keine da sind
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadRecipeOfDay();
  }, []);

  useFocusEffect(
    useCallback(() => {
      home.refresh();
    }, [home.refresh])
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadRecipeOfDay();
              home.refresh();
            }}
            tintColor={colors.brand}
          />
        }
      >
        {/* Header — minimal: Datum + Avatar */}
        <View style={styles.header}>
          <Text style={[styles.dateLabel, { color: colors.inkMute }]}>
            {new Date()
              .toLocaleDateString('de-AT', { weekday: 'long', day: 'numeric', month: 'long' })
              .toUpperCase()}
          </Text>
          <Pressable
            style={[styles.avatar, { backgroundColor: colors.brand }]}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Text style={[styles.avatarText, { color: colors.brandInk }]}>{initials}</Text>
          </Pressable>
        </View>

        {/* Jana-Nachricht — die persoenliche Ansprache */}
        <FadeInView delay={0}>
          <JanaCard message={janaMessage} colors={colors} />
        </FadeInView>

        {/* Foto-Tracker als prominenter Primaerbutton */}
        <FadeInView delay={60}>
          <AnimatedPress
            style={[styles.primaryBtn, { backgroundColor: colors.accent }]}
            onPress={() => router.push('/ki-foto')}
          >
            <Text style={styles.primaryIcon}>📷</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.primaryTitle, { color: colors.brandInk }]}>
                Mahlzeit scannen
              </Text>
              <Text style={[styles.primarySub, { color: colors.brandInk + 'CC' }]}>
                Foto machen — Jana rechnet den Rest aus
              </Text>
            </View>
            <Text style={[styles.primaryArrow, { color: colors.brandInk }]}>›</Text>
          </AnimatedPress>
        </FadeInView>

        {/* Kalorien-Hero */}
        <FadeInView delay={120} style={[styles.kcalCard, { backgroundColor: colors.surface }]}>
          <View style={styles.kcalRingRow}>
            <CalorieRing
              consumed={consumed}
              goal={dailyGoal}
              color={colors.accent}
              trackColor={colors.track}
            />
            <View style={styles.kcalStats}>
              <Text style={[styles.label, { color: colors.inkMute }]}>VERBLEIBEND</Text>
              <Text style={[styles.bigNumber, { color: colors.ink }]}>
                {remaining.toLocaleString('de-AT')}
                <Text style={[styles.unit, { color: colors.inkMute }]}> kcal</Text>
              </Text>
              <Text
                style={[
                  styles.remainingHint,
                  { color: onTrack ? colors.success : colors.protein },
                ]}
              >
                {onTrack ? '✓ Im Plan' : '! Ueber Tagesziel'} · Ziel{' '}
                {dailyGoal.toLocaleString('de-AT')} kcal
              </Text>
            </View>
          </View>

          <View style={[styles.macros, { borderTopColor: colors.lineSoft }]}>
            <MacroBar
              label="Protein"
              current={Math.round(home.todayTotals.protein)}
              goal={home.macroGoals.protein}
              color={colors.protein}
              trackColor={colors.track}
              inkColor={colors.ink}
              inkMute={colors.inkMute}
            />
            <MacroBar
              label="Carbs"
              current={Math.round(home.todayTotals.carbs)}
              goal={home.macroGoals.carbs}
              color={colors.carbs}
              trackColor={colors.track}
              inkColor={colors.ink}
              inkMute={colors.inkMute}
            />
            <MacroBar
              label="Fett"
              current={Math.round(home.todayTotals.fat)}
              goal={home.macroGoals.fat}
              color={colors.fat}
              trackColor={colors.track}
              inkColor={colors.ink}
              inkMute={colors.inkMute}
            />
          </View>
        </FadeInView>

        {/* Wasser-Tracker */}
        <FadeInView delay={180}>
          <WaterWidget colors={colors} />
        </FadeInView>

        {/* Wochenkonto — kompakter */}
        <FadeInView delay={240}>
        <AnimatedPress
          style={[styles.weekCard, { backgroundColor: colors.surface }]}
          onPress={() => router.push('/wochenkonto')}
        >
          <View style={styles.weekHead}>
            <Text style={[styles.weekTitle, { color: colors.ink }]}>
              KW {home.weekMeta.weekNumber}
            </Text>
            <Text
              style={[
                styles.weekRemain,
                { color: weekRemaining >= 0 ? colors.brand : colors.protein },
              ]}
            >
              {weekRemaining.toLocaleString('de-AT')} kcal frei
            </Text>
          </View>
          <View style={styles.weekRings}>
            {weekRings.map((d) => (
              <DayRing
                key={d.label}
                label={d.label}
                percent={d.percent}
                variant={d.variant}
                colors={colors}
              />
            ))}
          </View>
        </AnimatedPress>
        </FadeInView>

        {/* Rezept des Tages */}
        {recipeOfDay && (
          <FadeInView delay={300}>
          <AnimatedPress
            style={[styles.recipeCard, { backgroundColor: colors.surface }]}
            onPress={() => router.push(`/recipe/${recipeOfDay.slug}`)}
          >
            <View style={styles.recipeImg}>
              {recipeOfDay.image_url ? (
                <Image
                  source={recipeOfDay.image_url}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                />
              ) : (
                <LinearGradient
                  colors={['#C67A50', '#E4A87A']}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.5)']}
                style={StyleSheet.absoluteFill}
                locations={[0.55, 1]}
              />
              <View style={styles.recipeLabel}>
                <Text style={[styles.recipeLabelText, { color: colors.brand }]}>
                  REZEPT DES TAGES
                </Text>
              </View>
            </View>
            <View style={styles.recipeBody}>
              <Text style={[styles.recipeTitle, { color: colors.ink }]} numberOfLines={1}>
                {recipeOfDay.title}
              </Text>
              <Text style={[styles.recipeMeta, { color: colors.inkMute }]}>
                {recipeOfDay.kcal ? `${recipeOfDay.kcal} kcal` : ''}
                {recipeOfDay.protein_g ? ` · ${recipeOfDay.protein_g}g Protein` : ''}
                {recipeOfDay.minutes ? ` · ${recipeOfDay.minutes} Min` : ''}
              </Text>
            </View>
          </AnimatedPress>
          </FadeInView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function CalorieRing({
  consumed,
  goal,
  color,
  trackColor,
}: {
  consumed: number;
  goal: number;
  color: string;
  trackColor: string;
}) {
  const r = 45;
  const circumference = 2 * Math.PI * r;
  const progress = Math.min(1, consumed / goal);
  const offset = circumference * (1 - progress);
  return (
    <Svg width={110} height={110} viewBox="0 0 110 110">
      <Circle cx={55} cy={55} r={r} fill="none" stroke={trackColor} strokeWidth={10} />
      <Circle
        cx={55}
        cy={55}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 55 55)"
      />
    </Svg>
  );
}

function MacroBar({
  label,
  current,
  goal,
  color,
  trackColor,
  inkColor,
  inkMute,
}: {
  label: string;
  current: number;
  goal: number;
  color: string;
  trackColor: string;
  inkColor: string;
  inkMute: string;
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
        <View
          style={{
            height: '100%',
            width: `${pct * 100}%`,
            backgroundColor: color,
            borderRadius: 3,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    padding: spacing.xl,
    paddingBottom: 40,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 10.5,
    letterSpacing: 1.6,
    fontWeight: '600',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.serifMedium, fontSize: 14 },

  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 18,
    borderRadius: radius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryIcon: { fontSize: 26 },
  primaryTitle: { fontFamily: fonts.serifMedium, fontSize: 17 },
  primarySub: { fontFamily: fonts.sans, fontSize: 12, marginTop: 2 },
  primaryArrow: { fontSize: 24, fontFamily: fonts.serif },

  kcalCard: { borderRadius: radius.xl, padding: 18 },
  kcalRingRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  kcalStats: { flex: 1 },
  label: {
    fontFamily: fonts.sansBold,
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 1.4,
    marginBottom: 2,
  },
  bigNumber: {
    fontFamily: fonts.serifMedium,
    fontSize: 28,
    letterSpacing: -0.5,
  },
  unit: { fontFamily: fonts.sans, fontSize: 12, fontWeight: '500' },
  remainingHint: {
    fontFamily: fonts.sans,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
  },
  macros: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  macro: { flex: 1, gap: 5 },
  macroHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  macroName: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  macroVal: { fontFamily: fonts.sans, fontSize: 12, fontWeight: '600' },
  macroBar: { height: 5, borderRadius: 3, overflow: 'hidden' },

  weekCard: { borderRadius: radius.lg, padding: 14 },
  weekHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  weekTitle: { fontFamily: fonts.serifMedium, fontSize: 14 },
  weekRemain: { fontFamily: fonts.sansBold, fontSize: 13, fontWeight: '600' },
  weekRings: {
    flexDirection: 'row',
    gap: 6,
  },

  recipeCard: { borderRadius: radius.lg, overflow: 'hidden' },
  recipeImg: { height: 140, position: 'relative' },
  recipeLabel: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  recipeLabelText: {
    fontFamily: fonts.sansBold,
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  recipeBody: { padding: 14 },
  recipeTitle: { fontFamily: fonts.serifMedium, fontSize: 17, marginBottom: 4 },
  recipeMeta: { fontFamily: fonts.sans, fontSize: 12 },
});
