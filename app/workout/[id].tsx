import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { fonts, radius, spacing } from '@/constants/theme';
import { getWorkout } from '@/lib/workouts';

export default function WorkoutDetail() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const workout = id ? getWorkout(id) : undefined;

  if (!workout) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={[styles.back, { color: colors.brand }]}>← Zurueck</Text>
          </Pressable>
          <View style={{ width: 60 }} />
          <View style={{ width: 60 }} />
        </View>
        <Text style={[styles.notFound, { color: colors.inkMute }]}>Workout nicht gefunden.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={[styles.back, { color: colors.brand }]}>← Zurueck</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.ink }]}>Workout</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: colors.brand }]}>
          <Text style={styles.heroEmoji}>{workout.emoji}</Text>
          <Text style={[styles.heroTitle, { color: colors.brandInk }]}>{workout.title}</Text>
          <View style={styles.heroMetaRow}>
            <MetaChip label="Dauer" value={`${workout.minutes} Min`} inkColor={colors.brandInk} />
            <MetaChip label="Level" value={workout.level} inkColor={colors.brandInk} />
            <MetaChip label="Verbrauch" value={`~${workout.kcalEstimate} kcal`} inkColor={colors.brandInk} />
          </View>
        </View>

        <Text style={[styles.intro, { color: colors.inkSoft }]}>{workout.intro}</Text>

        <Text style={[styles.sectionTitle, { color: colors.ink }]}>Ablauf</Text>
        {workout.exercises.map((ex, i) => (
          <View key={i} style={[styles.exCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.exNumberWrap, { backgroundColor: colors.accentSoft }]}>
              <Text style={[styles.exNumber, { color: colors.accent }]}>{i + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.exHead}>
                <Text style={[styles.exName, { color: colors.ink }]}>{ex.name}</Text>
                <Text style={[styles.exReps, { color: colors.brand }]}>{ex.reps}</Text>
              </View>
              <Text style={[styles.exDetail, { color: colors.inkMute }]}>{ex.detail}</Text>
            </View>
          </View>
        ))}

        <View style={[styles.tipCard, { backgroundColor: colors.accentSoft }]}>
          <Text style={[styles.tipLabel, { color: colors.accent }]}>💡 TIPP</Text>
          <Text style={[styles.tipBody, { color: colors.accent }]}>{workout.tip}</Text>
        </View>

        <Text style={[styles.footNote, { color: colors.inkMute }]}>
          Vor dem Start 2 Min locker aufwaermen, danach 3 Min ausatmen und dehnen.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetaChip({ label, value, inkColor }: { label: string; value: string; inkColor: string }) {
  return (
    <View style={styles.metaChip}>
      <Text style={[styles.metaChipLabel, { color: inkColor + 'B0' }]}>{label}</Text>
      <Text style={[styles.metaChipValue, { color: inkColor }]}>{value}</Text>
    </View>
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
  headerTitle: { fontFamily: fonts.serifMedium, fontSize: 17 },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 40 },
  notFound: { fontFamily: fonts.sans, fontSize: 14, textAlign: 'center', marginTop: 40 },

  hero: {
    borderRadius: radius.xl,
    padding: 22,
    alignItems: 'center',
    marginBottom: 14,
  },
  heroEmoji: { fontSize: 44 },
  heroTitle: { fontFamily: fonts.serifMedium, fontSize: 26, marginTop: 8 },
  heroMetaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  metaChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
  },
  metaChipLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 9,
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  metaChipValue: { fontFamily: fonts.sansBold, fontSize: 11.5, fontWeight: '600', marginTop: 2 },

  intro: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 4,
  },

  sectionTitle: { fontFamily: fonts.serifMedium, fontSize: 18, marginBottom: 10 },

  exCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: radius.md,
    marginBottom: 8,
    gap: 12,
    alignItems: 'flex-start',
  },
  exNumberWrap: {
    width: 32,
    height: 32,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exNumber: { fontFamily: fonts.serifMedium, fontSize: 14 },
  exHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 3,
  },
  exName: { fontFamily: fonts.serifMedium, fontSize: 15, flex: 1 },
  exReps: { fontFamily: fonts.sansBold, fontSize: 13, fontWeight: '600' },
  exDetail: { fontFamily: fonts.sans, fontSize: 12.5, lineHeight: 17 },

  tipCard: {
    padding: 16,
    borderRadius: radius.lg,
    marginTop: 8,
  },
  tipLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: '600',
    marginBottom: 6,
  },
  tipBody: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 19 },

  footNote: {
    fontFamily: fonts.sans,
    fontSize: 11.5,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 18,
    paddingHorizontal: 16,
  },
});
