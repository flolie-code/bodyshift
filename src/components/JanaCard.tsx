import { View, Text, StyleSheet } from 'react-native';
import { JanaAvatar } from './JanaAvatar';
import { fonts, radius, spacing } from '@/constants/theme';
import type { JanaMessage } from '@/lib/jana';

/**
 * JanaCard — die persoenliche Nachricht von Coach Jana.
 * Wird oben auf dem Home-Screen und in weiteren Kontexten gezeigt.
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
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.janaBubble ?? colors.surface,
          borderColor: colors.line,
        },
      ]}
    >
      <JanaAvatar size={compact ? 36 : 44} />
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.brand }]}>Jana</Text>
          <Text style={[styles.emoji]}>{message.emoji}</Text>
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
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  body: { flex: 1, gap: 4 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  emoji: { fontSize: 13 },
  text: {
    fontFamily: fonts.sans,
    lineHeight: 20,
  },
});
