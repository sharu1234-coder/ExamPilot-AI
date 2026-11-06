import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { DemoStudentProvider } from '@/state/demo-student';

export default function RootLayout() {
  return (
    <DemoStudentProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </DemoStudentProvider>
  );
}
