import { useMemo, useState } from 'react';
import { ArrowUpRight, CalendarCheck2, CircleAlert, Minus, Plus, TrendingUp } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DemoNotice, Eyebrow, Heading, ProgressRail, Screen, SectionTitle, Surface } from '@/components/student-ui';
import { brand } from '@/constants/brand';
import { projectAttendance } from '@/lib/attendance';

function Stepper({ label, value, minus, plus, minimum = 0, maximum = 999 }: { label: string; value: number; minus: () => void; plus: () => void; minimum?: number; maximum?: number }) {
  return (
    <View style={styles.stepperRow}>
      <Text style={styles.stepLabel}>{label}</Text>
      <View style={styles.stepActions}>
        <Pressable disabled={value <= minimum} onPress={minus} accessibilityLabel={`Decrease ${label}`} style={[styles.stepButton, value <= minimum && { opacity: 0.3 }]}><Minus size={16} color={brand.violet} /></Pressable>
        <Text style={styles.stepValue}>{value}</Text>
        <Pressable disabled={value >= maximum} onPress={plus} accessibilityLabel={`Increase ${label}`} style={[styles.stepButton, value >= maximum && { opacity: 0.3 }]}><Plus size={16} color={brand.violet} /></Pressable>
      </View>
    </View>
  );
}

export default function Progress() {
  const [attended, setAttended] = useState(18);
  const [total, setTotal] = useState(25);
  const [target, setTarget] = useState(75);

  const projection = useMemo(() => projectAttendance(attended, total, target / 100), [attended, total, target]);
  const onTrack = projection.percent >= target && total > 0;

  return (
    <Screen>
      <DemoNotice />
      <Eyebrow>KNOW YOUR NUMBERS</Eyebrow>
      <Heading title="My progress" subtitle="Clear answers. Smarter academic decisions." />

      <LinearGradient colors={['#26244B', '#4E42A7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={styles.heroTop}><View><Text style={styles.heroOverline}>ATTENDANCE OVERVIEW</Text><Text style={styles.heroPercent}>{projection.percent.toFixed(1)}<Text style={styles.percentSymbol}>%</Text></Text></View><View style={styles.heroIcon}><TrendingUp size={23} color="#DED9FF" /></View></View>
        <ProgressRail percent={projection.percent} color={onTrack ? '#9BF3D8' : '#F8CA96'} />
        <Text style={styles.heroBottom}>Target: {target}%  ·  {onTrack ? 'Currently on track' : 'Below your selected target'}</Text>
      </LinearGradient>

      <SectionTitle title="Attendance calculator" />
      <Surface>
        <Text style={styles.fieldNote}>Try different values to understand what you need for your goal.</Text>
        <Stepper label="Classes attended" value={attended} minimum={0} maximum={total} minus={() => setAttended((v) => Math.max(0, v - 1))} plus={() => setAttended((v) => Math.min(total, v + 1))} />
        <View style={styles.hairline} />
        <Stepper label="Classes conducted" value={total} minimum={attended} minus={() => setTotal((v) => Math.max(attended, v - 1))} plus={() => setTotal((v) => Math.min(999, v + 1))} />
        <Text style={styles.targetTitle}>ATTENDANCE TARGET</Text>
        <View style={styles.targetButtons}>
          {[75, 80, 85, 90].map((value) => <Pressable key={value} onPress={() => setTarget(value)} style={[styles.targetButton, target === value && styles.targetActive]} accessibilityState={{ selected: target === value }}><Text style={[styles.targetText, target === value && { color: '#FFF' }]}>{value}%</Text></Pressable>)}
        </View>
      </Surface>

      <View style={styles.resultGrid}>
        <Surface style={[styles.resultCard, { backgroundColor: brand.lilac, borderColor: brand.lilac }]}>
          <ArrowUpRight size={19} color={brand.violet} /><Text style={[styles.resultValue, { color: brand.deepViolet }]}>{projection.extraClassesNeeded}</Text><Text style={styles.resultLabel}>Classes to attend consecutively to reach {target}%</Text>
        </Surface>
        <Surface style={[styles.resultCard, { backgroundColor: brand.mint, borderColor: brand.mint }]}>
          <CalendarCheck2 size={19} color={brand.green} /><Text style={[styles.resultValue, { color: brand.green }]}>{projection.classesCanMiss}</Text><Text style={styles.resultLabel}>Classes you could miss now and remain at {target}%</Text>
        </Surface>
      </View>
      <View style={styles.disclaimer}><CircleAlert size={16} color={brand.violet} /><Text style={styles.disclaimerText}>Estimates assume every class counts equally and no special college attendance rules. Verify your institution’s policy before relying on the result.</Text></View>

      <SectionTitle title="Coming to your insights" />
      <Surface style={styles.nextCard}><View style={styles.nextIcon}><TrendingUp size={20} color={brand.violet} /></View><View style={{ flex: 1 }}><Text style={styles.nextTitle}>Grades & semester trends</Text><Text style={styles.nextText}>SGPA, CGPA, exam readiness and subject-level trends will appear after account-linked records are built.</Text></View></Surface>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: 24, padding: 22, minHeight: 198 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 26 },
  heroOverline: { color: '#CFCAFF', fontSize: 10, letterSpacing: 1.2, fontWeight: '800' },
  heroPercent: { fontSize: 51, color: '#FFF', fontWeight: '900', letterSpacing: -2, marginTop: 10 },
  percentSymbol: { fontSize: 25 }, heroIcon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#FFFFFF20' },
  heroBottom: { fontSize: 11, color: '#E4DEFF', marginTop: 14 },
  fieldNote: { fontSize: 11, color: brand.muted, lineHeight: 18, marginBottom: 18 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 9 },
  stepLabel: { color: brand.body, fontSize: 12, fontWeight: '700' },
  stepActions: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  stepButton: { height: 31, width: 31, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: brand.lilac },
  stepValue: { minWidth: 23, textAlign: 'center', fontWeight: '900', fontSize: 16, color: brand.ink },
  hairline: { height: 1, backgroundColor: brand.border, marginVertical: 6 },
  targetTitle: { color: brand.muted, fontSize: 10, letterSpacing: 1, fontWeight: '900', marginTop: 25, marginBottom: 12 },
  targetButtons: { flexDirection: 'row', gap: 8 },
  targetButton: { flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 11, backgroundColor: brand.canvas },
  targetActive: { backgroundColor: brand.violet }, targetText: { fontWeight: '900', fontSize: 12, color: brand.body },
  resultGrid: { flexDirection: 'row', gap: 12, marginTop: 12 }, resultCard: { flex: 1, minWidth: 0, gap: 9 },
  resultValue: { fontSize: 30, fontWeight: '900' }, resultLabel: { fontSize: 11, color: brand.body, lineHeight: 17 },
  disclaimer: { flexDirection: 'row', gap: 10, marginTop: 16, padding: 14, borderRadius: 14, backgroundColor: brand.lilac }, disclaimerText: { flex: 1, color: brand.body, fontSize: 10, lineHeight: 17 },
  nextCard: { flexDirection: 'row', alignItems: 'center', gap: 13 }, nextIcon: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center', backgroundColor: brand.lilac, borderRadius: 14 },
  nextTitle: { color: brand.ink, fontWeight: '900', fontSize: 13 }, nextText: { color: brand.muted, fontSize: 11, lineHeight: 17, marginTop: 6 },
});
