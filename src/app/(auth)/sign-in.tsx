import { Link } from 'expo-router';
import { Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/features/auth/auth-context';

export default function SignInScreen() {
  const { signIn } = useAuth();
  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, padding: 16, gap: 16, justifyContent: 'center' }}>
        <ThemedText type="subtitle">Sign in</ThemedText>
        {/* TODO: replace with real API call; signIn expects the session token */}
        <Pressable onPress={() => signIn('dev-token')}>
          <ThemedText type="link">Continue (dev)</ThemedText>
        </Pressable>
        <Link href="/sign-up">
          <ThemedText type="link">Create an account</ThemedText>
        </Link>
      </SafeAreaView>
    </ThemedView>
  );
}
