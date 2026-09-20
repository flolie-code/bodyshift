import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { fonts } from '@/constants/theme';

type Variant = 'default' | 'today' | 'treat';

export function DayRing({ label, percent, variant = 'default', colors }: {
  label: string;
  percent: number;
  variant?: Variant;
  colors: any;
}) {
  const r = 16;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, percent));
  const offset = circumference * (1 - clamped);
  const stroke =
    variant === 'today' ? colors.accent :
    variant === 'treat' ? colors.carbs :
    colors.brand;

  return (
    <View style={styles.wrap}>
      <Svg width={40} height={40} viewBox="0 0 40 40">
        <Circle cx={20} cy={20} r={r} fill="none" stroke={colors.track} strokeWidth={5} />
        <Circle
          cx={20}
          cy={20}
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 20 20)"
        />
      </Svg>
      <Text
        style={[
          styles.label,
          {
            color:
              variant === 'today' ? colors.accent :
              variant === 'treat' ? colors.carbs :
              colors.inkMute,
          },
        ]}
      >
        {label}{variant === 'treat' ? ' 🎉' : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 4, flex: 1 },
  label: { fontFamily: fonts.sansBold, fontSize: 9.5, fontWeight: '600', letterSpacing: 0.5 },
});
