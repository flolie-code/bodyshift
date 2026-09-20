import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { fonts } from '@/constants/theme';

export default function OnboardingScreen() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.ink }]}>Onboarding</Text>
        <Text style={[styles.sub, { color: colors.inkSoft }]}>
          Wunschgewicht, Ziel-Kalorien und Makro-Verteilung.{'\n'}
          — kommt als nächstes.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontFamily: fonts.serifMedium, fontSize: 28, marginBottom: 8 },
  sub: { fontFamily: fonts.sans, fontSize: 14, textAlign: 'center' },
});
