import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { JanaAvatar } from './JanaAvatar';
import { fonts, radius } from '@/constants/theme';
import type { JanaMessage } from '@/lib/jana';

/**
 * JanaCard — Coach Jana als Sprechblase.
 * Avatar links, Bubble rechts mit kleinem Tail zum Avatar hin.
 * Verspielt, warm, nicht steif.
 */
export function JanaCard({
  message,
  colors,
  compact = false,
}: {
  message: JanaMessage;
  colors: any;
  compact?: boolean;
}) {
  const avatarSize = compact ? 44 : 52;

  return (
    <View style={styles.wrap}>
      <View style={{ paddingTop: 4 }}>
        <JanaAvatar size={avatarSize} />
      </View>

      <View style={styles.bubbleWrap}>
        {/* Sprechblase-Tail (kleines Dreieck links zeigt zum Avatar) */}
        <Svg width={12} height={16} viewBox="0 0 12 16" style={styles.tail}>
          <Path d="M12 3 L4 8 L12 13 Z" fill={colors.janaBubble} />
        </Svg>

        <View style={[styles.bubble, { backgroundColor: colors.janaBubble }]}>
          <View style={styles.header}>
            <Text style={[styles.name, { color: colors.brand }]}>Jana</Text>
            <Text style={styles.emoji}>{message.emoji}</Text>
          </View>
          <Text
            style={[
              styles.text,
              { color: colors.ink, fontSize: compact ? 13 : 14 },
            ]}
          >
            {message.text}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  bubbleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  tail: {
    marginTop: 10,
  },
  bubble: {
    flex: 1,
    padding: 14,
    borderTopLeftRadius: 4,
    borderTopRightRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  emoji: { fontSize: 14 },
  text: {
    fontFamily: fonts.sans,
    lineHeight: 20,
  },
});
