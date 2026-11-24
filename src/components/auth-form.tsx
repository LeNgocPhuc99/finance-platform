import type { ReactNode } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
} from "react-native";

export function AuthScreen({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    // Android is edge-to-edge (adjustResize is ignored), so use "padding" on
    // both platforms; the ScrollView lets tall forms scroll above the keyboard.
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 bg-brand-body dark:bg-brand-bg"
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View className="-mt-16 px-6">
          <Text className="mb-2 text-3xl font-bold leading-tight text-[#1A1D26] dark:text-brand-text-primary">
            {title}
          </Text>
          {subtitle ? (
            <Text className="mb-8 text-base text-brand-text-muted">
              {subtitle}
            </Text>
          ) : null}
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/** Error line shown under a field or a row of fields. */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <Text className="mb-4 text-sm text-brand-coral">{message}</Text>;
}

/**
 * Text input in the auth style. Pass `containerClassName` (e.g. "flex-1") to
 * lay fields out in a row; `error` renders under the input.
 */
export function Field({
  error,
  containerClassName,
  ...props
}: TextInputProps & { error?: string; containerClassName?: string }) {
  return (
    <View className={containerClassName}>
      <TextInput
        placeholderTextColor="#8A8D96"
        className="mb-2 rounded-xl border border-[#E8E6DF] bg-white px-5 py-3 text-[#1A1D26] dark:border-brand-surface-border dark:bg-brand-surface dark:text-brand-text-primary"
        {...props}
      />
      <FieldError message={error} />
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
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      className={`mb-4 w-full items-center rounded-xl bg-brand-blue py-4 ${disabled || loading ? "opacity-50" : ""}`}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-base font-semibold text-white">{title}</Text>
      )}
    </TouchableOpacity>
  );
}

export function LinkText({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      className="py-2"
    >
      <Text className="text-sm text-brand-blue">{title}</Text>
    </TouchableOpacity>
  );
}
