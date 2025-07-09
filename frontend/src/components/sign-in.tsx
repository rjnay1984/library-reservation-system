'use client';

import { Button } from './ui/button';
import { authClient } from '@/lib/auth-client';

export function SignIn() {
  const handleSignIn = async () => {
    await authClient.signIn.oauth2({
      providerId: '2',
      callbackURL: `/`,
    });
  };
  return <Button onClick={handleSignIn}>Sign In</Button>;
}
