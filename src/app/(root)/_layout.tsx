import { Stack } from 'expo-router';

import { useUserSync } from '@/hooks/useUserSync';

export default function RootGroupLayout() {
  useUserSync();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="add-transaction" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
