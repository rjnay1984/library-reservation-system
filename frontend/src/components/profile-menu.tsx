import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import CopyTokenButton from './copy-token-btn';
import SignOut from './sign-out';
import { Button } from '@/components/ui/button';

export default async function ProfileMenu({
  name,
  groups,
}: {
  name: string;
  groups: string | null;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">My Account</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        {groups && (
          <DropdownMenuLabel className="flex gap-2 flex-wrap">
            {groups.split(',').map((group) => (
              <Badge key={group}>{group}</Badge>
            ))}
          </DropdownMenuLabel>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex gap-2">
          <SignOut />
          <CopyTokenButton />
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
