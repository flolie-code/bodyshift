import { forwardRef } from 'react';
import type { PressableProps, View, StyleProp, ViewStyle } from 'react-native';
import { Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * AnimatedPress — Pressable mit dezentem Tap-Feedback.
 * Scale kurz auf 0.97 beim Druecken, sanft zurueck.
 * Fuehlt sich lebendig an ohne zu wackeln.
 */
export const AnimatedPress = forwardRef<View, PressableProps & { style?: StyleProp<ViewStyle> }>(
  ({ style, onPressIn, onPressOut, ...rest }, ref) => {
    const scale = useSharedValue(1);

    const animStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <AnimatedPressable
        ref={ref as any}
        style={[style, animStyle]}
        onPressIn={(e) => {
          scale.value = withTiming(0.97, { duration: 90, easing: Easing.out(Easing.quad) });
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          scale.value = withTiming(1, { duration: 160, easing: Easing.out(Easing.cubic) });
          onPressOut?.(e);
        }}
        {...rest}
      />
    );
  }
);

AnimatedPress.displayName = 'AnimatedPress';
