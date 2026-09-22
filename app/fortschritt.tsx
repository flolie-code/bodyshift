import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Polyline, Line, Circle, Text as SvgText } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { fonts, radius, spacing } from '@/constants/theme';
import {
  listWeightEntries,
  upsertWeight,
  deleteWeight,
  calcWeightStats,
  type WeightEntry,
} from '@/lib/weight';

export default function FortschrittScreen() {
  const { colors } = useTheme();
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listWeightEntries(180);
      setEntries(list);
    } catch (e) {
      Alert.alert('Fehler', (e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = calcWeightStats(entries);

  async function save() {
    const kg = parseFloat(weightInput.replace(',', '.'));
    if (!kg || kg < 30 || kg > 300) {
      Alert.alert('Ungueltiges Gewicht', 'Bitte einen Wert zwischen 30 und 300 kg eingeben.');
      return;
    }
    setSaving(true);
    try {
      await upsertWeight({ weightKg: kg, note: noteInput.trim() || undefined });
      setModalOpen(false);
      setWeightInput('');
      setNoteInput('');
      await load();
    } catch (e) {
      Alert.alert('Speichern fehlgeschlagen', (e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete(entry: WeightEntry) {
    Alert.alert(
      'Eintrag loeschen?',
      `${entry.weight_kg} kg am ${entry.recorded_on}`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Loeschen',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteWeight(entry.id);
              await load();
            } catch (e) {
              Alert.alert('Fehler', (e as Error).message);
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={[styles.back, { color: colors.brand }]}>← Zurueck</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.ink }]}>Fortschritt</Text>
        <Pressable onPress={() => setModalOpen(true)} hitSlop={12}>
          <Text style={[styles.plus, { color: colors.brand }]}>+ Wiegen</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero: aktuelles Gewicht */}
        <View style={[styles.hero, { backgroundColor: colors.surface }]}>
          <Text style={[styles.heroLabel, { color: colors.inkMute }]}>AKTUELL</Text>
          {stats.latest != null ? (
            <>
              <Text style={[styles.heroBig, { color: colors.ink }]}>
                {stats.latest.toFixed(1)}
                <Text style={[styles.heroUnit, { color: colors.inkMute }]}> kg</Text>
              </Text>
              {stats.totalDelta != null && (
                <Text
                  style={[
                    styles.heroDelta,
                    { color: stats.totalDelta <= 0 ? colors.success : colors.protein },
                  ]}
                >
                  {stats.totalDelta > 0 ? '+' : ''}
                  {stats.totalDelta} kg seit Start
                </Text>
              )}
            </>
          ) : (
            <Text style={[styles.emptyHero, { color: colors.inkMute }]}>
              Noch kein Eintrag — leg mit &quot;+ Wiegen&quot; los.
            </Text>
          )}
        </View>

        {/* Stats-Row */}
        {stats.latest != null && (
          <View style={styles.statRow}>
            <StatBox
              label="7 Tage"
              value={stats.delta7 != null ? `${stats.delta7 > 0 ? '+' : ''}${stats.delta7} kg` : '—'}
              positive={stats.delta7 != null && stats.delta7 <= 0}
              colors={colors}
            />
            <StatBox
              label="30 Tage"
              value={stats.delta30 != null ? `${stats.delta30 > 0 ? '+' : ''}${stats.delta30} kg` : '—'}
              positive={stats.delta30 != null && stats.delta30 <= 0}
              colors={colors}
            />
            <StatBox
              label="Min – Max"
              value={
                stats.min != null && stats.max != null
                  ? `${stats.min.toFixed(1)}–${stats.max.toFixed(1)}`
                  : '—'
              }
              colors={colors}
            />
          </View>
        )}

        {/* Chart */}
        {entries.length >= 2 && (
          <View style={[styles.chartCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.chartTitle, { color: colors.ink }]}>Verlauf</Text>
            <WeightChart entries={entries} colors={colors} />
          </View>
        )}

        {/* Liste */}
        <Text style={[styles.listTitle, { color: colors.ink }]}>Alle Eintraege</Text>
        {loading ? (
          <ActivityIndicator color={colors.brand} style={{ marginVertical: 20 }} />
        ) : entries.length === 0 ? (
          <Text style={[styles.emptyList, { color: colors.inkMute }]}>
            Keine Eintraege — starte mit deinem ersten Wiegen.
          </Text>
        ) : (
          <View style={[styles.list, { backgroundColor: colors.surface }]}>
            {[...entries].reverse().map((e, i) => (
              <Pressable
                key={e.id}
                onLongPress={() => confirmDelete(e)}
                style={[
                  styles.listRow,
                  i > 0 && { borderTopColor: colors.lineSoft, borderTopWidth: 1 },
                ]}
              >
                <View>
                  <Text style={[styles.listWeight, { color: colors.ink }]}>
                    {e.weight_kg.toFixed(1)} kg
                  </Text>
                  {e.note && (
                    <Text style={[styles.listNote, { color: colors.inkMute }]}>{e.note}</Text>
                  )}
                </View>
                <Text style={[styles.listDate, { color: colors.inkMute }]}>{e.recorded_on}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Text style={[styles.hint, { color: colors.inkMute }]}>
          Tipp: Immer zur selben Zeit wiegen (morgens, nuechtern). Lang druecken zum Loeschen.
        </Text>
      </ScrollView>

      {/* Modal fuer neuen Eintrag */}
      <Modal visible={modalOpen} transparent animationType="slide" onRequestClose={() => setModalOpen(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setModalOpen(false)} />
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.ink }]}>Neues Gewicht</Text>
            <Text style={[styles.modalSub, { color: colors.inkMute }]}>
              Wert in kg — ein Eintrag pro Tag (aktualisiert den heutigen).
            </Text>
            <TextInput
              style={[
                styles.input,
                { color: colors.ink, borderColor: colors.line, backgroundColor: colors.surfaceAlt },
              ]}
              placeholder="z. B. 78,4"
              placeholderTextColor={colors.inkMute}
              value={weightInput}
              onChangeText={setWeightInput}
              keyboardType="decimal-pad"
              autoFocus
            />
            <TextInput
              style={[
                styles.input,
                { color: colors.ink, borderColor: colors.line, backgroundColor: colors.surfaceAlt },
              ]}
              placeholder="Notiz (optional)"
              placeholderTextColor={colors.inkMute}
              value={noteInput}
              onChangeText={setNoteInput}
            />
            <Pressable
              style={[styles.saveBtn, { backgroundColor: colors.brand }]}
              onPress={save}
              disabled={saving}
            >
              <Text style={[styles.saveBtnText, { color: colors.brandInk }]}>
                {saving ? 'Speichern...' : 'Speichern'}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

function StatBox({
  label,
  value,
  positive,
  colors,
}: {
  label: string;
  value: string;
  positive?: boolean;
  colors: any;
}) {
  return (
    <View style={[styles.statBox, { backgroundColor: colors.surface }]}>
      <Text style={[styles.statLabel, { color: colors.inkMute }]}>{label}</Text>
      <Text
        style={[
          styles.statValue,
          { color: positive === undefined ? colors.ink : positive ? colors.success : colors.protein },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function WeightChart({ entries, colors }: { entries: WeightEntry[]; colors: any }) {
  const W = 320;
  const H = 160;
  const PAD = 24;

  const weights = entries.map((e) => e.weight_kg);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = Math.max(0.5, max - min);
  const chartMin = min - range * 0.15;
  const chartMax = max + range * 0.15;

  const points = entries
    .map((e, i) => {
      const x = PAD + (i / Math.max(1, entries.length - 1)) * (W - PAD * 2);
      const y = PAD + (1 - (e.weight_kg - chartMin) / (chartMax - chartMin)) * (H - PAD * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
      <Line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke={colors.lineSoft} strokeWidth={1} />
      <Line x1={PAD} y1={PAD} x2={W - PAD} y2={PAD} stroke={colors.lineSoft} strokeWidth={1} strokeDasharray="2 4" />
      <SvgText x={PAD - 4} y={PAD + 4} fontSize={9} fill={colors.inkMute} textAnchor="end">
        {chartMax.toFixed(1)}
      </SvgText>
      <SvgText x={PAD - 4} y={H - PAD + 4} fontSize={9} fill={colors.inkMute} textAnchor="end">
        {chartMin.toFixed(1)}
      </SvgText>
      <Polyline points={points} fill="none" stroke={colors.brand} strokeWidth={2.5} strokeLinejoin="round" />
      {entries.map((e, i) => {
        const x = PAD + (i / Math.max(1, entries.length - 1)) * (W - PAD * 2);
        const y = PAD + (1 - (e.weight_kg - chartMin) / (chartMax - chartMin)) * (H - PAD * 2);
        return <Circle key={e.id} cx={x} cy={y} r={2.5} fill={colors.brand} />;
      })}
    </Svg>
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
  plus: { fontFamily: fonts.sansBold, fontSize: 14, fontWeight: '600' },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 40 },

  hero: { borderRadius: radius.xl, padding: 22, marginBottom: 12, alignItems: 'flex-start' },
  heroLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '600',
    marginBottom: 4,
  },
  heroBig: { fontFamily: fonts.serifMedium, fontSize: 40, letterSpacing: -0.5 },
  heroUnit: { fontFamily: fonts.sans, fontSize: 16, fontWeight: '500' },
  heroDelta: { fontFamily: fonts.sans, fontSize: 13, fontWeight: '500', marginTop: 4 },
  emptyHero: { fontFamily: fonts.sans, fontSize: 14, marginTop: 6 },

  statRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  statBox: { flex: 1, borderRadius: radius.md, padding: 12, alignItems: 'center' },
  statLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 9.5,
    letterSpacing: 1,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: { fontFamily: fonts.serifMedium, fontSize: 16 },

  chartCard: { borderRadius: radius.lg, padding: 14, marginBottom: 14 },
  chartTitle: { fontFamily: fonts.serifMedium, fontSize: 15, marginBottom: 6 },

  listTitle: { fontFamily: fonts.serifMedium, fontSize: 15, marginBottom: 8, marginTop: 6 },
  list: { borderRadius: radius.md, overflow: 'hidden' },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  listWeight: { fontFamily: fonts.serifMedium, fontSize: 16 },
  listNote: { fontFamily: fonts.sans, fontSize: 12, marginTop: 2 },
  listDate: { fontFamily: fonts.sans, fontSize: 12 },
  emptyList: {
    fontFamily: fonts.sans,
    fontSize: 13,
    textAlign: 'center',
    padding: 20,
  },

  hint: {
    fontFamily: fonts.sans,
    fontSize: 11.5,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 14,
    paddingHorizontal: 16,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: 22,
    paddingBottom: 34,
    gap: 12,
  },
  modalTitle: { fontFamily: fonts.serifMedium, fontSize: 20 },
  modalSub: { fontFamily: fonts.sans, fontSize: 12.5, lineHeight: 18 },
  input: {
    fontFamily: fonts.sans,
    fontSize: 15,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  saveBtn: {
    paddingVertical: 15,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 4,
  },
  saveBtnText: { fontFamily: fonts.sansBold, fontSize: 15, fontWeight: '600' },
});
