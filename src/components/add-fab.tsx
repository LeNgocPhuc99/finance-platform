import { router } from 'expo-router';
import { Pressable, Text } from 'react-native';

/**
 * Floating "add transaction" button. Bottom-right keeps it inside the
 * right-thumb reach zone and clear of the tab bar's centre.
 */
export function AddFab() {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Add transaction"
      onPress={() => router.push('/add-transaction')}
      className="absolute bottom-6 right-4 h-14 w-14 items-center justify-center rounded-full bg-brand-blue active:opacity-80">
      <Text className="text-3xl leading-8 text-white">+</Text>
    </Pressable>
  );
}
