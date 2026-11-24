import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/features/auth/auth-context';

export default function ProfileScreen() {
  const { signOut } = useAuth();
  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView edges={['top']} style={{ flex: 1, padding: 16, gap: 16 }}>
        <ThemedText type="subtitle">Profile</ThemedText>
        <Pressable onPress={signOut}>
          <ThemedText type="link">Sign out</ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}
