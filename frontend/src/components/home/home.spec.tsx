import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './home';
import { auth } from '@/lib/auth';

// Mock next/headers since it's a server-side module
vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue({}),
}));

// Mock the auth module
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue(null),
    },
  },
}));

// Mock the app router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test('should render the home page with the sign in button', async () => {
    render(await Home());
    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Sign In/i }),
    ).toBeInTheDocument();
  });
  test('should render the home page with session data', async () => {
    const mockSession = {
      session: {
        id: 'test-session-id',
        token: 'test-token',
        userId: 'test-user-id',
        expiresAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
      },
      user: {
        id: 'test-user-id',
        name: 'Test User',
        emailVerified: true,
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        image: null,
        groups: [],
      },
    };

    vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);

    render(await Home());
    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Sign Out/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Welcome back, ${mockSession.user.name}!`),
    ).toBeInTheDocument();
  });
});
