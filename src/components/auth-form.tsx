import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function AuthScreen({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="flex-1 bg-white dark:bg-brand-bg">
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <View className="gap-3 p-6">
              <Text className="mb-2 text-3xl font-semibold text-black dark:text-brand-text-primary">
                {title}
              </Text>
              {children}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

export function Field({ error, ...props }: TextInputProps & { error?: string }) {
  return (
    <View className="gap-1">
      <TextInput
        placeholderTextColor="#8a8d96"
        className="rounded-xl border border-gray-300 px-4 py-3 text-base text-black dark:border-brand-surface-border dark:bg-brand-surface dark:text-brand-text-primary"
        {...props}
      />
      {error ? <Text className="text-sm text-brand-coral">{error}</Text> : null}
    </View>
  );
}

export function PrimaryButton({
  title,
  onPress,
  disabled,
  loading,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      className={`items-center rounded-xl bg-brand-blue py-3.5 ${disabled || loading ? 'opacity-50' : 'active:opacity-80'}`}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text className="font-semibold text-white">{title}</Text>}
    </Pressable>
  );
}

export function LinkText({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" className="items-center py-2">
      <Text className="text-brand-blue">{title}</Text>
    </Pressable>
  );
}
