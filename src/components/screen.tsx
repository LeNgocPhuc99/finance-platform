import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddFab } from '@/components/add-fab';

type ScreenProps = {
  title: string;
  children?: ReactNode;
  /** Show the floating add-transaction button. */
  fab?: boolean;
};

/** Standard tab screen frame: themed background, top safe area, title. */
export function Screen({ title, children, fab = false }: ScreenProps) {
  return (
    <View className="flex-1 bg-white dark:bg-brand-bg">
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View className="flex-1 gap-4 p-4">
          <Text className="text-3xl font-semibold text-black dark:text-brand-text-primary">
            {title}
          </Text>
          {children}
        </View>
        {fab && <AddFab />}
      </SafeAreaView>
    </View>
  );
}
