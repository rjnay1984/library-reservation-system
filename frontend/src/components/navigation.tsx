import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { SignIn } from './sign-in';
import ProfileMenu from './profile-menu';

export default async function Navigation() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="border-b border-b-white py-5 px-3 flex">
      <div className="flex items-center gap-4 ml-auto">
        {session ? (
          <ProfileMenu
            name={session.user.name}
            groups={session.user.groups ?? null}
          />
        ) : (
          <SignIn />
        )}
      </div>
    </div>
  );
}
