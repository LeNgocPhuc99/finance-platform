import { useAuth, useSignUp } from "@clerk/expo";
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
  signUpSchema,
  type CodeFormSchema,
  type SignUpFormSchema,
} from "@/lib/schemas/auth";

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const busy = fetchStatus === "fetching";

  const signUpForm = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
    mode: "onBlur",
  });
  const formErrors = signUpForm.formState.errors;

  const codeForm = useForm<CodeFormSchema>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: "" },
    mode: "onBlur",
  });

  const onSubmit = async ({
    firstName,
    lastName,
    email,
    password,
  }: SignUpFormSchema) => {
    const { error } = await signUp.password({
      emailAddress: email,
      password,
      firstName,
      lastName,
    });
    if (error) return;
    await signUp.verifications.sendEmailCode();
  };

  const onVerify = async ({ code }: CodeFormSchema) => {
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) return;
    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          router.replace(decorateUrl("/") as Href);
        },
      });
    }
  };

  if (signUp.status === "complete" || isSignedIn) return null;

  const needsCode =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  if (needsCode) {
    return (
      <AuthScreen
        title="Verify your account"
        subtitle={`We sent a code to ${signUpForm.getValues("email")}`}
      >
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
          onPress={() => signUp.verifications.sendEmailCode()}
        />
        <LinkText title="Start over" onPress={() => signUp.reset()} />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      title="Create account"
      subtitle="Track your money, powered by AI"
    >
      <View className="flex-row gap-3">
        <Controller
          control={signUpForm.control}
          name="firstName"
          render={({ field }) => (
            <Field
              containerClassName="flex-1"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              autoCapitalize="words"
              autoComplete="given-name"
              placeholder="First name"
            />
          )}
        />
        <Controller
          control={signUpForm.control}
          name="lastName"
          render={({ field }) => (
            <Field
              containerClassName="flex-1"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              autoCapitalize="words"
              autoComplete="family-name"
              placeholder="Last name"
            />
          )}
        />
      </View>
      <FieldError
        message={formErrors.firstName?.message ?? formErrors.lastName?.message}
      />

      <Controller
        control={signUpForm.control}
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
      <FieldError message={errors.fields.emailAddress?.message} />

      <Controller
        control={signUpForm.control}
        name="password"
        render={({ field, fieldState }) => (
          <Field
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            secureTextEntry
            autoComplete="new-password"
            placeholder="Password"
            error={fieldState.error?.message}
          />
        )}
      />
      <FieldError message={errors.fields.password?.message} />

      <PrimaryButton
        title="Sign Up"
        onPress={signUpForm.handleSubmit(onSubmit)}
        loading={busy}
      />

      <View className="flex-row justify-center">
        <Text className="text-brand-text-muted">Already have an account? </Text>
        <Link href="/sign-in" replace>
          <Text className="font-semibold text-brand-blue">Sign In</Text>
        </Link>
      </View>
    </AuthScreen>
  );
}
