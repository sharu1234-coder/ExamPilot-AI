import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Bell, BookOpen, Check, Clock3, Flame, GraduationCap, Sparkles } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DemoNotice, ProgressRail, Screen, SectionTitle, Surface } from '@/components/student-ui';
import { brand } from '@/constants/brand';
import { useDemoStudent } from '@/state/demo-student';

const classes = [
  { time: '09:00', period: 'AM', name: 'Bioprocess Engineering', details: 'Lecture · Room B-204', color: brand.violet },
  { time: '11:30', period: 'AM', name: 'Database Systems', details: 'Lab · Computer Centre', color: brand.green },
];

export default function Dashboard() {
  const { tasks, toggleTask } = useDemoStudent();
  const completed = tasks.filter((task) => task.done).length;

  return (
    <Screen>
      <View style={styles.topbar}>
        <View style={styles.brandMark}><GraduationCap color={brand.white} size={21} strokeWidth={2.2} /></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.brandName}>exampilot<Text style={{ color: brand.violet }}>.</Text></Text>
          <Text style={styles.brandSub}>YOUR ACADEMIC COPILOT</Text>
        </View>
        <View style={styles.bell}><Bell color={brand.ink} size={19} strokeWidth={1.9} /></View>
        <View style={styles.avatar}><Text style={styles.avatarText}>S</Text></View>
      </View>

      <DemoNotice />

      <Text style={styles.date}>FRIDAY, 06 NOVEMBER</Text>
      <Text style={styles.greeting}>Make today count<Text style={{ color: brand.violet }}>.</Text></Text>
      <Text style={styles.supporting}>Your goals, deadlines and study time — in one place.</Text>

      <LinearGradient colors={['#7466F3', '#4B3DCB']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={styles.heroTag}><Sparkles size={12} color="#FFF" fill="#FFF" /><Text style={styles.heroTagText}>YOUR SEMESTER AT A GLANCE</Text></View>
        <View style={styles.heroMain}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroValue}>You’re building{`\n`}momentum.</Text>
            <Text style={styles.heroCopy}>A little progress every day creates big results.</Text>
          </View>
          <View style={styles.heroOrb}>
            <Text style={styles.heroOrbValue}>{completed}/{tasks.length}</Text>
            <Text style={styles.heroOrbLabel}>TASKS DONE</Text>
          </View>
        </View>
        <View style={styles.heroBottom}>
          <View style={{ flex: 1 }}><ProgressRail percent={tasks.length ? completed / tasks.length * 100 : 0} color="#B8F3E2" /></View>
          <Text style={styles.heroBottomText}>{tasks.length ? Math.round(completed / tasks.length * 100) : 0}% TODAY</Text>
        </View>
      </LinearGradient>

      <View style={styles.stats}>
        <Surface style={styles.stat}><View style={[styles.statIcon, { backgroundColor: brand.paleBlue }]}><BookOpen color={brand.blue} size={18} /></View><Text style={styles.statValue}>04</Text><Text style={styles.statLabel}>Subjects</Text></Surface>
        <Surface style={styles.stat}><View style={[styles.statIcon, { backgroundColor: brand.paleAmber }]}><Flame color={brand.amber} size={18} /></View><Text style={styles.statValue}>03</Text><Text style={styles.statLabel}>Due soon</Text></Surface>
        <Surface style={styles.stat}><View style={[styles.statIcon, { backgroundColor: brand.mint }]}><Clock3 color={brand.green} size={18} /></View><Text style={styles.statValue}>2.5<Text style={styles.statUnit}>h</Text></Text><Text style={styles.statLabel}>Study goal</Text></Surface>
      </View>

      <SectionTitle title="Today's classes" action={<Pressable onPress={() => router.navigate('/planner')} hitSlop={8}><Text style={styles.link}>View planner  →</Text></Pressable>} />
      <Surface style={{ padding: 6 }}>
        {classes.map((item, index) => (
          <View key={item.time} style={[styles.classRow, index > 0 && { borderTopWidth: 1, borderTopColor: brand.border }]}>
            <View style={styles.timeBlock}><Text style={styles.time}>{item.time}</Text><Text style={styles.period}>{item.period}</Text></View>
            <View style={[styles.classAccent, { backgroundColor: item.color }]} />
            <View style={{ flex: 1 }}><Text style={styles.classTitle}>{item.name}</Text><Text style={styles.classMeta}>{item.details}</Text></View>
          </View>
        ))}
      </Surface>

      <SectionTitle title="Your priorities" action={<Pressable onPress={() => router.navigate('/planner')} hitSlop={8}><Text style={styles.link}>All tasks  →</Text></Pressable>} />
      <Surface style={{ padding: 6 }}>
        {tasks.slice(0, 3).map((item, index) => (
          <Pressable key={item.id} onPress={() => toggleTask(item.id)} accessibilityRole="checkbox" accessibilityState={{ checked: item.done }} style={[styles.taskRow, index > 0 && { borderTopWidth: 1, borderTopColor: brand.border }]}>
            <View style={[styles.check, item.done && styles.checkActive]}>{item.done && <Check size={13} color="#FFF" strokeWidth={3} />}</View>
            <View style={{ flex: 1 }}><Text style={[styles.taskName, item.done && styles.taskDone]}>{item.title}</Text><Text style={styles.taskSubject}>{item.subject}</Text></View>
            {item.important && !item.done ? <View style={styles.important}><Text style={styles.importantText}>HIGH</Text></View> : null}
          </Pressable>
        ))}
      </Surface>

      <Pressable onPress={() => router.navigate('/study')} style={styles.studyBanner}>
        <View style={styles.studyIcon}><Sparkles color={brand.violet} size={21} /></View>
        <View style={{ flex: 1 }}><Text style={styles.studyTitle}>Ready to focus?</Text><Text style={styles.studyText}>Start a distraction-free study session</Text></View>
        <ArrowRight size={19} color={brand.violet} />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topbar: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 24 },
  brandMark: { height: 39, width: 39, backgroundColor: brand.violet, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  brandName: { color: brand.ink, fontSize: 20, fontWeight: '900', letterSpacing: -0.9 },
  brandSub: { color: brand.muted, fontSize: 8, fontWeight: '800', letterSpacing: 1.15, marginTop: 1 },
  bell: { width: 38, height: 38, borderColor: brand.border, borderWidth: 1, backgroundColor: '#FFF', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  avatar: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#E6E3FF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontWeight: '900', color: brand.violet },
  date: { color: brand.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 7 },
  greeting: { color: brand.ink, fontSize: 31, lineHeight: 38, fontWeight: '900', letterSpacing: -1.4 },
  supporting: { color: brand.muted, fontSize: 12, marginTop: 8, marginBottom: 24, lineHeight: 18 },
  hero: { borderRadius: 25, padding: 21, minHeight: 200, justifyContent: 'space-between' },
  heroTag: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 20, backgroundColor: '#FFFFFF2E' },
  heroTagText: { color: '#FFF', fontSize: 9, fontWeight: '800', letterSpacing: 0.75 },
  heroMain: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 18 },
  heroValue: { color: '#FFF', fontSize: 23, lineHeight: 28, letterSpacing: -0.8, fontWeight: '900' },
  heroCopy: { fontSize: 11, color: '#E5E1FF', lineHeight: 17, marginTop: 9, maxWidth: 190 },
  heroOrb: { width: 94, height: 94, backgroundColor: '#FFFFFF25', borderRadius: 50, borderWidth: 2, borderColor: '#FFFFFF60', alignItems: 'center', justifyContent: 'center' },
  heroOrbValue: { color: '#FFF', fontSize: 25, fontWeight: '900' },
  heroOrbLabel: { fontSize: 8, fontWeight: '800', color: '#E1DCFF', letterSpacing: 0.5, marginTop: 2 },
  heroBottom: { flexDirection: 'row', gap: 15, alignItems: 'center' },
  heroBottomText: { fontWeight: '800', color: '#EEE9FF', fontSize: 9, letterSpacing: 0.5 },
  stats: { flexDirection: 'row', gap: 9, marginTop: 15 },
  stat: { flex: 1, padding: 13, borderRadius: 19, minWidth: 0 },
  statIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 13 },
  statValue: { fontSize: 21, fontWeight: '900', color: brand.ink, letterSpacing: -0.7 },
  statUnit: { fontSize: 11 },
  statLabel: { color: brand.muted, fontSize: 10, marginTop: 3, fontWeight: '600' },
  link: { color: brand.violet, fontSize: 11, fontWeight: '800' },
  classRow: { flexDirection: 'row', alignItems: 'center', padding: 13, gap: 13 },
  timeBlock: { width: 45 }, time: { fontSize: 14, fontWeight: '900', color: brand.ink }, period: { fontSize: 9, color: brand.muted, fontWeight: '800', marginTop: 3 },
  classAccent: { height: 38, width: 4, borderRadius: 4 },
  classTitle: { color: brand.ink, fontSize: 13, fontWeight: '800' },
  classMeta: { fontSize: 11, color: brand.muted, marginTop: 5 },
  taskRow: { minHeight: 68, paddingHorizontal: 13, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', gap: 11 },
  check: { width: 21, height: 21, borderRadius: 7, borderWidth: 1.5, borderColor: '#CBD2E2', justifyContent: 'center', alignItems: 'center' },
  checkActive: { backgroundColor: brand.green, borderColor: brand.green },
  taskName: { fontSize: 12, fontWeight: '800', color: brand.ink },
  taskDone: { textDecorationLine: 'line-through', color: brand.muted },
  taskSubject: { color: brand.muted, marginTop: 5, fontSize: 10 },
  important: { backgroundColor: brand.paleAmber, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 5 },
  importantText: { color: '#B77B37', fontSize: 8, fontWeight: '900' },
  studyBanner: { borderRadius: 19, flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: brand.lilac, gap: 12, marginTop: 24 },
  studyIcon: { width: 41, height: 41, borderRadius: 13, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  studyTitle: { color: brand.ink, fontSize: 13, fontWeight: '900' },
  studyText: { color: brand.muted, fontSize: 10, marginTop: 4 },
});
