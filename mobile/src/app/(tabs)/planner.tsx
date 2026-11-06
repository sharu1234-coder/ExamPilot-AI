import { useState } from 'react';
import { Check, Clock3, MapPin, Plus, X } from 'lucide-react-native';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DemoNotice, Eyebrow, Heading, Screen, SectionTitle, Surface } from '@/components/student-ui';
import { brand } from '@/constants/brand';
import { useDemoStudent } from '@/state/demo-student';

const days = [
  { label: 'M', date: '02' }, { label: 'T', date: '03' }, { label: 'W', date: '04' },
  { label: 'T', date: '05' }, { label: 'F', date: '06' }, { label: 'S', date: '07' }, { label: 'S', date: '08' },
];

const sessionsByDay: Record<number, { time: string; title: string; type: string; location: string; accent: string }[]> = {
  0: [{ time: '10:00 AM', title: 'Data Structures', type: 'Lecture', location: 'Room 305', accent: brand.blue }],
  1: [{ time: '09:30 AM', title: 'Molecular Biology', type: 'Lecture', location: 'Room B-110', accent: brand.violet }],
  2: [{ time: '02:00 PM', title: 'Bioprocess Lab', type: 'Practical', location: 'Lab 02', accent: brand.green }],
  3: [{ time: '11:00 AM', title: 'Database Systems', type: 'Lecture', location: 'Room 210', accent: brand.blue }],
  4: [
    { time: '09:00 AM', title: 'Bioprocess Engineering', type: 'Lecture', location: 'Room B-204', accent: brand.violet },
    { time: '11:30 AM', title: 'Database Systems', type: 'Lab', location: 'Computer Centre', accent: brand.green },
  ],
  5: [{ time: '10:00 AM', title: 'Personal study block', type: 'Self study', location: 'Anywhere', accent: brand.amber }],
  6: [],
};

export default function Planner() {
  const [day, setDay] = useState(4);
  const [addOpen, setAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const { tasks, toggleTask, addTask, ready, storageError } = useDemoStudent();

  function saveTask() {
    const next = newTitle.trim();
    if (!next || !ready) return;
    addTask(next);
    setNewTitle('');
    setAddOpen(false);
  }

  return (
    <Screen>
      <DemoNotice />
      <Eyebrow>THE SEMESTER, SIMPLIFIED</Eyebrow>
      <Heading title="My planner" subtitle="See what's next. Stay one step ahead." />

      <Surface style={{ padding: 16 }}>
        <View style={styles.calendarHeader}><View><Text style={styles.month}>November 2026</Text><Text style={styles.monthHint}>Your weekly schedule</Text></View><View style={styles.weekBadge}><Text style={styles.weekText}>WEEK VIEW</Text></View></View>
        <View style={styles.days}>
          {days.map((item, index) => (
            <Pressable key={index} onPress={() => setDay(index)} accessibilityRole="button" accessibilityState={{ selected: day === index }} style={[styles.day, day === index && styles.dayActive]}>
              <Text style={[styles.dayLabel, day === index && styles.dayLabelActive]}>{item.label}</Text>
              <Text style={[styles.dayDate, day === index && styles.dayDateActive]}>{item.date}</Text>
              <View style={[styles.dayDot, { backgroundColor: day === index ? '#FFF' : sessionsByDay[index].length ? brand.violet : 'transparent' }]} />
            </Pressable>
          ))}
        </View>
      </Surface>

      <SectionTitle title="Class schedule" action={<Text style={styles.count}>{sessionsByDay[day].length} sessions</Text>} />
      {sessionsByDay[day].length ? sessionsByDay[day].map((session) => (
        <Surface key={session.time} style={styles.classCard}>
          <View style={[styles.classLine, { backgroundColor: session.accent }]} />
          <View style={{ flex: 1 }}><View style={styles.miniLine}><Clock3 size={12} color={brand.muted} /><Text style={styles.classTime}>{session.time}</Text></View><Text style={styles.classTitle}>{session.title}</Text><View style={styles.miniLine}><MapPin size={12} color={brand.muted} /><Text style={styles.classLocation}>{session.location}</Text></View></View>
          <View style={styles.typeBadge}><Text style={styles.typeText}>{session.type}</Text></View>
        </Surface>
      )) : <Surface><Text style={styles.emptyTitle}>No sessions in this demo schedule.</Text><Text style={styles.emptyCopy}>Enjoy the space to recharge or catch up on your goals.</Text></Surface>}

      <SectionTitle title="Tasks & deadlines" action={<Pressable onPress={() => setAddOpen(true)} disabled={!ready} style={[styles.addButton, !ready && { opacity: 0.5 }]}><Plus color={brand.violet} size={15} strokeWidth={2.5} /><Text style={styles.addLabel}>Add task</Text></Pressable>} />
      <Surface style={{ padding: 7 }}>
        {!ready && !storageError ? (
          <Text style={styles.emptyCopy}>Loading your saved tasks...</Text>
        ) : null}
        {storageError ? (
          <Text style={styles.emptyCopy}>{storageError}</Text>
        ) : null}
        {ready && tasks.length === 0 ? (
          <Text style={styles.emptyCopy}>
            No tasks yet. Tap Add task to create your first one.
          </Text>
        ) : null}
        {tasks.map((task, index) => (
          <Pressable key={task.id} onPress={() => toggleTask(task.id)} accessibilityRole="checkbox" accessibilityState={{ checked: task.done }} style={[styles.taskRow, index > 0 && { borderTopWidth: 1, borderTopColor: brand.border }]}>
            <View style={[styles.checkbox, task.done && styles.checked]}>{task.done ? <Check size={13} color="#FFF" strokeWidth={3} /> : null}</View>
            <View style={{ flex: 1 }}><Text style={[styles.taskTitle, task.done && { textDecorationLine: 'line-through', color: brand.muted }]}>{task.title}</Text><Text style={styles.taskDetail}>{task.subject} Â· {task.due}</Text></View>
            {task.important && !task.done && <View style={styles.priority}><Text style={styles.priorityText}>HIGH</Text></View>}
          </Pressable>
        ))}
      </Surface>

      <Modal visible={addOpen} transparent animationType="fade" onRequestClose={() => setAddOpen(false)}>
        <SafeAreaView style={styles.modalBack}>
          <View style={styles.modalCard}>
            <View style={styles.modalHead}><Text style={styles.modalTitle}>New task</Text><Pressable accessibilityLabel="Close" onPress={() => setAddOpen(false)}><X color={brand.ink} size={22} /></Pressable></View>
            <Text style={styles.modalDescription}>Add a task to your planner. It will be saved on this device.</Text>
            <TextInput style={styles.field} autoFocus value={newTitle} onChangeText={setNewTitle} placeholder="e.g. Review chapter 3" placeholderTextColor={brand.muted} maxLength={100} returnKeyType="done" onSubmitEditing={saveTask} />
            <Pressable onPress={saveTask} disabled={!newTitle.trim()} style={[styles.saveButton, !newTitle.trim() && { opacity: 0.5 }]}><Text style={styles.saveText}>Add to planner</Text></Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  month: { fontWeight: '900', color: brand.ink, fontSize: 17 }, monthHint: { fontSize: 11, color: brand.muted, marginTop: 5 },
  weekBadge: { backgroundColor: brand.lilac, borderRadius: 8, paddingVertical: 7, paddingHorizontal: 9 }, weekText: { color: brand.violet, fontSize: 9, fontWeight: '800' },
  days: { flexDirection: 'row', justifyContent: 'space-between', gap: 3 },
  day: { alignItems: 'center', justifyContent: 'center', flex: 1, height: 72, borderRadius: 15 }, dayActive: { backgroundColor: brand.violet },
  dayLabel: { color: brand.muted, fontSize: 10, fontWeight: '800' }, dayLabelActive: { color: '#E2DFFF' },
  dayDate: { color: brand.ink, fontWeight: '900', fontSize: 15, marginTop: 7 }, dayDateActive: { color: '#FFF' },
  dayDot: { height: 4, width: 4, borderRadius: 4, marginTop: 6 }, count: { fontSize: 11, color: brand.muted, fontWeight: '700' },
  classCard: { marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 13, padding: 16 },
  classLine: { width: 4, height: 70, borderRadius: 4 },
  miniLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  classTime: { color: brand.muted, fontSize: 11, fontWeight: '700' }, classTitle: { color: brand.ink, fontSize: 15, fontWeight: '900', marginTop: 8 },
  classLocation: { color: brand.muted, marginTop: 7, fontSize: 11 }, typeBadge: { backgroundColor: brand.canvas, borderRadius: 7, paddingHorizontal: 9, paddingVertical: 6 }, typeText: { color: brand.body, fontSize: 9, fontWeight: '800' },
  addButton: { backgroundColor: brand.lilac, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 }, addLabel: { color: brand.violet, fontSize: 11, fontWeight: '900' },
  taskRow: { padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 69 },
  checkbox: { width: 22, height: 22, borderRadius: 7, borderWidth: 1.5, borderColor: '#C7D1E0', alignItems: 'center', justifyContent: 'center' }, checked: { backgroundColor: brand.green, borderColor: brand.green },
  taskTitle: { color: brand.ink, fontSize: 12, fontWeight: '800' }, taskDetail: { color: brand.muted, fontSize: 10, marginTop: 6 },
  priority: { backgroundColor: brand.paleAmber, borderRadius: 7, paddingVertical: 5, paddingHorizontal: 8 }, priorityText: { fontSize: 8, fontWeight: '900', color: '#B9833D' },
  emptyTitle: { color: brand.ink, fontWeight: '800', fontSize: 13 }, emptyCopy: { color: brand.muted, fontSize: 11, lineHeight: 18, marginTop: 7 },
  modalBack: { flex: 1, backgroundColor: '#11182780', padding: 22, justifyContent: 'center' }, modalCard: { backgroundColor: '#FFF', borderRadius: 25, padding: 24 },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, modalTitle: { color: brand.ink, fontSize: 21, fontWeight: '900' },
  modalDescription: { color: brand.muted, fontSize: 12, marginTop: 8, marginBottom: 20 },
  field: { backgroundColor: brand.canvas, borderColor: brand.border, borderWidth: 1, borderRadius: 13, height: 50, paddingHorizontal: 14, fontSize: 14, color: brand.ink },
  saveButton: { backgroundColor: brand.violet, borderRadius: 13, padding: 16, alignItems: 'center', marginTop: 16 }, saveText: { color: '#FFF', fontSize: 13, fontWeight: '900' },
});

