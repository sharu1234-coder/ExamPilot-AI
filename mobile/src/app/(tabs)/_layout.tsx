import { Tabs } from 'expo-router';
import { BookOpenText, CalendarDays, ChartNoAxesColumnIncreasing, House } from 'lucide-react-native';

import { brand } from '@/constants/brand';

const ICON_SIZE = 20;

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: brand.violet,
      tabBarInactiveTintColor: '#94A0B3',
      tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: brand.border, borderTopWidth: 1, height: 66, paddingTop: 7 },
      tabBarLabelStyle: { fontSize: 10, fontWeight: '700', marginBottom: 6 },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <House size={ICON_SIZE} strokeWidth={2.1} color={color} /> }} />
      <Tabs.Screen name="planner" options={{ title: 'Planner', tabBarIcon: ({ color }) => <CalendarDays size={ICON_SIZE} strokeWidth={2.1} color={color} /> }} />
      <Tabs.Screen name="study" options={{ title: 'Study', tabBarIcon: ({ color }) => <BookOpenText size={ICON_SIZE} strokeWidth={2.1} color={color} /> }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarIcon: ({ color }) => <ChartNoAxesColumnIncreasing size={ICON_SIZE} strokeWidth={2.1} color={color} /> }} />
    </Tabs>
  );
}
