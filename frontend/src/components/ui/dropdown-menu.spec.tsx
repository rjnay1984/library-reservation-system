import { vi, describe, beforeEach, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuCheckboxItem,
} from './dropdown-menu';

const MockDropdownMenu = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button>Open</button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56" align="start">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Email</DropdownMenuItem>
              <DropdownMenuItem>Message</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>More...</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem>
          New Team
          <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);

describe('DropdownMenu Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the dropdown menu with items', async () => {
    render(<MockDropdownMenu />);

    await userEvent.click(screen.getByText('Open'));
    await screen.findByRole('menu');

    expect(screen.getByText('My Account')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();

    await userEvent.hover(screen.getByText('Invite users'));
    const email = await screen.findByText('Email');
    expect(email).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();

    expect(screen.getByText('Message')).toBeInTheDocument();
    expect(screen.getByText('More...')).toBeInTheDocument();
  });

  it('renders the dropdown menu with radio items', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button>Open Radio Menu</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuRadioGroup value="option1">
              <DropdownMenuRadioItem value="option1">
                Option 1
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="option2">
                Option 2
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await userEvent.click(screen.getByText('Open Radio Menu'));
    expect(screen.getByText('Options')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toHaveRole('menuitemradio');
    expect(screen.getByText('Option 2')).toHaveRole('menuitemradio');
  });

  it('renders the dropdown menu with checkbox items', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button>Open Checkbox Menu</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>Settings</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuCheckboxItem checked={true} onCheckedChange={() => {}}>
              Setting 1
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={false}
              onCheckedChange={() => {}}
            >
              Setting 2
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await userEvent.click(screen.getByText('Open Checkbox Menu'));
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Setting 1')).toHaveRole('menuitemcheckbox');
    expect(screen.getByText('Setting 2')).toHaveRole('menuitemcheckbox');
  });
});
