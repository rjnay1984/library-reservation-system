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
      getAccessToken: vi.fn().mockResolvedValue(null),
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
  test('should render the home page with copy token button', async () => {
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
    const mockGetAccessToken = {
      accessToken: 'test-access-token',
      accessTokenExpiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour from now
      tokenType: 'Bearer',
      idToken: 'test-id-token',
      scopes: ['openid', 'profile', 'email'],
    };

    vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
    vi.mocked(auth.api.getAccessToken).mockResolvedValue(mockGetAccessToken);

    render(await Home());
    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Copy Token/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Sign Out/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Welcome back, ${mockSession.user.name}!`),
    ).toBeInTheDocument();
  });
});
