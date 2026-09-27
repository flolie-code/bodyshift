import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { fonts, radius, spacing } from '@/constants/theme';
import { FadeInView } from '@/components/FadeInView';
import { AnimatedPress } from '@/components/AnimatedPress';
import {
  HACKS,
  CATEGORY_META,
  hacksByCategory,
  type HackCategory,
} from '@/lib/hacks';

const CATEGORIES: (HackCategory | 'all')[] = [
  'all',
  'stoffwechsel',
  'blutzucker',
  'saettigung',
  'bewegung',
  'schlaf',
  'wasser',
  'protein',
  'timing',
  'mental',
  'kaelte',
];

export default function HacksScreen() {
  const { colors } = useTheme();
  const [selected, setSelected] = useState<HackCategory | 'all'>('all');

  const list = useMemo(() => {
    if (selected === 'all') return HACKS;
    return hacksByCategory(selected);
  }, [selected]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={[styles.back, { color: colors.brand }]}>← Zurueck</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.ink }]}>Alltags-Hacks</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.introBlock}>
        <Text style={[styles.introHead, { color: colors.ink }]}>
          {HACKS.length} kleine Kniffe
        </Text>
        <Text style={[styles.introSub, { color: colors.inkMute }]}>
          Wissenschaftlich fundiert, sofort im Alltag umsetzbar. Kein Equipment, kein Zeitfresser.
        </Text>
      </View>

      {/* Kategorie-Filter */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterStrip}
        >
          {CATEGORIES.map((key) => {
            const active = selected === key;
            const label = key === 'all' ? 'Alle' : CATEGORY_META[key].label;
            const emoji = key === 'all' ? '✨' : CATEGORY_META[key].emoji;
            return (
              <AnimatedPress
                key={key}
                onPress={() => setSelected(key)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.brand : colors.surface,
                    borderColor: active ? colors.brand : colors.line,
                  },
                ]}
              >
                <Text style={{ fontSize: 13 }}>{emoji}</Text>
                <Text
                  style={[
                    styles.chipText,
                    { color: active ? colors.brandInk : colors.ink },
                  ]}
                >
                  {label}
                </Text>
              </AnimatedPress>
            );
          })}
        </ScrollView>
      </View>

      {/* Wenn Kategorie: Tagline zeigen */}
      {selected !== 'all' && (
        <View style={styles.catHeader}>
          <Text style={[styles.catTagline, { color: colors.inkSoft }]}>
            {CATEGORY_META[selected].tagline}
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {list.map((h, i) => (
          <FadeInView key={h.id} delay={Math.min(i * 30, 300)}>
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={styles.cardHead}>
                <Text style={[styles.num, { color: colors.accent }]}>{h.number}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.hackTitle, { color: colors.ink }]}>{h.title}</Text>
                  <Text style={[styles.body, { color: colors.inkSoft }]}>{h.body}</Text>
                </View>
              </View>
              <View style={styles.footer}>
                <View style={[styles.pill, { backgroundColor: colors.accentSoft }]}>
                  <Text style={[styles.pillText, { color: colors.accent }]}>
                    {h.effect}
                  </Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={[styles.meta, { color: colors.inkMute }]}>
                    {CATEGORY_META[h.category].emoji} {CATEGORY_META[h.category].label}
                  </Text>
                  {h.effortMinutes > 0 && (
                    <Text style={[styles.meta, { color: colors.inkMute }]}>
                      · ⏱ {h.effortMinutes} Min
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </FadeInView>
        ))}
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

  introBlock: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 12,
  },
  introHead: {
    fontFamily: fonts.serifMedium,
    fontSize: 26,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  introSub: {
    fontFamily: fonts.sans,
    fontSize: 13.5,
    lineHeight: 19,
    maxWidth: 460,
  },

  filterBar: { height: 46, justifyContent: 'center' },
  filterStrip: {
    paddingHorizontal: spacing.xl,
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    alignSelf: 'center',
  },
  chipText: { fontFamily: fonts.sansBold, fontSize: 13, fontWeight: '500' },

  catHeader: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 4,
  },
  catTagline: {
    fontFamily: fonts.sans,
    fontSize: 12.5,
    fontStyle: 'italic',
  },

  scroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
    gap: 10,
    paddingTop: 8,
  },

  card: {
    padding: 16,
    borderRadius: radius.lg,
    gap: 12,
  },
  cardHead: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  num: {
    fontFamily: fonts.serifMedium,
    fontSize: 22,
    minWidth: 30,
    opacity: 0.85,
  },
  hackTitle: {
    fontFamily: fonts.serifMedium,
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 6,
  },
  body: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 19 },

  footer: { gap: 8 },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  pillText: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  metaRow: { flexDirection: 'row', gap: 4 },
  meta: {
    fontFamily: fonts.sans,
    fontSize: 11,
  },
});
