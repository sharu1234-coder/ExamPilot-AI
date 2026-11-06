import { useEffect, useState } from 'react';
import { BookOpen, BrainCircuit, CheckCircle2, Clock3, Pause, Play, RotateCcw, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DemoNotice, Eyebrow, Heading, Screen, SectionTitle, Surface } from '@/components/student-ui';
import { brand } from '@/constants/brand';

const focusMinutes = 25;
const breakMinutes = 5;

function pad(n: number) { return String(n).padStart(2, '0'); }

export default function Study() {
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [seconds, setSeconds] = useState(focusMinutes * 60);
  const [running, setRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((current) => {
        if (current > 1) return current - 1;
        setRunning(false);
        if (mode === 'focus') setCompletedSessions((count) => count + 1);
        return 0;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, mode]);

  function switchMode(next: 'focus' | 'break') {
    setRunning(false);
    setMode(next);
    setSeconds((next === 'focus' ? focusMinutes : breakMinutes) * 60);
  }

  const duration = (mode === 'focus' ? focusMinutes : breakMinutes) * 60;
  const pct = (duration - seconds) / duration * 100;
  const time = `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;

  return (
    <Screen>
      <DemoNotice />
      <Eyebrow>YOUR FOCUS SPACE</Eyebrow>
      <Heading title="Study studio" subtitle="Less distraction. More deep work." />

      <LinearGradient colors={['#786AF3', '#4B3ACA']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.timerCard}>
        <View style={styles.modeRow}>
          <Pressable onPress={() => switchMode('focus')} style={[styles.modeButton, mode === 'focus' && styles.modeActive]}><Text style={[styles.modeText, mode === 'focus' && styles.modeTextActive]}>FOCUS</Text></Pressable>
          <Pressable onPress={() => switchMode('break')} style={[styles.modeButton, mode === 'break' && styles.modeActive]}><Text style={[styles.modeText, mode === 'break' && styles.modeTextActive]}>SHORT BREAK</Text></Pressable>
        </View>
        <View style={styles.timerRing}>
          <Text style={styles.timer}>{time}</Text>
          <Text style={styles.timerDetail}>{seconds === 0 ? 'SESSION COMPLETE' : mode === 'focus' ? 'STAY IN YOUR FLOW' : 'TAKE A BREATH'}</Text>
        </View>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${pct}%` }]} /></View>
        <View style={styles.actions}>
          <Pressable onPress={() => { setRunning(false); setSeconds(duration); }} accessibilityLabel="Reset timer" style={styles.reset}><RotateCcw size={20} color="#FFF" /></Pressable>
          <Pressable disabled={seconds === 0} onPress={() => setRunning(!running)} style={[styles.play, seconds === 0 && { opacity: 0.65 }]}>{running ? <Pause size={19} color={brand.deepViolet} fill={brand.deepViolet} /> : <Play size={19} color={brand.deepViolet} fill={brand.deepViolet} />}<Text style={styles.playLabel}>{running ? 'Pause session' : seconds === 0 ? 'Completed' : 'Start focus'}</Text></Pressable>
          <View style={styles.resetSpacer} />
        </View>
        <Text style={styles.timerFootnote}>Timer works while the app is open. Session history is local to this preview.</Text>
      </LinearGradient>

      <View style={styles.miniStats}>
        <Surface style={styles.mini}><View style={styles.miniIcon}><CheckCircle2 size={18} color={brand.green} /></View><Text style={styles.miniValue}>{completedSessions}</Text><Text style={styles.miniLabel}>Sessions done</Text></Surface>
        <Surface style={styles.mini}><View style={[styles.miniIcon, { backgroundColor: brand.paleBlue }]}><Clock3 size={18} color={brand.blue} /></View><Text style={styles.miniValue}>{completedSessions * 25}<Text style={styles.miniSmall}> min</Text></Text><Text style={styles.miniLabel}>Focused today</Text></Surface>
      </View>

      <SectionTitle title="The AI study lab" action={<View style={styles.coming}><Text style={styles.comingText}>IN DEVELOPMENT</Text></View>} />
      <Surface style={styles.toolRow}>
        <View style={[styles.toolIcon, { backgroundColor: brand.lilac }]}><BrainCircuit color={brand.violet} size={23} /></View>
        <View style={{ flex: 1 }}><Text style={styles.toolTitle}>Notes to practice questions</Text><Text style={styles.toolCopy}>Turn your own lecture notes into source-linked revision questions.</Text></View>
      </Surface>
      <Surface style={styles.toolRow}>
        <View style={[styles.toolIcon, { backgroundColor: brand.mint }]}><BookOpen color={brand.green} size={23} /></View>
        <View style={{ flex: 1 }}><Text style={styles.toolTitle}>Smart exam preparation</Text><Text style={styles.toolCopy}>Plan topics around available time and exam dates.</Text></View>
      </Surface>
      <View style={styles.notice}><Sparkles size={16} color={brand.violet} /><Text style={styles.noticeText}>AI features are on the roadmap — no AI requests or document uploads are active yet.</Text></View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  timerCard: { borderRadius: 27, padding: 21, alignItems: 'center' },
  modeRow: { flexDirection: 'row', backgroundColor: '#FFFFFF22', borderRadius: 14, padding: 4, alignSelf: 'stretch' },
  modeButton: { flex: 1, borderRadius: 11, paddingVertical: 11, alignItems: 'center' }, modeActive: { backgroundColor: '#FFF' },
  modeText: { fontSize: 10, color: '#E5E1FF', fontWeight: '900', letterSpacing: 0.6 }, modeTextActive: { color: brand.deepViolet },
  timerRing: { width: 224, height: 224, borderRadius: 112, borderWidth: 6, borderColor: '#FFFFFF4A', alignItems: 'center', justifyContent: 'center', marginVertical: 33, backgroundColor: '#FFFFFF12' },
  timer: { fontSize: 52, fontWeight: '900', letterSpacing: -2.5, color: '#FFF', fontVariant: ['tabular-nums'] },
  timerDetail: { fontSize: 10, color: '#E3DFFF', letterSpacing: 1.5, fontWeight: '800', marginTop: 8 },
  progressTrack: { height: 6, borderRadius: 6, backgroundColor: '#FFFFFF38', width: '100%', overflow: 'hidden' }, progressFill: { height: '100%', backgroundColor: '#C5F5E7', borderRadius: 6 },
  actions: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 27 },
  reset: { height: 46, width: 46, borderWidth: 1, borderColor: '#FFFFFF70', borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  resetSpacer: { height: 46, width: 46 },
  play: { backgroundColor: '#FFF', paddingHorizontal: 22, height: 46, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  playLabel: { color: brand.deepViolet, fontSize: 13, fontWeight: '900' },
  timerFootnote: { fontSize: 10, color: '#DED9FF', textAlign: 'center', marginTop: 20, lineHeight: 15 },
  miniStats: { flexDirection: 'row', gap: 11, marginTop: 15 }, mini: { flex: 1, padding: 16 },
  miniIcon: { height: 34, width: 34, borderRadius: 10, backgroundColor: brand.mint, alignItems: 'center', justifyContent: 'center', marginBottom: 13 },
  miniValue: { color: brand.ink, fontSize: 24, fontWeight: '900' }, miniSmall: { fontSize: 12 }, miniLabel: { color: brand.muted, fontSize: 11, marginTop: 5 },
  coming: { borderRadius: 8, backgroundColor: brand.lilac, paddingHorizontal: 9, paddingVertical: 7 }, comingText: { color: brand.violet, fontSize: 8, fontWeight: '900' },
  toolRow: { flexDirection: 'row', gap: 13, alignItems: 'center', marginBottom: 10 },
  toolIcon: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  toolTitle: { color: brand.ink, fontSize: 13, fontWeight: '900' }, toolCopy: { color: brand.muted, fontSize: 11, lineHeight: 17, marginTop: 6 },
  notice: { marginTop: 12, flexDirection: 'row', gap: 9, padding: 15, backgroundColor: brand.lilac, borderRadius: 16 }, noticeText: { flex: 1, fontSize: 10, color: brand.body, lineHeight: 17 },
});
