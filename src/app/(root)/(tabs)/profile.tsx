import { useAuth } from '@clerk/expo';
import { Pressable, Text } from 'react-native';

import { Screen } from '@/components/screen';

export default function ProfileScreen() {
  const { signOut } = useAuth();
  return (
    <Screen title="Profile">
      <Pressable onPress={() => signOut()} accessibilityRole="button">
        <Text className="text-brand-blue">Sign out</Text>
      </Pressable>
    </Screen>
  );
}
