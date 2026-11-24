import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/features/auth/auth-context';

export default function SignInScreen() {
  const { signIn } = useAuth();
  return (
    <View className="flex-1 bg-white dark:bg-brand-bg">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 justify-center gap-4 p-4">
          <Text className="text-3xl font-semibold text-black dark:text-brand-text-primary">
            Sign in
          </Text>
          {/* TODO: replace with real API call; signIn expects the session token */}
          <Pressable onPress={() => signIn('dev-token')}>
            <Text className="text-brand-blue">Continue (dev)</Text>
          </Pressable>
          <Link href="/sign-up">
            <Text className="text-brand-blue">Create an account</Text>
          </Link>
        </View>
      </SafeAreaView>
    </View>
  );
}
