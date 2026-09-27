import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { JanaAvatar } from '@/components/JanaAvatar';
import { FadeInView } from '@/components/FadeInView';
import { AnimatedPress } from '@/components/AnimatedPress';
import { useTheme } from '@/hooks/useTheme';
import { fonts, radius, spacing } from '@/constants/theme';
import {
  askJana,
  loadChat,
  saveChat,
  clearChat,
  buildContext,
  type ChatMessage,
} from '@/lib/coachChat';

const SUGGESTIONS = [
  'Was koche ich heute Abend?',
  'Warum nehme ich nicht ab?',
  'Wie oft soll ich zur Behandlung?',
  'Ich habe suendigt heute',
  'Was ist ein guter Snack?',
  'Wie lange halten die Ergebnisse?',
];

export default function CoachScreen() {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const keyboard = useAnimatedKeyboard();

  const containerStyle = useAnimatedStyle(() => ({
    paddingBottom: keyboard.height.value,
  }));

  const bottomToScroll = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
  }, []);

  useEffect(() => {
    loadChat().then(setMessages);
  }, []);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const userMsg: ChatMessage = {
      id: `${Date.now()}-u`,
      role: 'user',
      content: trimmed,
      ts: new Date().toISOString(),
    };

    setInput('');
    setMessages((prev) => [...prev, userMsg]);
    setSending(true);
    bottomToScroll();

    try {
      const context = await buildContext();
      const reply = await askJana(trimmed, messages, context);

      const janaMsg: ChatMessage = {
        id: `${Date.now()}-j`,
        role: 'assistant',
        content: reply,
        ts: new Date().toISOString(),
      };
      const next = [...messages, userMsg, janaMsg];
      setMessages(next);
      await saveChat(next);
    } catch (e) {
      Alert.alert('Jana antwortet gerade nicht', (e as Error).message);
    } finally {
      setSending(false);
      bottomToScroll();
    }
  }

  function askClear() {
    Alert.alert('Chat loeschen?', 'Die ganze Konversation mit Jana wird geloescht.', [
      { text: 'Abbrechen', style: 'cancel' },
      {
        text: 'Loeschen',
        style: 'destructive',
        onPress: async () => {
          await clearChat();
          setMessages([]);
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={[styles.back, { color: colors.brand }]}>← Zurueck</Text>
        </Pressable>
        <View style={styles.headerCenter}>
          <JanaAvatar size={32} />
          <View>
            <Text style={[styles.headerName, { color: colors.ink }]}>Coach Jana</Text>
            <Text style={[styles.headerStatus, { color: colors.success }]}>● online</Text>
          </View>
        </View>
        {messages.length > 0 ? (
          <Pressable onPress={askClear} hitSlop={12}>
            <Text style={[styles.clearBtn, { color: colors.inkMute }]}>Leeren</Text>
          </Pressable>
        ) : (
          <View style={{ width: 60 }} />
        )}
      </View>

      <Animated.View style={[{ flex: 1 }, containerStyle]}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.length === 0 && (
            <View style={styles.empty}>
              <JanaAvatar size={72} />
              <Text style={[styles.emptyTitle, { color: colors.ink }]}>Frag mich alles</Text>
              <Text style={[styles.emptySub, { color: colors.inkMute }]}>
                Ernaehrung, Bewegung, deine Behandlung, oder wenn du einfach nur mal quatschen willst.
              </Text>

              <View style={styles.suggestionRow}>
                {SUGGESTIONS.map((s) => (
                  <AnimatedPress
                    key={s}
                    onPress={() => send(s)}
                    style={[styles.suggestion, { backgroundColor: colors.surface, borderColor: colors.line }]}
                  >
                    <Text style={[styles.suggestionText, { color: colors.ink }]}>{s}</Text>
                  </AnimatedPress>
                ))}
              </View>
            </View>
          )}

          {messages.map((m) => (
            <FadeInView key={m.id} delay={0} distance={6}>
              <Bubble msg={m} colors={colors} />
            </FadeInView>
          ))}

          {sending && (
            <View style={styles.typingWrap}>
              <View style={{ paddingTop: 6 }}>
                <JanaAvatar size={32} />
              </View>
              <View style={[styles.typing, { backgroundColor: colors.janaBubble }]}>
                <ActivityIndicator color={colors.brand} size="small" />
                <Text style={[styles.typingText, { color: colors.inkMute }]}>Jana tippt...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.line }]}>
          <TextInput
            style={[styles.input, { color: colors.ink, backgroundColor: colors.surfaceAlt }]}
            placeholder="Frag Jana..."
            placeholderTextColor={colors.inkMute}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            onFocus={bottomToScroll}
          />
          <AnimatedPress
            style={[
              styles.sendBtn,
              { backgroundColor: input.trim().length > 0 ? colors.accent : colors.line },
            ]}
            onPress={() => send(input)}
            disabled={sending || input.trim().length === 0}
          >
            <Text style={[styles.sendBtnText, { color: colors.brandInk }]}>→</Text>
          </AnimatedPress>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

function Bubble({ msg, colors }: { msg: ChatMessage; colors: any }) {
  const isJana = msg.role === 'assistant';

  if (isJana) {
    return (
      <View style={styles.bubbleRow}>
        <View style={{ paddingTop: 6 }}>
          <JanaAvatar size={32} />
        </View>
        <View style={[styles.janaBubble, { backgroundColor: colors.janaBubble }]}>
          <Text style={[styles.msgText, { color: colors.ink }]}>{msg.content}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.bubbleRow, { justifyContent: 'flex-end' }]}>
      <View style={[styles.userBubble, { backgroundColor: colors.brand }]}>
        <Text style={[styles.msgText, { color: colors.brandInk }]}>{msg.content}</Text>
      </View>
    </View>
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
    gap: 12,
  },
  back: { fontFamily: fonts.sansBold, fontSize: 14, fontWeight: '600', width: 60 },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  headerName: { fontFamily: fonts.serifMedium, fontSize: 15 },
  headerStatus: { fontFamily: fonts.sans, fontSize: 11, marginTop: 1 },
  clearBtn: { fontFamily: fonts.sans, fontSize: 12.5, width: 60, textAlign: 'right' },

  scroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 20,
    gap: 12,
  },

  empty: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyTitle: {
    fontFamily: fonts.serifMedium,
    fontSize: 24,
    marginTop: 12,
  },
  emptySub: {
    fontFamily: fonts.sans,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },
  suggestionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  suggestion: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
  },
  suggestionText: {
    fontFamily: fonts.sans,
    fontSize: 12.5,
  },

  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  janaBubble: {
    flex: 1,
    padding: 12,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    maxWidth: '85%',
  },
  userBubble: {
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    maxWidth: '85%',
  },
  msgText: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20 },

  typingWrap: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  typing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  typingText: { fontFamily: fonts.sans, fontSize: 12.5 },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    gap: 8,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  input: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 15,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 120,
    minHeight: 40,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnText: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: '600',
  },
});
