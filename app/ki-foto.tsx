import { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { fonts, radius, spacing } from '@/constants/theme';
import { analyzeMealPhoto, type MealScanResult } from '@/lib/aiMealScan';
import { addMeal, suggestMealType, type MealType } from '@/lib/meals';

type Phase = 'camera' | 'analyzing' | 'result' | 'saving';

export default function KiFotoScreen() {
  const { colors } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [phase, setPhase] = useState<Phase>('camera');
  const [result, setResult] = useState<MealScanResult | null>(null);
  const [mealType, setMealType] = useState<MealType>(suggestMealType());

  async function takeAndAnalyze() {
    if (!cameraRef.current) return;
    try {
      setPhase('analyzing');
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.6,
      });
      if (!photo?.base64) throw new Error('Kein Foto erhalten');
      const scan = await analyzeMealPhoto(photo.base64);
      if (scan.items.length === 0) {
        Alert.alert('Nichts erkannt', 'Ich konnte kein Essen erkennen — probier ein anderes Foto.');
        setPhase('camera');
        return;
      }
      setResult(scan);
      setPhase('result');
    } catch (e) {
      Alert.alert('Fehler', (e as Error).message);
      setPhase('camera');
    }
  }

  async function saveAsMeal() {
    if (!result) return;
    setPhase('saving');
    try {
      const summary = result.items.map((i) => i.name).slice(0, 3).join(', ');
      await addMeal({
        name: summary || 'KI-Analyse',
        mealType,
        kcal: Math.round(result.totalKcal),
        proteinG: Math.round(result.totalProtein),
        carbsG: Math.round(result.totalCarbs),
        fatG: Math.round(result.totalFat),
        source: 'photo_ai',
      });
      router.back();
    } catch (e) {
      Alert.alert('Speichern fehlgeschlagen', (e as Error).message);
      setPhase('result');
    }
  }

  // Berechtigung fehlt
  if (!permission) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <ActivityIndicator color={colors.brand} style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={styles.permBlock}>
          <Text style={[styles.permTitle, { color: colors.ink }]}>Kamera-Zugriff</Text>
          <Text style={[styles.permBody, { color: colors.inkSoft }]}>
            BodyShift braucht die Kamera, um dein Essen zu analysieren. Kein Foto verlaesst dein Handy ohne Freigabe.
          </Text>
          <Pressable
            style={[styles.btn, { backgroundColor: colors.brand }]}
            onPress={requestPermission}
          >
            <Text style={[styles.btnText, { color: colors.brandInk }]}>Zugriff erlauben</Text>
          </Pressable>
          <Pressable onPress={() => router.back()}>
            <Text style={[styles.link, { color: colors.brand }]}>Zurueck</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {phase === 'camera' || phase === 'analyzing' ? (
        <>
          <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />
          <SafeAreaView style={styles.cameraOverlay} pointerEvents="box-none">
            <View style={styles.topBar}>
              <Pressable onPress={() => router.back()} style={styles.closeBtn} hitSlop={12}>
                <Text style={styles.closeBtnText}>✕</Text>
              </Pressable>
              <Text style={styles.overlayTitle}>Mahlzeit scannen</Text>
              <View style={{ width: 36 }} />
            </View>

            <View style={styles.hintBox}>
              <Text style={styles.hintText}>
                {phase === 'analyzing'
                  ? 'KI analysiert...'
                  : 'Halte den Teller mittig und tippe auf den Auslöser'}
              </Text>
            </View>

            <View style={styles.shutterRow}>
              <Pressable
                style={[
                  styles.shutter,
                  phase === 'analyzing' && { opacity: 0.5 },
                ]}
                onPress={takeAndAnalyze}
                disabled={phase === 'analyzing'}
              >
                {phase === 'analyzing' ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <View style={styles.shutterInner} />
                )}
              </Pressable>
            </View>
          </SafeAreaView>
        </>
      ) : (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
          <View style={styles.header}>
            <Pressable onPress={() => setPhase('camera')} hitSlop={12}>
              <Text style={[styles.back, { color: colors.brand }]}>← Neu</Text>
            </Pressable>
            <Text style={[styles.title, { color: colors.ink }]}>KI-Analyse</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView contentContainerStyle={styles.scroll}>
            {result && (
              <>
                <View style={[styles.summary, { backgroundColor: colors.surface }]}>
                  <Text style={[styles.summaryLabel, { color: colors.inkMute }]}>
                    KI-KONFIDENZ: {Math.round(result.overallConfidence * 100)}%
                  </Text>
                  <Text style={[styles.summaryKcal, { color: colors.ink }]}>
                    {Math.round(result.totalKcal)}
                    <Text style={[styles.summaryUnit, { color: colors.inkMute }]}> kcal</Text>
                  </Text>
                  <View style={styles.macroRow}>
                    <MacroChip label="Protein" val={result.totalProtein} unit="g" color={colors.protein} />
                    <MacroChip label="KH" val={result.totalCarbs} unit="g" color={colors.carbs} />
                    <MacroChip label="Fett" val={result.totalFat} unit="g" color={colors.fat} />
                  </View>
                </View>

                <Text style={[styles.itemsHead, { color: colors.ink }]}>Erkannt</Text>
                {result.items.map((it, i) => (
                  <View key={i} style={[styles.itemCard, { backgroundColor: colors.surface }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.itemName, { color: colors.ink }]}>{it.name}</Text>
                      <Text style={[styles.itemMeta, { color: colors.inkMute }]}>
                        {it.amountGrams}g · {it.kcal} kcal · P{it.protein} K{it.carbs} F{it.fat}
                      </Text>
                    </View>
                    <View style={[styles.confBadge, { backgroundColor: colors.surfaceAlt }]}>
                      <Text style={[styles.confText, { color: colors.inkSoft }]}>
                        {Math.round(it.confidence * 100)}%
                      </Text>
                    </View>
                  </View>
                ))}

                <Text style={[styles.mtLabel, { color: colors.inkMute }]}>ZUORDNEN</Text>
                <View style={styles.mtRow}>
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((t) => (
                    <Pressable
                      key={t}
                      onPress={() => setMealType(t)}
                      style={[
                        styles.mtChip,
                        {
                          backgroundColor: mealType === t ? colors.brand : colors.surface,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.mtChipText,
                          { color: mealType === t ? colors.brandInk : colors.ink },
                        ]}
                      >
                        {t === 'breakfast' ? 'Frueh' : t === 'lunch' ? 'Mittag' : t === 'dinner' ? 'Abend' : 'Snack'}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Pressable
                  style={[styles.saveBtn, { backgroundColor: colors.brand }]}
                  onPress={saveAsMeal}
                  disabled={phase === 'saving'}
                >
                  <Text style={[styles.saveBtnText, { color: colors.brandInk }]}>
                    {phase === 'saving' ? 'Speichern...' : `${Math.round(result.totalKcal)} kcal uebernehmen`}
                  </Text>
                </Pressable>

                <Text style={[styles.disclaimer, { color: colors.inkMute }]}>
                  KI-Schaetzungen sind Naeherungen — pruefe die Werte, wenn dir was komisch vorkommt.
                </Text>
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      )}
    </View>
  );
}

function MacroChip({ label, val, unit, color }: { label: string; val: number; unit: string; color: string }) {
  return (
    <View style={styles.macroChip}>
      <Text style={[styles.macroChipLabel, { color }]}>{label}</Text>
      <Text style={[styles.macroChipVal, { color }]}>
        {Math.round(val)}
        {unit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  permBlock: { flex: 1, padding: 24, gap: 12, justifyContent: 'center', alignItems: 'center' },
  permTitle: { fontFamily: fonts.serifMedium, fontSize: 22 },
  permBody: { fontFamily: fonts.sans, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  btn: { paddingVertical: 14, paddingHorizontal: 22, borderRadius: 100, marginTop: 10 },
  btnText: { fontFamily: fonts.sansBold, fontSize: 15, fontWeight: '600' },
  link: { fontFamily: fonts.sansBold, fontSize: 14, fontWeight: '600', marginTop: 10 },

  cameraOverlay: { flex: 1, justifyContent: 'space-between' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 100,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: { color: '#fff', fontSize: 16 },
  overlayTitle: { color: '#fff', fontFamily: fonts.serifMedium, fontSize: 16 },
  hintBox: {
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  hintText: { color: '#fff', fontFamily: fonts.sans, fontSize: 12.5 },
  shutterRow: { alignItems: 'center', paddingBottom: spacing.xl },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 100,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  back: { fontFamily: fonts.sansBold, fontSize: 14, fontWeight: '600' },
  title: { fontFamily: fonts.serifMedium, fontSize: 17 },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 40 },

  summary: { borderRadius: radius.lg, padding: 18, alignItems: 'center', marginBottom: 14 },
  summaryLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 10.5,
    letterSpacing: 1.2,
    fontWeight: '600',
    marginBottom: 6,
  },
  summaryKcal: { fontFamily: fonts.serifMedium, fontSize: 36 },
  summaryUnit: { fontFamily: fonts.sans, fontSize: 15, fontWeight: '500' },
  macroRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  macroChip: { alignItems: 'center', paddingHorizontal: 12 },
  macroChipLabel: { fontFamily: fonts.sansBold, fontSize: 10, letterSpacing: 0.8, fontWeight: '600' },
  macroChipVal: { fontFamily: fonts.serifMedium, fontSize: 14, marginTop: 2 },

  itemsHead: { fontFamily: fonts.serifMedium, fontSize: 15, marginBottom: 8, marginTop: 4 },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: radius.md,
    marginBottom: 6,
    gap: 10,
  },
  itemName: { fontFamily: fonts.serifMedium, fontSize: 14 },
  itemMeta: { fontFamily: fonts.sans, fontSize: 12, marginTop: 2 },
  confBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  confText: { fontFamily: fonts.sansBold, fontSize: 11, fontWeight: '600' },

  mtLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 10.5,
    letterSpacing: 1.2,
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 8,
  },
  mtRow: { flexDirection: 'row', gap: 8 },
  mtChip: { flex: 1, paddingVertical: 12, borderRadius: 100, alignItems: 'center' },
  mtChipText: { fontFamily: fonts.sansBold, fontSize: 13, fontWeight: '600' },

  saveBtn: { marginTop: 16, paddingVertical: 16, borderRadius: 100, alignItems: 'center' },
  saveBtnText: { fontFamily: fonts.sansBold, fontSize: 15, fontWeight: '600' },

  disclaimer: {
    fontFamily: fonts.sans,
    fontSize: 11.5,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 14,
    paddingHorizontal: 16,
  },
});
