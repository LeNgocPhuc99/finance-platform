import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen() {
  return (
    <View className="flex-1 bg-white dark:bg-brand-bg">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 justify-center gap-4 p-4">
          <Text className="text-3xl font-semibold text-black dark:text-brand-text-primary">
            Sign up
          </Text>
          <Link href="/sign-in">
            <Text className="text-brand-blue">Back to sign in</Text>
          </Link>
        </View>
      </SafeAreaView>
    </View>
  );
}
