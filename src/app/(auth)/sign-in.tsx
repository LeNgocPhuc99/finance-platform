import { useSignIn } from "@clerk/expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter, type Href } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

import {
  AuthScreen,
  Field,
  FieldError,
  LinkText,
  PrimaryButton,
} from "@/components/auth-form";
import {
  codeSchema,
  signInSchema,
  type CodeFormSchema,
  type SignInFormSchema,
} from "@/lib/schemas/auth";

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const busy = fetchStatus === "fetching";

  const signInForm = useForm<SignInFormSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const codeForm = useForm<CodeFormSchema>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: "" },
    mode: "onBlur",
  });

  const finalize = () =>
    signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) return;
        router.replace(decorateUrl("/") as Href);
      },
    });

  const onSubmit = async ({ email, password }: SignInFormSchema) => {
    const { error } = await signIn.password({ emailAddress: email, password });
    if (error) return;

    if (signIn.status === "complete") {
      await finalize();
    } else if (signIn.status === "needs_client_trust") {
      // New device: Clerk requires an email code before the session is created.
      await signIn.mfa.sendEmailCode();
    }
  };

  const onVerify = async ({ code }: CodeFormSchema) => {
    const { error } = await signIn.mfa.verifyEmailCode({ code });
    if (error) return;
    if (signIn.status === "complete") await finalize();
  };

  if (signIn.status === "needs_client_trust") {
    return (
      <AuthScreen title="Verify your account">
        <Controller
          control={codeForm.control}
          name="code"
          render={({ field, fieldState }) => (
            <Field
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              keyboardType="number-pad"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="Enter verification code"
              error={fieldState.error?.message}
            />
          )}
        />
        <FieldError message={errors.fields.code?.message} />
        <PrimaryButton
          title="Verify"
          onPress={codeForm.handleSubmit(onVerify)}
          loading={busy}
        />
        <LinkText
          title="I need a new code"
          onPress={() => signIn.mfa.sendEmailCode()}
        />
        <LinkText title="Start over" onPress={() => signIn.reset()} />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen title="Welcome back" subtitle="Sign in to your account">
      <Controller
        control={signInForm.control}
        name="email"
        render={({ field, fieldState }) => (
          <Field
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="Email Address"
            error={fieldState.error?.message}
          />
        )}
      />
      <FieldError message={errors.fields.identifier?.message} />

      <Controller
        control={signInForm.control}
        name="password"
        render={({ field, fieldState }) => (
          <Field
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            secureTextEntry
            autoComplete="current-password"
            placeholder="Password"
            error={fieldState.error?.message}
          />
        )}
      />
      <FieldError message={errors.fields.password?.message} />

      <PrimaryButton
        title="Sign In"
        onPress={signInForm.handleSubmit(onSubmit)}
        loading={busy}
      />

      <View className="flex-row justify-center">
        <Text className="text-brand-text-muted">
          Don&apos;t have an account?{" "}
        </Text>
        <Link href="/sign-up" replace>
          <Text className="font-semibold text-brand-blue">Sign Up</Text>
        </Link>
      </View>
    </AuthScreen>
  );
}
