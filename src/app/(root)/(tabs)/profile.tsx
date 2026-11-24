import { Pressable, Text } from 'react-native';

import { Screen } from '@/components/screen';
import { useAuth } from '@/features/auth/auth-context';

export default function ProfileScreen() {
  const { signOut } = useAuth();
  return (
    <Screen title="Profile">
      <Pressable onPress={signOut}>
        <Text className="text-brand-blue">Sign out</Text>
      </Pressable>
    </Screen>
  );
}
