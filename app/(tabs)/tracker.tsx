import { useCallback, useEffect, useMemo, useState } from 'react';
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
        <Text style={[styles.mealTitle, { color: colors.ink }]}>
          {mealTypeIcon(type)} {mealTypeName(type)}
        </Text>
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
  const [name, setName] = useState('');
  const [kcal, setKcal] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setName('');
    setKcal('');
    setProtein('');
    setCarbs('');
    setFat('');
  };

  const save = async () => {
    if (!name.trim()) {
      Alert.alert('Fehlt', 'Bitte Namen eingeben');
      return;
    }
    const kcalNum = Number(kcal);
    if (!kcalNum || kcalNum <= 0) {
      Alert.alert('Fehlt', 'Bitte Kalorien eingeben');
      return;
    }
    setSaving(true);
    try {
      await addMeal({
        name: name.trim(),
        mealType,
        kcal: kcalNum,
        proteinG: protein ? Number(protein) : undefined,
        carbsG: carbs ? Number(carbs) : undefined,
        fatG: fat ? Number(fat) : undefined,
        source: 'manual',
      });
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

          <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
            <Text style={[styles.label, { color: colors.inkMute }]}>Was hast du gegessen?</Text>
            <TextInput
              style={[styles.input, { color: colors.ink, backgroundColor: colors.surface, borderColor: colors.line }]}
              placeholder="z.B. Skyr mit Beeren"
              placeholderTextColor={colors.inkMute}
              value={name}
              onChangeText={setName}
              autoCapitalize="sentences"
            />

            <Text style={[styles.label, { color: colors.inkMute, marginTop: 8 }]}>Kalorien *</Text>
            <TextInput
              style={[styles.input, { color: colors.ink, backgroundColor: colors.surface, borderColor: colors.line }]}
              placeholder="0"
              placeholderTextColor={colors.inkMute}
              value={kcal}
              onChangeText={setKcal}
              keyboardType="number-pad"
            />

            <Text style={[styles.label, { color: colors.inkMute, marginTop: 8 }]}>Makros (optional)</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                style={[styles.input, { flex: 1, color: colors.ink, backgroundColor: colors.surface, borderColor: colors.line }]}
                placeholder="Protein g"
                placeholderTextColor={colors.inkMute}
                value={protein}
                onChangeText={setProtein}
                keyboardType="decimal-pad"
              />
              <TextInput
                style={[styles.input, { flex: 1, color: colors.ink, backgroundColor: colors.surface, borderColor: colors.line }]}
                placeholder="Carbs g"
                placeholderTextColor={colors.inkMute}
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="decimal-pad"
              />
              <TextInput
                style={[styles.input, { flex: 1, color: colors.ink, backgroundColor: colors.surface, borderColor: colors.line }]}
                placeholder="Fett g"
                placeholderTextColor={colors.inkMute}
                value={fat}
                onChangeText={setFat}
                keyboardType="decimal-pad"
              />
            </View>

            <Pressable
              onPress={save}
              disabled={saving}
              style={[styles.saveBtn, { backgroundColor: colors.brand }]}
            >
              <Text style={[styles.saveBtnText, { color: colors.brandInk }]}>
                {saving ? 'Speichere...' : 'Hinzufügen'}
              </Text>
            </Pressable>

            <Text style={[styles.hint, { color: colors.inkMute }]}>
              Tipp: Später kannst du via KI-Foto, Barcode-Scan oder Sprache erfassen.
              Manueller Eintrag geht schon jetzt.
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
    alignItems: 'baseline', marginBottom: 10,
  },
  mealTitle: { fontFamily: fonts.serifMedium, fontSize: 16 },
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
