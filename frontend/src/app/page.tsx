import { SignIn } from '@/components/sign-in';
import SignOut from '@/components/sign-out';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <main>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <SignIn />
      <SignOut />
    </main>
  );
}
