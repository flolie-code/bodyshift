import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';
import { AnimatedPress } from './AnimatedPress';
import { fonts, radius } from '@/constants/theme';
import { addWater, getTodayWaterMl, DAILY_WATER_GOAL_ML } from '@/lib/water';

/**
 * WaterWidget — kompakte Karte fuer Wasser-Tracking auf dem Home-Screen.
 * Zeigt Tagesstand + zwei Quick-Add-Buttons (250ml Glas, 500ml Flasche).
 * Fuellstand animiert smooth wenn Wasser hinzugefuegt wird.
 */
export function WaterWidget({ colors }: { colors: any }) {
  const [totalMl, setTotalMl] = useState(0);
  const fillProgress = useSharedValue(0);

  const load = useCallback(async () => {
    const ml = await getTodayWaterMl();
    setTotalMl(ml);
    fillProgress.value = withTiming(
      Math.min(1, ml / DAILY_WATER_GOAL_ML),
      { duration: 500, easing: Easing.out(Easing.cubic) }
    );
  }, [fillProgress]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleAdd = async (ml: number) => {
    try {
      await addWater(ml);
      await load();
    } catch (e) {
      Alert.alert('Fehler', (e as Error).message);
    }
  };

  const fillStyle = useAnimatedStyle(() => ({
    width: `${fillProgress.value * 100}%`,
  }));

  const pctText = Math.round((totalMl / DAILY_WATER_GOAL_ML) * 100);

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.top}>
        <View>
          <Text style={[styles.label, { color: colors.inkMute }]}>WASSER HEUTE</Text>
          <Text style={[styles.num, { color: colors.ink }]}>
            {(totalMl / 1000).toFixed(1).replace('.', ',')}
            <Text style={[styles.unit, { color: colors.inkMute }]}>
              L / {(DAILY_WATER_GOAL_ML / 1000).toFixed(1).replace('.', ',')} L
            </Text>
          </Text>
        </View>
        <View style={styles.actions}>
          <AnimatedPress
            style={[styles.action, { backgroundColor: colors.surfaceAlt }]}
            onPress={() => handleAdd(250)}
          >
            <Text style={styles.actionIcon}>💧</Text>
            <Text style={[styles.actionText, { color: colors.brand }]}>+250</Text>
          </AnimatedPress>
          <AnimatedPress
            style={[styles.action, { backgroundColor: colors.surfaceAlt }]}
            onPress={() => handleAdd(500)}
          >
            <Text style={styles.actionIcon}>🍶</Text>
            <Text style={[styles.actionText, { color: colors.brand }]}>+500</Text>
          </AnimatedPress>
        </View>
      </View>

      <View style={[styles.bar, { backgroundColor: colors.track }]}>
        <Animated.View
          style={[
            styles.fill,
            { backgroundColor: totalMl >= DAILY_WATER_GOAL_ML ? colors.success : colors.brand },
            fillStyle,
          ]}
        />
      </View>
      <Text style={[styles.pct, { color: colors.inkMute }]}>{pctText}% des Tagesziels</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: 14, gap: 10 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: {
    fontFamily: fonts.sansBold,
    fontSize: 10.5,
    letterSpacing: 1.4,
    fontWeight: '600',
  },
  num: { fontFamily: fonts.serifMedium, fontSize: 22, marginTop: 2 },
  unit: { fontFamily: fonts.sans, fontSize: 12, fontWeight: '500' },
  actions: { flexDirection: 'row', gap: 6 },
  action: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionIcon: { fontSize: 14 },
  actionText: { fontFamily: fonts.sansBold, fontSize: 12, fontWeight: '600' },

  bar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  pct: { fontFamily: fonts.sans, fontSize: 11 },
});
