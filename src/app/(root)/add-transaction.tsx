import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddTransactionScreen() {
  return (
    <View className="flex-1 bg-white dark:bg-brand-bg">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 gap-4 p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-3xl font-semibold text-black dark:text-brand-text-primary">
              Add transaction
            </Text>
            <Pressable onPress={() => router.back()} accessibilityRole="button">
              <Text className="text-brand-blue">Cancel</Text>
            </Pressable>
          </View>
          {/* TODO: transaction form */}
        </View>
      </SafeAreaView>
    </View>
  );
}
