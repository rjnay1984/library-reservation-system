import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import SignOut from '../sign-out';
import { SignIn } from '../sign-in';

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      <h1>Home Page</h1>
      {session ? (
        <>
          <h2>Welcome back, {session.user.name}!</h2>
          <SignOut />
        </>
      ) : (
        <>
          <SignIn />
        </>
      )}
    </>
  );
}
