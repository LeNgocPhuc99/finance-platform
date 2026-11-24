import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SignUpScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, padding: 16, gap: 16, justifyContent: 'center' }}>
        <ThemedText type="subtitle">Sign up</ThemedText>
        <Link href="/sign-in">
          <ThemedText type="link">Back to sign in</ThemedText>
        </Link>
      </SafeAreaView>
    </ThemedView>
  );
}
