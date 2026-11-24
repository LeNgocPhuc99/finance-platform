import { useAuth, useSignUp } from '@clerk/expo';
import { useRouter, type Href } from 'expo-router';
import { useState } from 'react';

import { AuthScreen, Field, LinkText, PrimaryButton } from '@/components/auth-form';

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const busy = fetchStatus === 'fetching';

  const handleSubmit = async () => {
    const { error } = await signUp.password({ emailAddress, password });
    if (error) return;
    await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) return;
    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          router.replace(decorateUrl('/') as Href);
        },
      });
    }
  };

  if (signUp.status === 'complete' || isSignedIn) return null;

  const needsCode =
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0;

  if (needsCode) {
    return (
      <AuthScreen title="Verify your email">
        <Field
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          placeholder="Verification code"
          error={errors.fields.code?.message}
        />
        <PrimaryButton title="Verify" onPress={handleVerify} loading={busy} disabled={!code} />
        <LinkText title="Send a new code" onPress={() => signUp.verifications.sendEmailCode()} />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen title="Sign up">
      <Field
        value={emailAddress}
        onChangeText={setEmailAddress}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        placeholder="Email"
        error={errors.fields.emailAddress?.message}
      />
      <Field
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
        placeholder="Password"
        error={errors.fields.password?.message}
      />
      <PrimaryButton
        title="Sign up"
        onPress={handleSubmit}
        loading={busy}
        disabled={!emailAddress || !password}
      />
      <LinkText title="I already have an account" onPress={() => router.replace('/sign-in')} />
    </AuthScreen>
  );
}
