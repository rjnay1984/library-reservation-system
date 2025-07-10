import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignOut from './sign-out';
import { ReactNode } from 'react';

// Create a global mock for router refresh
const mockRouterRefresh = vi.fn();

// Mock the Button component
vi.mock('./ui/button', () => ({
  Button: ({
    children,
    onClick,
    ...props
  }: {
    children?: ReactNode;
    onClick?: () => void;
    [key: string]: unknown;
  }) => (
    <button data-testid="sign-out-button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

// Mock the auth client
vi.mock('@/lib/auth-client', () => ({
  authClient: {
    signOut: vi.fn(),
  },
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: mockRouterRefresh,
  }),
}));

describe('SignOut', () => {
  let mockAuthSignOut: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Get the mocked functions from the mocked modules
    const { authClient } = await import('@/lib/auth-client');
    mockAuthSignOut = vi.mocked(authClient.signOut);
    mockAuthSignOut.mockResolvedValue(undefined);

    // Reset the router mock
    mockRouterRefresh.mockImplementation(() => {});
  });

  test('should render sign out button with correct text', () => {
    render(<SignOut />);

    const button = screen.getByTestId('sign-out-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Sign Out');
  });

  test('should call authClient.signOut when button is clicked', async () => {
    render(<SignOut />);

    const button = screen.getByTestId('sign-out-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAuthSignOut).toHaveBeenCalledTimes(1);
    });

    expect(mockAuthSignOut).toHaveBeenCalledWith();
  });

  test('should call router.refresh after sign out', async () => {
    render(<SignOut />);

    const button = screen.getByTestId('sign-out-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAuthSignOut).toHaveBeenCalledTimes(1);
      expect(mockRouterRefresh).toHaveBeenCalledTimes(1);
    });
  });

  test('should call sign out and refresh in correct order', async () => {
    const callOrder: string[] = [];

    mockAuthSignOut.mockImplementation(async () => {
      callOrder.push('signOut');
    });

    mockRouterRefresh.mockImplementation(() => {
      callOrder.push('refresh');
    });

    render(<SignOut />);

    const button = screen.getByTestId('sign-out-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAuthSignOut).toHaveBeenCalledTimes(1);
      expect(mockRouterRefresh).toHaveBeenCalledTimes(1);
    });

    expect(callOrder).toEqual(['signOut', 'refresh']);
  });
});
