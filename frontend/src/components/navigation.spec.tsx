import { vi, describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Navigation from './navigation';
import { beforeEach } from 'node:test';

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock('./sign-out', () => ({
  default: () => <div>Sign Out Component</div>,
}));

vi.mock('./sign-in', () => ({
  SignIn: () => <div>Sign In Component</div>,
}));

describe('Navigation', async () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test('renders Sign In when no session', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValue(null);

    render(await Navigation());

    expect(screen.getByText('Sign In Component')).toBeInTheDocument();
  });
  test('renders Sign Out when session exists', async () => {
    const { auth } = await import('@/lib/auth');
    const mockSession = { user: { name: 'John Doe' } };
    vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);

    render(await Navigation());

    expect(
      screen.getByText(`Welcome back, ${mockSession.user.name}!`),
    ).toBeInTheDocument();
    expect(screen.getByText('Sign Out Component')).toBeInTheDocument();
  });
});
