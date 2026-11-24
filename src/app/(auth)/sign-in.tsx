import { useSignIn } from '@clerk/expo';
import { useRouter, type Href } from 'expo-router';
import { useState } from 'react';

import { AuthScreen, Field, LinkText, PrimaryButton } from '@/components/auth-form';

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const busy = fetchStatus === 'fetching';

  const finalize = () =>
    signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) return;
        router.replace(decorateUrl('/') as Href);
      },
    });

  const handleSubmit = async () => {
    const { error } = await signIn.password({ emailAddress, password });
    if (error) return;
    if (signIn.status === 'complete') await finalize();
  };

  const handleVerify = async () => {
    const { error } = await signIn.mfa.verifyEmailCode({ code });
    if (error) return;
    if (signIn.status === 'complete') await finalize();
  };

  // New-device verification (Device Trust is on by default in Clerk).
  if (signIn.status === 'needs_client_trust') {
    return (
      <AuthScreen title="Verify your device">
        <Field
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          placeholder="Verification code"
        />
        <PrimaryButton title="Verify" onPress={handleVerify} loading={busy} disabled={!code} />
        <LinkText title="Send a new code" onPress={() => signIn.mfa.sendEmailCode()} />
        <LinkText title="Start over" onPress={() => signIn.reset()} />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen title="Sign in">
      <Field
        value={emailAddress}
        onChangeText={setEmailAddress}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        placeholder="Email"
        error={errors.fields.identifier?.message}
      />
      <Field
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="current-password"
        placeholder="Password"
        error={errors.fields.password?.message}
      />
      <PrimaryButton
        title="Continue"
        onPress={handleSubmit}
        loading={busy}
        disabled={!emailAddress || !password}
      />
      <LinkText title="Create an account" onPress={() => router.push('/sign-up')} />
    </AuthScreen>
  );
}
