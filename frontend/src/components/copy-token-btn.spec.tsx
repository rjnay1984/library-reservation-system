import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import CopyTokenButton from './copy-token-btn';

// Mock the UI button component
vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    className,
    variant,
    ...props
  }: {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: string;
    [key: string]: unknown;
  }) => (
    <button
      onClick={onClick}
      className={className}
      data-variant={variant}
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock the authClient
const mockGetAccessToken = vi.hoisted(() => vi.fn());
vi.mock('@/lib/auth-client', () => ({
  authClient: {
    getAccessToken: mockGetAccessToken,
  },
}));

// Mock navigator.clipboard
const mockWriteText = vi.fn();
const mockClipboard = {
  writeText: mockWriteText,
};

Object.assign(navigator, {
  clipboard: mockClipboard,
});

describe('CopyTokenButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render with default props', () => {
    render(<CopyTokenButton />);

    const button = screen.getByRole('button', { name: /copy token/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Copy Token');
  });

  test('should apply custom className when provided', () => {
    const customClassName = 'custom-class';
    render(<CopyTokenButton className={customClassName} />);

    const button = screen.getByRole('button', { name: /copy token/i });
    expect(button).toHaveClass(customClassName);
  });

  test('should copy token to clipboard when clicked', async () => {
    mockGetAccessToken.mockResolvedValue({
      data: { accessToken: 'test-token-123' },
    });
    mockWriteText.mockResolvedValue(undefined);

    render(<CopyTokenButton />);

    const button = screen.getByRole('button', { name: /copy token/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledTimes(1);
      expect(mockWriteText).toHaveBeenCalledWith('test-token-123');
    });
  });

  test('should handle empty token string', async () => {
    mockGetAccessToken.mockResolvedValue({
      data: { accessToken: '' },
    });

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<CopyTokenButton />);

    const button = screen.getByRole('button', { name: /copy token/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  test('should handle clipboard write errors gracefully', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockWriteText.mockRejectedValue(new Error('Clipboard write failed'));

    render(<CopyTokenButton />);

    const button = screen.getByRole('button', { name: /copy token/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
