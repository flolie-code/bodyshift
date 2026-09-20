import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { getRecipe, type Recipe } from '@/lib/recipes';
import { useTheme } from '@/hooks/useTheme';
import { fonts, radius, spacing } from '@/constants/theme';

export default function RecipeDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { colors } = useTheme();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getRecipe(slug)
      .then(setRecipe)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <ActivityIndicator color={colors.brand} />
      </View>
    );
  }
  if (!recipe) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.bg }]}>
        <Text style={[styles.notFoundTitle, { color: colors.ink }]}>Rezept nicht gefunden</Text>
        <Pressable style={[styles.btn, { backgroundColor: colors.brand }]} onPress={() => router.back()}>
          <Text style={[styles.btnText, { color: colors.brandInk }]}>Zurück</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.hero}>
          {recipe.image_url ? (
            <Image source={recipe.image_url} style={StyleSheet.absoluteFill} contentFit="cover" />
          ) : (
            <LinearGradient
              colors={['#C67A50', '#E4A87A']}
              style={StyleSheet.absoluteFill}
            />
          )}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={StyleSheet.absoluteFill}
            locations={[0.4, 1]}
          />
          <SafeAreaView style={styles.heroSafe}>
            <View style={styles.heroTop}>
              <Pressable style={styles.iconBtn} onPress={() => router.back()}>
                <Text style={styles.iconBtnText}>←</Text>
              </Pressable>
            </View>
            <View style={styles.heroBottom}>
              <Text style={styles.heroTitle}>{recipe.title}</Text>
              <View style={styles.heroTagRow}>
                {recipe.category && <HeroTag>{recipe.category}</HeroTag>}
                {recipe.minutes && <HeroTag>{recipe.minutes} Min</HeroTag>}
                {recipe.tags?.slice(0, 2).map((t) => <HeroTag key={t}>{t}</HeroTag>)}
              </View>
            </View>
          </SafeAreaView>
        </View>

        <View style={[styles.body, { backgroundColor: colors.bg }]}>
          <View style={styles.nutritionStrip}>
            <NutritionStat n={recipe.kcal} label="kcal" color={colors.brand} bg={colors.surface} />
            <NutritionStat n={recipe.protein_g} label="Protein" unit="g" color={colors.protein} bg={colors.surface} />
            <NutritionStat n={recipe.carbs_g} label="Carbs" unit="g" color={colors.carbs} bg={colors.surface} />
            <NutritionStat n={recipe.fat_g} label="Fett" unit="g" color={colors.fat} bg={colors.surface} />
          </View>

          <SectionTitle colors={colors}>Zutaten</SectionTitle>
          <View style={styles.ingredientList}>
            {(recipe.ingredients ?? []).map((ing, i) => (
              <View key={i} style={[styles.ingredientRow, { borderBottomColor: colors.lineSoft }]}>
                <Text style={[styles.ingredientName, { color: colors.ink }]}>{ing.name}</Text>
                <Text style={[styles.ingredientAmt, { color: colors.inkMute }]}>
                  {ing.amount} {ing.unit}
                </Text>
              </View>
            ))}
          </View>

          <SectionTitle colors={colors}>Zubereitung</SectionTitle>
          <View style={{ gap: 14 }}>
            {(recipe.steps ?? []).map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <Text style={[styles.stepNum, { color: colors.brand }]}>{i + 1}.</Text>
                <Text style={[styles.stepText, { color: colors.inkSoft }]}>{step}</Text>
              </View>
            ))}
          </View>

          <Pressable style={[styles.addBtn, { backgroundColor: colors.accent }]}>
            <Text style={styles.addBtnText}>＋ Zum Tagebuch hinzufügen</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function HeroTag({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.heroTag}>
      <Text style={styles.heroTagText}>{children}</Text>
    </View>
  );
}
function NutritionStat({ n, label, unit = '', color, bg }: { n: number | null; label: string; unit?: string; color: string; bg: string }) {
  return (
    <View style={[styles.nStat, { backgroundColor: bg }]}>
      <Text style={[styles.nStatVal, { color }]}>{n ?? '–'}{unit && n != null ? unit : ''}</Text>
      <Text style={styles.nStatLbl}>{label.toUpperCase()}</Text>
    </View>
  );
}
function SectionTitle({ children, colors }: { children: React.ReactNode; colors: any }) {
  return <Text style={[styles.sectionTitle, { color: colors.ink }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
  notFoundTitle: { fontFamily: fonts.serifMedium, fontSize: 20 },
  btn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 100 },
  btnText: { fontFamily: fonts.sansBold, fontSize: 14, fontWeight: '600' },
  hero: { height: 320, position: 'relative', overflow: 'hidden' },
  heroSafe: { flex: 1, padding: spacing.xl, justifyContent: 'space-between' },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between' },
  iconBtn: {
    width: 38, height: 38, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
  },
  iconBtnText: { fontSize: 18, fontWeight: '600', color: '#143A3F' },
  heroBottom: {},
  heroTitle: { fontFamily: fonts.serifMedium, fontSize: 24, color: '#fff', marginBottom: 8, lineHeight: 30 },
  heroTagRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  heroTag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.2)' },
  heroTagText: { fontFamily: fonts.sans, fontSize: 11, fontWeight: '500', color: '#fff' },
  body: { marginTop: -22, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.xl },
  nutritionStrip: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  nStat: { flex: 1, borderRadius: 12, padding: 10, alignItems: 'center' },
  nStatVal: { fontFamily: fonts.serifMedium, fontSize: 16 },
  nStatLbl: { fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 0.8, color: '#8A928E', marginTop: 2, fontWeight: '600' },
  sectionTitle: { fontFamily: fonts.serifMedium, fontSize: 18, marginTop: 20, marginBottom: 10 },
  ingredientList: {},
  ingredientRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 12, borderBottomWidth: 1,
  },
  ingredientName: { fontFamily: fonts.sans, fontSize: 14 },
  ingredientAmt: { fontFamily: fonts.sans, fontSize: 13 },
  stepRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  stepNum: { fontFamily: fonts.serifMedium, fontSize: 16, minWidth: 24 },
  stepText: { flex: 1, fontFamily: fonts.sans, fontSize: 14, lineHeight: 20 },
  addBtn: { marginTop: spacing.xl, paddingVertical: 16, borderRadius: 100, alignItems: 'center' },
  addBtnText: { fontFamily: fonts.sansBold, fontSize: 14, fontWeight: '600', color: '#fff' },
});
