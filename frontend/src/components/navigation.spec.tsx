import { vi, describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Navigation from './navigation';
import { beforeEach } from 'node:test';
import { Session } from '@/lib/auth';

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}));

const mockSessionData: Session = {
  user: {
    name: 'John Doe',
    groups: 'admin,user',
    id: '123',
    emailVerified: false,
    email: 'jondoe@email.com',
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-01T00:00:00Z'),
  },
  session: {
    id: 'session-id',
    token: 'accessToken',
    userId: '123-456',
    expiresAt: new Date('2026-01-01T00:00:00Z'),
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-01T00:00:00Z'),
  },
};
const mockSession = vi.hoisted(() => vi.fn());
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: mockSession,
    },
  },
}));

vi.mock('./sign-in');

vi.mock('./profile-menu', () => ({
  default: ({ name, groups }: { name: string; groups: string | null }) => (
    <div>
      Profile Menu Component
      <div>Name: {name}</div>
      {groups && <div>Groups: {groups}</div>}
    </div>
  ),
}));

describe('Navigation', async () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders Sign In when no session', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValue(null);

    render(await Navigation());

    expect(
      screen.getByRole('button', { name: /mock sign in/i }),
    ).toBeInTheDocument();
  });

  test('renders Profile Menu when session exists', async () => {
    mockSession.mockResolvedValue(mockSessionData);

    render(await Navigation());

    expect(screen.getByText('Profile Menu Component')).toBeInTheDocument();
  });

  test('renders Profile Menu with null groups', async () => {
    mockSession.mockResolvedValue({
      ...mockSessionData,
      user: { ...mockSessionData.user, groups: null },
    });

    render(await Navigation());

    expect(screen.getByText('Profile Menu Component')).toBeInTheDocument();
    expect(screen.queryByText('Groups:')).not.toBeInTheDocument();
  });
});
