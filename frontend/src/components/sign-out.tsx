'use client';
import { authClient } from '@/lib/auth-client';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export default function SignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
  };

  return <Button onClick={handleSignOut}>Sign Out</Button>;
}
