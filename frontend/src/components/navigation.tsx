import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import SignOut from './sign-out';
import { SignIn } from './sign-in';

export default async function Navigation() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="border-b border-b-white py-5 px-3 flex">
      <div className="flex items-center gap-4 ml-auto">
        {session ? (
          <>
            <div>Welcome back, {session.user.name}!</div>
            <SignOut />
          </>
        ) : (
          <SignIn />
        )}
      </div>
    </div>
  );
}
