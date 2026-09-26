import { useEffect } from 'react';
import type { ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

/**
 * FadeInView — sanftes Erscheinen von Karten beim Mount.
 * Bewegung minimal (10px), Dauer kurz (280ms). Keine Ueber-Animation.
 * Delay pro Position ermoeglicht Staffelung mehrerer Karten.
 */
export function FadeInView({
  delay = 0,
  children,
  style,
  distance = 10,
  ...rest
}: ViewProps & { delay?: number; distance?: number }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(distance);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 280, easing: Easing.out(Easing.cubic) })
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 320, easing: Easing.out(Easing.cubic) })
    );
  }, [delay, opacity, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[style, animStyle]} {...rest}>
      {children}
    </Animated.View>
  );
}
