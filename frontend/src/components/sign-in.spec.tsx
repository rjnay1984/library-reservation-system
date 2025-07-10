import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignIn } from './sign-in';

// Mock the Button component
vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button onClick={onClick} data-testid="sign-in-button">
      {children}
    </button>
  ),
}));

// Mock the auth client with vi.fn() directly in the factory
vi.mock('@/lib/auth-client', () => ({
  authClient: {
    signIn: {
      oauth2: vi.fn(),
    },
  },
}));

describe('SignIn', () => {
  let mockSignInOAuth2: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Get the mocked function from the mocked module
    const { authClient } = await import('@/lib/auth-client');
    mockSignInOAuth2 = vi.mocked(authClient.signIn.oauth2);
    mockSignInOAuth2.mockResolvedValue(undefined);
  });

  test('should call authClient.signIn.oauth2 when button is clicked', async () => {
    render(<SignIn />);

    const button = screen.getByRole('button', { name: /Sign In/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSignInOAuth2).toHaveBeenCalledTimes(1);
    });

    expect(mockSignInOAuth2).toHaveBeenCalledWith({
      providerId: '2',
      callbackURL: '/',
    });
  });
});
