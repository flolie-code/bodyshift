import { useCallback, useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { router, useFocusEffect } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { fonts, radius, spacing } from '@/constants/theme';
import { DayRing } from '@/components/DayRing';
import { listRecipes, type Recipe } from '@/lib/recipes';
import { todaysHack } from '@/lib/hacks';
import { useHomeData } from '@/hooks/useHomeData';

const WEEK_LABELS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] as const;

function greeting(): string {
  const h = new Date().getHours();
  if (h < 11) return 'Guten Morgen';
  if (h < 17) return 'Hallo';
  return 'Guten Abend';
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const home = useHomeData();
  const [recipeOfDay, setRecipeOfDay] = useState<Recipe | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const hack = todaysHack();

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

  async function loadRecipeOfDay() {
    try {
      const list = await listRecipes({ limit: 20 });
      if (list.length > 0) {
        const idx = new Date().getDate() % list.length;
        setRecipeOfDay(list[idx]);
      }
    } catch {
      // still ohne Rezept-Card — App bleibt lauffähig
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); loadRecipeOfDay(); }}
            tintColor={colors.brand}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.ink }]}>
              {greeting()}{home.firstName ? `, ${home.firstName}` : ''}
            </Text>
            <Text style={[styles.streak, { color: colors.inkMute }]}>
              {new Date().toLocaleDateString('de-AT', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Text>
          </View>
          <Pressable
            style={[styles.avatar, { backgroundColor: colors.brand }]}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Text style={[styles.avatarText, { color: colors.brandInk }]}>{initials}</Text>
          </Pressable>
        </View>

        {/* Kalorien-Hero */}
        <View style={[styles.calorieHero, { backgroundColor: colors.surface }]}>
          <View style={styles.calRingWrap}>
            <CalorieRing consumed={consumed} goal={dailyGoal} color={colors.accent} trackColor={colors.track} />
            <View style={styles.calStats}>
              <Text style={[styles.label, { color: colors.inkMute }]}>VERBLEIBEND</Text>
              <Text style={[styles.bigNumber, { color: colors.ink }]}>
                {remaining.toLocaleString('de-AT')}
                <Text style={[styles.unit, { color: colors.inkMute }]}> kcal</Text>
              </Text>
              <Text style={[styles.remainingHint, { color: onTrack ? colors.success : colors.protein }]}>
                {onTrack ? '✓' : '!'} {onTrack ? 'Im Plan' : 'Über Tagesziel'} · Ziel {dailyGoal.toLocaleString('de-AT')} kcal
              </Text>
            </View>
          </View>

          <View style={[styles.macros, { borderTopColor: colors.lineSoft }]}>
            <MacroBar label="Protein" current={Math.round(home.todayTotals.protein)} goal={home.macroGoals.protein} color={colors.protein} trackColor={colors.track} inkColor={colors.ink} inkMute={colors.inkMute} />
            <MacroBar label="Carbs" current={Math.round(home.todayTotals.carbs)} goal={home.macroGoals.carbs} color={colors.carbs} trackColor={colors.track} inkColor={colors.ink} inkMute={colors.inkMute} />
            <MacroBar label="Fett" current={Math.round(home.todayTotals.fat)} goal={home.macroGoals.fat} color={colors.fat} trackColor={colors.track} inkColor={colors.ink} inkMute={colors.inkMute} />
          </View>
        </View>

        {/* Wochenkonto */}
        <Pressable
          style={[styles.weekCard, { backgroundColor: colors.surface }]}
          onPress={() => router.push('/wochenkonto')}
        >
          <View style={styles.weekHead}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
              <Text style={[styles.weekTitle, { color: colors.ink }]}>Woche</Text>
              <Text style={[styles.weekKicker, { color: colors.inkMute }]}>Mo – So · KW {home.weekMeta.weekNumber}</Text>
            </View>
            <Text style={[styles.weekRemain, { color: weekRemaining >= 0 ? colors.brand : colors.protein }]}>
              {weekRemaining.toLocaleString('de-AT')}
              <Text style={[styles.weekRemainUnit, { color: colors.inkMute }]}> kcal übrig</Text>
            </Text>
          </View>
          <View style={styles.weekRings}>
            {weekRings.map((d) => (
              <DayRing key={d.label} label={d.label} percent={d.percent} variant={d.variant} colors={colors} />
            ))}
          </View>
          <Text style={[styles.weekFeedback, { color: colors.inkSoft }]}>
            <Text style={{ color: weekRemaining >= 0 ? colors.success : colors.protein }}>
              {weekRemaining >= 0 ? '✓ ' : '! '}
            </Text>
            {weekRemaining >= 0
              ? `Wochen-Puffer: ${weekRemaining.toLocaleString('de-AT')} kcal — tippe für Details.`
              : `Diese Woche ${Math.abs(weekRemaining)} kcal über Budget — kein Drama, nächste Woche startet frisch.`}
          </Text>
        </Pressable>

        {/* Quick-Stats */}
        <View style={styles.quickStrip}>
          <MiniCard icon="👣" label="Schritte heute" value="6.240" bg={colors.surface} inkColor={colors.ink} inkMute={colors.inkMute} accentBg={colors.brand} accentColor={colors.brand} />
          <MiniCard icon="💧" label="Wasser · Ziel 2,5L" value="1,4L" bg={colors.surface} inkColor={colors.ink} inkMute={colors.inkMute} accentBg={colors.accent} accentColor={colors.accent} />
        </View>

        {/* Rezept des Tages */}
        {recipeOfDay && (
          <>
            <View style={styles.sectionHead}>
              <Text style={[styles.sectionTitle, { color: colors.ink }]}>Rezept des Tages</Text>
              <Pressable onPress={() => router.push('/(tabs)/recipes')}>
                <Text style={[styles.sectionLink, { color: colors.brand }]}>Alle →</Text>
              </Pressable>
            </View>
            <Pressable
              style={[styles.recipeCard, { backgroundColor: colors.surface }]}
              onPress={() => router.push(`/recipe/${recipeOfDay.slug}`)}
            >
              <View style={styles.recipeImg}>
                {recipeOfDay.image_url ? (
                  <Image source={recipeOfDay.image_url} style={StyleSheet.absoluteFill} contentFit="cover" />
                ) : (
                  <LinearGradient colors={['#C67A50', '#E4A87A']} style={StyleSheet.absoluteFill} />
                )}
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.4)']}
                  style={StyleSheet.absoluteFill}
                  locations={[0.55, 1]}
                />
                {recipeOfDay.tags?.[0] && (
                  <View style={styles.recipeTag}>
                    <Text style={[styles.recipeTagText, { color: colors.brand }]}>
                      {recipeOfDay.tags[0]}
                    </Text>
                  </View>
                )}
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
            </Pressable>
          </>
        )}

        {/* Alltags-Hack */}
        <View style={styles.sectionHead}>
          <Text style={[styles.sectionTitle, { color: colors.ink }]}>Alltags-Hack</Text>
        </View>
        <View style={[styles.hackCard, { backgroundColor: colors.accentSoft }]}>
          <Text style={[styles.hackNum, { color: colors.accent }]}>{hack.number}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.hackTitle, { color: colors.accent }]}>{hack.title}</Text>
            <Text style={[styles.hackBody, { color: colors.accent }]}>{hack.body}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CalorieRing({ consumed, goal, color, trackColor }: {
  consumed: number; goal: number; color: string; trackColor: string;
}) {
  const r = 55;
  const circumference = 2 * Math.PI * r;
  const progress = Math.min(1, consumed / goal);
  const offset = circumference * (1 - progress);
  return (
    <Svg width={130} height={130} viewBox="0 0 130 130">
      <Circle cx={65} cy={65} r={r} fill="none" stroke={trackColor} strokeWidth={12} />
      <Circle
        cx={65} cy={65} r={r}
        fill="none"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 65 65)"
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

function MiniCard({ icon, label, value, bg, inkColor, inkMute, accentBg, accentColor }: {
  icon: string; label: string; value: string; bg: string; inkColor: string; inkMute: string; accentBg: string; accentColor: string;
}) {
  return (
    <View style={[styles.miniCard, { backgroundColor: bg }]}>
      <View style={[styles.miniIcon, { backgroundColor: accentBg + '22' }]}>
        <Text style={{ fontSize: 14 }}>{icon}</Text>
      </View>
      <Text style={[styles.miniValue, { color: inkColor }]}>{value}</Text>
      <Text style={[styles.miniLabel, { color: inkMute }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.xl, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  greeting: { fontFamily: fonts.serifMedium, fontSize: 22 },
  streak: { fontFamily: fonts.sans, fontSize: 12.5, marginTop: 2 },
  avatar: { width: 42, height: 42, borderRadius: 100, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.serifMedium, fontSize: 16 },

  calorieHero: { borderRadius: radius.xl, padding: 22 },
  calRingWrap: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  calStats: { flex: 1 },
  label: { fontFamily: fonts.sansBold, fontSize: 11, fontWeight: '600', letterSpacing: 1.5, marginBottom: 2 },
  bigNumber: { fontFamily: fonts.serifMedium, fontSize: 32, letterSpacing: -0.5 },
  unit: { fontFamily: fonts.sans, fontSize: 13, fontWeight: '500' },
  remainingHint: { fontFamily: fonts.sans, fontSize: 13, fontWeight: '500', marginTop: 8 },
  macros: { flexDirection: 'row', gap: 10, marginTop: 16, paddingTop: 16, borderTopWidth: 1 },
  macro: { flex: 1, gap: 6 },
  macroHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  macroName: { fontFamily: fonts.sansBold, fontSize: 11, fontWeight: '600', letterSpacing: 1 },
  macroVal: { fontFamily: fonts.sans, fontSize: 12.5, fontWeight: '600' },
  macroBar: { height: 6, borderRadius: 3, overflow: 'hidden' },

  weekCard: { borderRadius: radius.lg, padding: 16, marginTop: 12 },
  weekHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 },
  weekTitle: { fontFamily: fonts.serifMedium, fontSize: 15 },
  weekKicker: { fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 1.2, fontWeight: '600' },
  weekRemain: { fontFamily: fonts.serifMedium, fontSize: 15 },
  weekRemainUnit: { fontFamily: fonts.sans, fontSize: 11, fontWeight: '500' },
  weekRings: { flexDirection: 'row', gap: 6, paddingVertical: 4 },
  weekFeedback: { fontFamily: fonts.sans, fontSize: 12.5, marginTop: 10 },

  quickStrip: { flexDirection: 'row', gap: 12, marginTop: 12 },
  miniCard: { flex: 1, borderRadius: radius.md, padding: 14, gap: 4 },
  miniIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  miniValue: { fontFamily: fonts.serifMedium, fontSize: 22 },
  miniLabel: { fontFamily: fonts.sans, fontSize: 11.5 },

  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 22, marginBottom: 10 },
  sectionTitle: { fontFamily: fonts.serifMedium, fontSize: 18 },
  sectionLink: { fontFamily: fonts.sansBold, fontSize: 12.5, fontWeight: '500' },

  recipeCard: { borderRadius: radius.lg, overflow: 'hidden' },
  recipeImg: { height: 130, position: 'relative' },
  recipeTag: {
    position: 'absolute', top: 12, left: 12,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  recipeTagText: { fontFamily: fonts.sansBold, fontSize: 10, fontWeight: '600', letterSpacing: 0.6, textTransform: 'uppercase' },
  recipeBody: { padding: 14 },
  recipeTitle: { fontFamily: fonts.serifMedium, fontSize: 18, marginBottom: 4 },
  recipeMeta: { fontFamily: fonts.sans, fontSize: 12 },

  hackCard: { flexDirection: 'row', gap: 14, padding: 16, borderRadius: radius.lg, alignItems: 'flex-start' },
  hackNum: { fontFamily: fonts.serifMedium, fontSize: 26, opacity: 0.85 },
  hackTitle: { fontFamily: fonts.serifMedium, fontSize: 15, marginBottom: 4 },
  hackBody: { fontFamily: fonts.sans, fontSize: 12.5, lineHeight: 18, opacity: 0.85 },
});
