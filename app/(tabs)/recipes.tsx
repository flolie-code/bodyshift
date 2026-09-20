import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { fonts, radius, spacing } from '@/constants/theme';
import { listRecipes, type Recipe } from '@/lib/recipes';

const CATEGORIES = [
  { key: null, label: 'Alle' },
  { key: 'Frühstück', label: '🥣 Frühstück' },
  { key: 'Mittagessen', label: '🥗 Mittag' },
  { key: 'Abendessen', label: '🍽️ Abend' },
  { key: 'Snack', label: '🍎 Snack' },
] as const;

const TAG_QUICK = [
  { key: 'eiweißreich', label: '🥩 Eiweißreich' },
  { key: 'schnell', label: '⚡ Schnell' },
  { key: 'vegetarisch', label: '🌱 Veggie' },
  { key: 'low-carb', label: '🥗 Low Carb' },
] as const;

export default function RecipesScreen() {
  const { colors } = useTheme();
  const [category, setCategory] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      const list = await listRecipes({
        category: category ?? undefined,
        tag: tag ?? undefined,
        limit: 100,
      });
      setRecipes(list);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
  }, [category, tag]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.head}>
        <Text style={[styles.title, { color: colors.ink }]}>Rezepte</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stripPad}
      >
        {CATEGORIES.map((c) => (
          <FilterPill
            key={c.label}
            label={c.label}
            active={category === c.key}
            onPress={() => setCategory(c.key)}
            colors={colors}
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.stripPad, { paddingBottom: 4 }]}
      >
        {TAG_QUICK.map((t) => (
          <FilterPill
            key={t.key}
            label={t.label}
            active={tag === t.key}
            onPress={() => setTag(tag === t.key ? null : t.key)}
            colors={colors}
            subtle
          />
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.brand} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.protein }]}>{error}</Text>
          <Pressable style={[styles.retryBtn, { backgroundColor: colors.brand }]} onPress={load}>
            <Text style={[styles.retryText, { color: colors.brandInk }]}>Neu laden</Text>
          </Pressable>
        </View>
      ) : recipes.length === 0 ? (
        <View style={styles.center}>
          <Text style={[styles.emptyTitle, { color: colors.ink }]}>Noch keine Rezepte</Text>
          <Text style={[styles.emptyText, { color: colors.inkSoft }]}>
            Import läuft noch — schau später wieder rein, oder passe die Filter an.
          </Text>
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={{ gap: 12 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load();
              }}
              tintColor={colors.brand}
            />
          }
          renderItem={({ item }) => (
            <RecipeCard recipe={item} colors={colors} onPress={() => router.push(`/recipe/${item.slug}`)} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

function FilterPill({ label, active, onPress, colors, subtle }: {
  label: string; active: boolean; onPress: () => void; colors: any; subtle?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        {
          backgroundColor: active ? colors.brand : colors.surface,
          borderColor: active ? colors.brand : colors.line,
        },
      ]}
    >
      <Text style={[styles.pillText, { color: active ? colors.brandInk : colors.inkSoft }]}>
        {label}
      </Text>
    </Pressable>
  );
}

function RecipeCard({ recipe, colors, onPress }: { recipe: Recipe; colors: any; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={[styles.cardImg, { backgroundColor: colors.surfaceAlt }]}>
        {recipe.image_url ? (
          <Image
            source={recipe.image_url}
            style={styles.cardImgInner}
            contentFit="cover"
            transition={150}
          />
        ) : (
          <View style={styles.emojiFallback}>
            <Text style={styles.emojiText}>🍽️</Text>
          </View>
        )}
        {recipe.kcal != null && (
          <View style={styles.badgeKcal}>
            <Text style={[styles.badgeKcalText, { color: colors.brand }]}>{recipe.kcal} kcal</Text>
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={[styles.cardTitle, { color: colors.ink }]} numberOfLines={2}>
          {recipe.title}
        </Text>
        <Text style={[styles.cardMeta, { color: colors.inkMute }]}>
          {recipe.protein_g ? `${recipe.protein_g}g Protein` : ''}
          {recipe.minutes ? ` · ${recipe.minutes} Min` : ''}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  head: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: 4 },
  title: { fontFamily: fonts.serifMedium, fontSize: 28 },
  stripPad: { paddingHorizontal: spacing.xl, paddingVertical: 8, gap: 8, flexDirection: 'row' },
  pill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 100, borderWidth: 1 },
  pillText: { fontFamily: fonts.sansBold, fontSize: 12.5, fontWeight: '500' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.md },
  errorText: { fontFamily: fonts.sans, fontSize: 13, textAlign: 'center' },
  emptyTitle: { fontFamily: fonts.serifMedium, fontSize: 18 },
  emptyText: { fontFamily: fonts.sans, fontSize: 13, textAlign: 'center' },
  retryBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 100 },
  retryText: { fontFamily: fonts.sansBold, fontSize: 13, fontWeight: '600' },
  grid: { padding: spacing.xl, gap: 12 },
  card: { flex: 1, borderRadius: radius.md, overflow: 'hidden', marginBottom: 12 },
  cardImg: { height: 120, position: 'relative' },
  cardImgInner: { width: '100%', height: '100%' },
  emojiFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emojiText: { fontSize: 40 },
  badgeKcal: {
    position: 'absolute', top: 8, right: 8,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  badgeKcalText: { fontFamily: fonts.sansBold, fontSize: 10, fontWeight: '600' },
  cardBody: { padding: 12 },
  cardTitle: { fontFamily: fonts.serifMedium, fontSize: 14, lineHeight: 18, marginBottom: 4 },
  cardMeta: { fontFamily: fonts.sans, fontSize: 11 },
});
