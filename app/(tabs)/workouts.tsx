import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { fonts, radius, spacing } from '@/constants/theme';
import { WORKOUTS, workoutOfDay } from '@/lib/workouts';
import { HACKS } from '@/lib/hacks';

export default function WorkoutsScreen() {
  const { colors } = useTheme();
  const featured = workoutOfDay();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <Text style={[styles.title, { color: colors.ink }]}>Workouts & Hacks</Text>
          <Text style={[styles.sub, { color: colors.inkMute }]}>
            Kein Studio, kein Equipment — jedes Workout in unter 20 Min umsetzbar.
          </Text>
        </View>

        {/* Empfehlung des Tages */}
        <Text style={[styles.sectionKicker, { color: colors.inkMute }]}>HEUTE EMPFOHLEN</Text>
        <Pressable
          style={[styles.featured, { backgroundColor: colors.brand }]}
          onPress={() => router.push(`/workout/${featured.id}`)}
        >
          <Text style={[styles.featuredEmoji]}>{featured.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.featuredTitle, { color: colors.brandInk }]}>{featured.title}</Text>
            <Text style={[styles.featuredMeta, { color: colors.brandInk + 'CC' }]}>
              {featured.minutes} Min · {featured.level} · ~{featured.kcalEstimate} kcal
            </Text>
          </View>
          <Text style={[styles.featuredArrow, { color: colors.brandInk }]}>›</Text>
        </Pressable>

        {/* Workout-Liste */}
        <Text style={[styles.sectionTitle, { color: colors.ink }]}>Alle Workouts</Text>
        <View style={styles.grid}>
          {WORKOUTS.map((w) => (
            <Pressable
              key={w.id}
              style={[styles.card, { backgroundColor: colors.surface }]}
              onPress={() => router.push(`/workout/${w.id}`)}
            >
              <Text style={styles.cardEmoji}>{w.emoji}</Text>
              <Text style={[styles.cardTitle, { color: colors.ink }]}>{w.title}</Text>
              <Text style={[styles.cardMeta, { color: colors.inkMute }]}>
                {w.minutes} Min · {w.level}
              </Text>
              <View style={styles.kcalPill}>
                <Text style={[styles.kcalPillText, { color: colors.accent }]}>
                  ~{w.kcalEstimate} kcal
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Hacks */}
        <Text style={[styles.sectionTitle, { color: colors.ink, marginTop: 24 }]}>
          Alltags-Hacks
        </Text>
        {HACKS.map((h) => (
          <View key={h.id} style={[styles.hackCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.hackNum, { color: colors.accent }]}>{h.number}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.hackTitle, { color: colors.ink }]}>{h.title}</Text>
              <Text style={[styles.hackBody, { color: colors.inkSoft }]}>{h.body}</Text>
            </View>
          </View>
        ))}

        <Text style={[styles.footNote, { color: colors.inkMute }]}>
          Tipp: 3–4× die Woche reicht. Regeneration ist Teil des Trainings.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.xl, paddingBottom: 40 },
  head: { marginBottom: 18 },
  title: { fontFamily: fonts.serifMedium, fontSize: 28 },
  sub: { fontFamily: fonts.sans, fontSize: 13, marginTop: 4, lineHeight: 18 },

  sectionKicker: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: fonts.serifMedium,
    fontSize: 18,
    marginTop: 8,
    marginBottom: 10,
  },

  featured: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: radius.lg,
    gap: 14,
    marginBottom: 6,
  },
  featuredEmoji: { fontSize: 34 },
  featuredTitle: { fontFamily: fonts.serifMedium, fontSize: 18 },
  featuredMeta: { fontFamily: fonts.sans, fontSize: 12.5, marginTop: 2 },
  featuredArrow: { fontSize: 26, fontFamily: fonts.serif },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '48%',
    padding: 14,
    borderRadius: radius.md,
    gap: 4,
  },
  cardEmoji: { fontSize: 26, marginBottom: 4 },
  cardTitle: { fontFamily: fonts.serifMedium, fontSize: 15 },
  cardMeta: { fontFamily: fonts.sans, fontSize: 11.5 },
  kcalPill: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
    backgroundColor: 'rgba(217,106,59,0.14)',
  },
  kcalPillText: {
    fontFamily: fonts.sansBold,
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  hackCard: {
    flexDirection: 'row',
    gap: 14,
    padding: 14,
    borderRadius: radius.md,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  hackNum: { fontFamily: fonts.serifMedium, fontSize: 22, opacity: 0.85 },
  hackTitle: { fontFamily: fonts.serifMedium, fontSize: 14 },
  hackBody: { fontFamily: fonts.sans, fontSize: 12.5, marginTop: 2, lineHeight: 17 },

  footNote: {
    fontFamily: fonts.sans,
    fontSize: 11.5,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 18,
    paddingHorizontal: 16,
  },
});
