import { useCallback, useEffect, useMemo, useState } from 'react';
import { FOODS, searchFoods, scaleFoodTo, type FoodItem } from '@/lib/foodDatabase';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { fonts, radius, spacing } from '@/constants/theme';
import {
  addMeal,
  calcDayTotals,
  deleteMeal,
  listMealsForDate,
  mealTypeIcon,
  mealTypeName,
  suggestMealType,
  type Meal,
  type MealType,
} from '@/lib/meals';

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function last7Days(): Date[] {
  const days: Date[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
}

export default function TrackerScreen() {
  const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMealType, setModalMealType] = useState<MealType>(suggestMealType());

  const totals = useMemo(() => calcDayTotals(meals), [meals]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const list = await listMealsForDate(isoDate(selectedDate));
      setMeals(list);
    } catch (err) {
      Alert.alert('Fehler', (err as Error).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const mealsByType = useMemo(() => {
    const groups: Record<MealType, Meal[]> = { breakfast: [], lunch: [], dinner: [], snack: [] };
    meals.forEach((m) => groups[m.meal_type]?.push(m));
    return groups;
  }, [meals]);

  const handleAddPressed = (type: MealType) => {
    setModalMealType(type);
    setModalOpen(true);
  };

  const handleDelete = async (meal: Meal) => {
    Alert.alert('Löschen?', `„${meal.name}" wirklich löschen?`, [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Löschen',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMeal(meal.id);
            load();
          } catch (err) {
            Alert.alert('Fehler', (err as Error).message);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
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
      >
        <View style={styles.head}>
          <Text style={[styles.title, { color: colors.ink }]}>
            {isSameDay(selectedDate, new Date()) ? 'Heute' : formatDate(selectedDate)}
          </Text>
          <Text style={[styles.subtitle, { color: colors.inkMute }]}>
            {totals.kcal.toLocaleString('de-AT')} kcal · P {Math.round(totals.protein)}g ·
            C {Math.round(totals.carbs)}g · F {Math.round(totals.fat)}g
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateStrip}
        >
          {last7Days().map((d) => {
            const isSel = isSameDay(d, selectedDate);
            return (
              <Pressable
                key={d.toISOString()}
                onPress={() => setSelectedDate(d)}
                style={[
                  styles.dayCell,
                  {
                    backgroundColor: isSel ? colors.brand : colors.surface,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dayWd,
                    { color: isSel ? colors.brandInk + 'B3' : colors.inkMute },
                  ]}
                >
                  {['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][d.getDay()]}
                </Text>
                <Text style={[styles.dayNum, { color: isSel ? colors.brandInk : colors.ink }]}>
                  {d.getDate()}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {MEAL_TYPES.map((type) => (
          <MealBlock
            key={type}
            type={type}
            meals={mealsByType[type]}
            colors={colors}
            onAdd={() => handleAddPressed(type)}
            onDelete={handleDelete}
          />
        ))}
      </ScrollView>

      <Pressable
        style={[styles.fab, { backgroundColor: colors.accent }]}
        onPress={() => router.push('/ki-foto')}
        accessibilityLabel="Mahlzeit per Foto scannen"
      >
        <Text style={styles.fabIcon}>📷</Text>
        <Text style={[styles.fabText, { color: colors.brandInk }]}>KI-Foto</Text>
      </Pressable>

      <AddMealModal
        visible={modalOpen}
        mealType={modalMealType}
        colors={colors}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          setModalOpen(false);
          load();
        }}
      />
    </SafeAreaView>
  );
}

function MealBlock({
  type,
  meals,
  colors,
  onAdd,
  onDelete,
}: {
  type: MealType;
  meals: Meal[];
  colors: any;
  onAdd: () => void;
  onDelete: (m: Meal) => void;
}) {
  const sumKcal = meals.reduce((s, m) => s + m.kcal, 0);
  return (
    <View style={[styles.mealBlock, { backgroundColor: colors.surface }]}>
      <View style={styles.mealHead}>
        <View style={styles.mealTitleWrap}>
          <Text style={styles.mealEmoji}>{mealTypeIcon(type)}</Text>
          <Text style={[styles.mealTitle, { color: colors.ink }]} numberOfLines={1}>
            {mealTypeName(type)}
          </Text>
        </View>
        <Text style={[styles.mealSum, { color: colors.brand }]}>
          {sumKcal}
          <Text style={{ color: colors.inkMute, fontSize: 11 }}> kcal</Text>
        </Text>
      </View>
      {meals.map((m) => (
        <Pressable
          key={m.id}
          onLongPress={() => onDelete(m)}
          style={[styles.foodRow, { borderTopColor: colors.lineSoft }]}
        >
          <Text style={styles.foodThumb}>🍽️</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.foodName, { color: colors.ink }]}>{m.name}</Text>
            <Text style={[styles.foodAmt, { color: colors.inkMute }]}>
              {m.amount_grams ? `${m.amount_grams}g` : ''}
              {m.protein_g ? ` · ${Math.round(Number(m.protein_g))}g Protein` : ''}
            </Text>
          </View>
          <Text style={[styles.foodKcal, { color: colors.inkSoft }]}>{m.kcal} kcal</Text>
        </Pressable>
      ))}
      <Pressable
        onPress={onAdd}
        style={[styles.addBtn, { backgroundColor: colors.surfaceAlt }]}
      >
        <Text style={[styles.addBtnText, { color: colors.brand }]}>＋ Hinzufügen</Text>
      </Pressable>
    </View>
  );
}

function AddMealModal({
  visible,
  mealType,
  colors,
  onClose,
  onSaved,
}: {
  visible: boolean;
  mealType: MealType;
  colors: any;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [query, setQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [grams, setGrams] = useState('');
  const [customName, setCustomName] = useState('');
  const [customKcal, setCustomKcal] = useState('');
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<'search' | 'custom'>('search');

  const suggestions = useMemo(() => searchFoods(query), [query]);
  const scaled = selectedFood && grams
    ? scaleFoodTo(selectedFood, Number(grams) || 0)
    : null;

  const reset = () => {
    setQuery('');
    setSelectedFood(null);
    setGrams('');
    setCustomName('');
    setCustomKcal('');
    setMode('search');
  };

  const selectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setGrams(String(food.defaultPortion ?? 100));
    setQuery('');
  };

  const save = async () => {
    setSaving(true);
    try {
      if (mode === 'custom') {
        if (!customName.trim() || !customKcal || Number(customKcal) <= 0) {
          Alert.alert('Fehlt', 'Bitte Name und Kalorien eingeben');
          setSaving(false);
          return;
        }
        await addMeal({
          name: customName.trim(),
          mealType,
          kcal: Number(customKcal),
          source: 'manual',
        });
      } else {
        if (!selectedFood || !scaled) {
          Alert.alert('Fehlt', 'Bitte ein Lebensmittel und die Menge auswaehlen');
          setSaving(false);
          return;
        }
        const g = Number(grams);
        await addMeal({
          name: `${selectedFood.name} (${g} g)`,
          mealType,
          kcal: scaled.kcal,
          proteinG: scaled.protein,
          carbsG: scaled.carbs,
          fatG: scaled.fat,
          amountGrams: g,
          source: 'manual',
        });
      }
      reset();
      onSaved();
    } catch (err) {
      Alert.alert('Fehler', (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.modalHead}>
            <Pressable onPress={onClose}>
              <Text style={[styles.modalClose, { color: colors.inkMute }]}>Abbrechen</Text>
            </Pressable>
            <Text style={[styles.modalTitle, { color: colors.ink }]}>
              {mealTypeIcon(mealType)} {mealTypeName(mealType)}
            </Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }} keyboardShouldPersistTaps="handled">
            {/* Mode-Toggle: Suche vs Freier Eintrag */}
            <View style={[styles.tabRow, { backgroundColor: colors.surfaceAlt }]}>
              <Pressable
                onPress={() => setMode('search')}
                style={[styles.tabBtn, mode === 'search' && { backgroundColor: colors.brand }]}
              >
                <Text style={[styles.tabBtnText, { color: mode === 'search' ? colors.brandInk : colors.inkSoft }]}>
                  🔍 Suchen
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setMode('custom')}
                style={[styles.tabBtn, mode === 'custom' && { backgroundColor: colors.brand }]}
              >
                <Text style={[styles.tabBtnText, { color: mode === 'custom' ? colors.brandInk : colors.inkSoft }]}>
                  ✏️ Eigener Eintrag
                </Text>
              </Pressable>
            </View>

            {mode === 'search' ? (
              <>
                {!selectedFood ? (
                  <>
                    <TextInput
                      style={[styles.input, { color: colors.ink, backgroundColor: colors.surface, borderColor: colors.line }]}
                      placeholder="z.B. Skyr, Haferflocken, Apfel..."
                      placeholderTextColor={colors.inkMute}
                      value={query}
                      onChangeText={setQuery}
                      autoFocus
                      autoCapitalize="none"
                    />

                    {suggestions.length > 0 ? (
                      <View style={[styles.suggestList, { backgroundColor: colors.surface }]}>
                        {suggestions.map((f, i) => (
                          <Pressable
                            key={f.id}
                            onPress={() => selectFood(f)}
                            style={[
                              styles.suggestRow,
                              i > 0 && { borderTopColor: colors.lineSoft, borderTopWidth: 1 },
                            ]}
                          >
                            <Text style={{ fontSize: 20 }}>{f.emoji ?? '🍽️'}</Text>
                            <View style={{ flex: 1 }}>
                              <Text style={[styles.suggestName, { color: colors.ink }]}>{f.name}</Text>
                              <Text style={[styles.suggestMeta, { color: colors.inkMute }]}>
                                {f.kcalPer100} kcal · {f.proteinPer100}g Protein pro 100g
                              </Text>
                            </View>
                            <Text style={[styles.suggestArrow, { color: colors.brand }]}>›</Text>
                          </Pressable>
                        ))}
                      </View>
                    ) : query.length >= 2 ? (
                      <View style={[styles.emptyCard, { backgroundColor: colors.surfaceAlt }]}>
                        <Text style={[styles.emptyText, { color: colors.inkSoft }]}>
                          Kein Treffer. Probier einen anderen Begriff oder wechsle zu "Eigener Eintrag".
                        </Text>
                      </View>
                    ) : (
                      <View style={[styles.emptyCard, { backgroundColor: colors.surfaceAlt }]}>
                        <Text style={[styles.emptyText, { color: colors.inkSoft }]}>
                          Tippe mindestens 2 Buchstaben. Die App kennt {FOODS.length}+ Lebensmittel.
                        </Text>
                      </View>
                    )}
                  </>
                ) : (
                  <>
                    {/* Ausgewaehltes Lebensmittel + Portions-Auswahl */}
                    <View style={[styles.selectedCard, { backgroundColor: colors.surface }]}>
                      <View style={styles.selectedHead}>
                        <Text style={{ fontSize: 30 }}>{selectedFood.emoji ?? '🍽️'}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.selectedName, { color: colors.ink }]}>{selectedFood.name}</Text>
                          <Text style={[styles.selectedMeta, { color: colors.inkMute }]}>
                            {selectedFood.kcalPer100} kcal / 100 g
                          </Text>
                        </View>
                        <Pressable onPress={() => setSelectedFood(null)} hitSlop={10}>
                          <Text style={[styles.changeText, { color: colors.brand }]}>Aendern</Text>
                        </Pressable>
                      </View>

                      <Text style={[styles.label, { color: colors.inkMute, marginTop: 12 }]}>
                        WIE VIEL (in Gramm)
                      </Text>
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                        {[50, 100, selectedFood.defaultPortion ?? 150, 200, 300].filter((v, i, a) => a.indexOf(v) === i).map((g) => (
                          <Pressable
                            key={g}
                            onPress={() => setGrams(String(g))}
                            style={[
                              styles.gramChip,
                              {
                                backgroundColor: Number(grams) === g ? colors.brand : colors.surfaceAlt,
                              },
                            ]}
                          >
                            <Text style={[styles.gramChipText, { color: Number(grams) === g ? colors.brandInk : colors.ink }]}>
                              {g}g
                            </Text>
                          </Pressable>
                        ))}
                      </View>

                      <TextInput
                        style={[styles.input, { color: colors.ink, backgroundColor: colors.surfaceAlt, borderColor: colors.line, marginTop: 10 }]}
                        placeholder="Eigene Menge in Gramm"
                        placeholderTextColor={colors.inkMute}
                        value={grams}
                        onChangeText={setGrams}
                        keyboardType="number-pad"
                      />

                      {scaled && (
                        <View style={[styles.scaledPreview, { backgroundColor: colors.accentSoft }]}>
                          <Text style={[styles.scaledKcal, { color: colors.accent }]}>
                            {scaled.kcal} kcal
                          </Text>
                          <Text style={[styles.scaledMacros, { color: colors.accent }]}>
                            P {scaled.protein}g · K {scaled.carbs}g · F {scaled.fat}g
                          </Text>
                        </View>
                      )}
                    </View>
                  </>
                )}
              </>
            ) : (
              <>
                {/* Eigener Eintrag Mode */}
                <Text style={[styles.label, { color: colors.inkMute }]}>Name *</Text>
                <TextInput
                  style={[styles.input, { color: colors.ink, backgroundColor: colors.surface, borderColor: colors.line }]}
                  placeholder="z.B. Oma's Apfelstrudel"
                  placeholderTextColor={colors.inkMute}
                  value={customName}
                  onChangeText={setCustomName}
                  autoCapitalize="sentences"
                />

                <Text style={[styles.label, { color: colors.inkMute, marginTop: 8 }]}>Kalorien *</Text>
                <TextInput
                  style={[styles.input, { color: colors.ink, backgroundColor: colors.surface, borderColor: colors.line }]}
                  placeholder="0"
                  placeholderTextColor={colors.inkMute}
                  value={customKcal}
                  onChangeText={setCustomKcal}
                  keyboardType="number-pad"
                />
              </>
            )}

            <Pressable
              onPress={save}
              disabled={saving || (mode === 'search' && !selectedFood)}
              style={[
                styles.saveBtn,
                {
                  backgroundColor: colors.brand,
                  opacity: (mode === 'search' && !selectedFood) || saving ? 0.5 : 1,
                },
              ]}
            >
              <Text style={[styles.saveBtnText, { color: colors.brandInk }]}>
                {saving ? 'Speichere...' : 'Hinzufuegen'}
              </Text>
            </Pressable>

            <Text style={[styles.hint, { color: colors.inkMute }]}>
              Tipp: Fuer Fertigprodukte oder Rezepte gehts noch schneller ueber den 📷 KI-Foto-Button.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

function isSameDay(a: Date, b: Date): boolean {
  return isoDate(a) === isoDate(b);
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('de-AT', { weekday: 'long', day: 'numeric', month: 'long' });
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  head: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: 4 },
  title: { fontFamily: fonts.serifMedium, fontSize: 28 },
  subtitle: { fontFamily: fonts.sans, fontSize: 12.5, marginTop: 2 },
  dateStrip: { paddingHorizontal: spacing.xl, gap: 6, paddingVertical: 12 },
  dayCell: {
    width: 44, paddingVertical: 8, borderRadius: 12,
    alignItems: 'center', gap: 2,
  },
  dayWd: { fontFamily: fonts.sansBold, fontSize: 10.5, fontWeight: '600', letterSpacing: 0.5 },
  dayNum: { fontFamily: fonts.serifMedium, fontSize: 17 },

  mealBlock: {
    marginHorizontal: spacing.xl, marginBottom: 12,
    padding: 14, borderRadius: radius.lg,
  },
  mealHead: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10, gap: 8,
  },
  mealTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  mealEmoji: { fontSize: 20 },
  mealTitle: { fontFamily: fonts.serifMedium, fontSize: 16, flexShrink: 1 },
  mealSum: { fontFamily: fonts.serifMedium, fontSize: 15 },
  foodRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 8, borderTopWidth: 1,
  },
  foodThumb: { fontSize: 20 },
  foodName: { fontFamily: fonts.sansBold, fontSize: 13.5, fontWeight: '500' },
  foodAmt: { fontFamily: fonts.sans, fontSize: 11.5, marginTop: 1 },
  foodKcal: { fontFamily: fonts.sansBold, fontSize: 13, fontWeight: '500' },
  addBtn: {
    marginTop: 6, padding: 10, borderRadius: 10, alignItems: 'center',
  },
  addBtnText: { fontFamily: fonts.sansBold, fontSize: 13, fontWeight: '500' },

  modalHead: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
  },
  modalClose: { fontFamily: fonts.sans, fontSize: 15, width: 60 },
  modalTitle: { fontFamily: fonts.serifMedium, fontSize: 17 },
  label: { fontFamily: fonts.sansBold, fontSize: 11, letterSpacing: 1, fontWeight: '600' },
  input: {
    fontFamily: fonts.sans, fontSize: 15,
    borderWidth: 1, borderRadius: radius.md,
    paddingHorizontal: 14, paddingVertical: 12,
  },
  saveBtn: {
    marginTop: spacing.lg, paddingVertical: 16,
    borderRadius: 100, alignItems: 'center',
  },
  saveBtnText: { fontFamily: fonts.sansBold, fontSize: 15, fontWeight: '600' },
  hint: {
    fontFamily: fonts.sans, fontSize: 11.5, textAlign: 'center',
    marginTop: 8, lineHeight: 16,
  },
  tabRow: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 100,
    gap: 4,
    marginBottom: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 100,
    alignItems: 'center',
  },
  tabBtnText: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '600',
  },
  suggestList: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  suggestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  suggestName: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '600',
  },
  suggestMeta: {
    fontFamily: fonts.sans,
    fontSize: 11.5,
    marginTop: 2,
  },
  suggestArrow: {
    fontFamily: fonts.serif,
    fontSize: 22,
  },
  emptyCard: {
    padding: 20,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  selectedCard: {
    padding: 16,
    borderRadius: radius.lg,
  },
  selectedHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectedName: {
    fontFamily: fonts.serifMedium,
    fontSize: 17,
  },
  selectedMeta: {
    fontFamily: fonts.sans,
    fontSize: 12,
    marginTop: 2,
  },
  changeText: {
    fontFamily: fonts.sansBold,
    fontSize: 12.5,
    fontWeight: '600',
  },
  gramChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 100,
    alignItems: 'center',
  },
  gramChipText: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '600',
  },
  scaledPreview: {
    marginTop: 14,
    padding: 12,
    borderRadius: radius.md,
    alignItems: 'center',
    gap: 2,
  },
  scaledKcal: {
    fontFamily: fonts.serifMedium,
    fontSize: 24,
  },
  scaledMacros: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  fabIcon: { fontSize: 16 },
  fabText: { fontFamily: fonts.sansBold, fontSize: 14, fontWeight: '600' },
});
