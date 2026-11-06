import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { brand, radius } from '@/constants/brand';

export function Screen({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <Text style={[styles.eyebrow, light && { color: '#D9D4FF' }]}>{children}</Text>;
}

export function Heading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ gap: 8, marginBottom: 26 }}>
      <Text style={styles.heading}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionText}>{title}</Text>
      {action}
    </View>
  );
}

export function Surface({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.surface, style]}>{children}</View>;
}

export function ProgressRail({ percent, color = brand.violet }: { percent: number; color?: string }) {
  return (
    <View style={styles.rail}>
      <View style={{ width: `${Math.max(0, Math.min(100, percent))}%`, height: '100%', backgroundColor: color, borderRadius: 10 }} />
    </View>
  );
}

export function DemoNotice() {
  return <Text style={styles.demoNotice}>DEMO WORKSPACE  ·  Changes are temporary in this preview</Text>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: brand.canvas },
  scroll: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 38, gap: 0 },
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, color: brand.violet },
  heading: { fontSize: 31, lineHeight: 37, fontWeight: '800', color: brand.ink, letterSpacing: -1 },
  subtitle: { fontSize: 13, lineHeight: 20, color: brand.muted },
  sectionTitle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, marginBottom: 15 },
  sectionText: { fontSize: 18, fontWeight: '800', letterSpacing: -0.4, color: brand.ink },
  surface: { backgroundColor: brand.white, borderRadius: radius.card, padding: 18, borderWidth: 1, borderColor: brand.border },
  rail: { backgroundColor: '#E9EBF6', height: 7, borderRadius: 10, overflow: 'hidden' },
  demoNotice: { color: brand.muted, fontWeight: '700', fontSize: 9, letterSpacing: 0.5, marginBottom: 18, textAlign: 'center' },
});
