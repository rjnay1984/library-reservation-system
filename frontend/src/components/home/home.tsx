import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import SignOut from '../sign-out';
import { SignIn } from '../sign-in';
import CopyTokenButton from '@/components/copy-token-btn';

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const token = session
    ? await auth.api.getAccessToken({
        body: {
          providerId: '2',
        },
        headers: await headers(),
      })
    : null;

  return (
    <>
      <h1>Home Page</h1>
      {session ? (
        <>
          <h2>Welcome back, {session.user.name}!</h2>
          {session.user.groups && <div>{session.user.groups}</div>}
          {token && token.accessToken && (
            <CopyTokenButton token={token.accessToken} className="mr-2" />
          )}
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
