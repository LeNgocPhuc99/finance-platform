import { Redirect } from 'expo-router';

import { useAuth } from '@/features/auth/auth-context';

/** Entry point for `/`: sends the user to the correct group based on session. */
export default function Index() {
  const { isSignedIn } = useAuth();
  return <Redirect href={isSignedIn ? '/home' : '/sign-in'} />;
}
