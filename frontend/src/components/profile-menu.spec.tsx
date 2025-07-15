import { vi, describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProfileMenu from './profile-menu';

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuSeparator: () => <hr />,
}));
vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));
vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    variant,
  }: {
    children: React.ReactNode;
    variant?: string;
  }) => <button className={variant}>{children}</button>,
}));
vi.mock('./copy-token-btn', () => ({
  default: () => <button>Copy Token</button>,
}));
vi.mock('./sign-out', () => ({
  default: () => <button>Sign Out</button>,
}));

describe('ProfileMenu', () => {
  test('renders profile menu with user name and groups', async () => {
    const { baseElement } = render(
      await ProfileMenu({
        name: 'John Doe',
        groups: 'admin,user',
      }),
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(baseElement.querySelector('span')).toBeInTheDocument();
  });

  test('renders profile menu without groups when groups prop is null', async () => {
    const { baseElement } = render(
      await ProfileMenu({ name: 'Jane Doe', groups: null }),
    );

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(baseElement.querySelector('span')).toBeNull();
  });
});
