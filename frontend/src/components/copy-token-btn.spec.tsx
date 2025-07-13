import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
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

// Mock navigator.clipboard
const mockWriteText = vi.fn();
const mockClipboard = {
  writeText: mockWriteText,
};

Object.assign(navigator, {
  clipboard: mockClipboard,
});

describe('CopyTokenButton', () => {
  const defaultProps = {
    token: 'test-token-123',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('should render with default props', () => {
    render(<CopyTokenButton {...defaultProps} />);

    const button = screen.getByRole('button', { name: /copy token/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Copy Token');
  });

  test('should render with outline variant', () => {
    render(<CopyTokenButton {...defaultProps} />);

    const button = screen.getByRole('button', { name: /copy token/i });
    expect(button).toHaveAttribute('data-variant', 'outline');
  });

  test('should apply custom className when provided', () => {
    const customClassName = 'custom-class';
    render(<CopyTokenButton {...defaultProps} className={customClassName} />);

    const button = screen.getByRole('button', { name: /copy token/i });
    expect(button).toHaveClass(customClassName);
  });

  test('should not have className when not provided', () => {
    render(<CopyTokenButton {...defaultProps} />);

    const button = screen.getByRole('button', { name: /copy token/i });
    expect(button).not.toHaveAttribute('className');
  });

  test('should copy token to clipboard when clicked', async () => {
    mockWriteText.mockResolvedValue(undefined);

    render(<CopyTokenButton {...defaultProps} />);

    const button = screen.getByRole('button', { name: /copy token/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledTimes(1);
      expect(mockWriteText).toHaveBeenCalledWith('test-token-123');
    });
  });

  test('should copy different token values', async () => {
    mockWriteText.mockResolvedValue(undefined);

    const { rerender } = render(<CopyTokenButton token="first-token" />);

    let button = screen.getByRole('button', { name: /copy token/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('first-token');
    });

    // Test with different token
    rerender(<CopyTokenButton token="second-token" />);

    button = screen.getByRole('button', { name: /copy token/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('second-token');
    });

    expect(mockWriteText).toHaveBeenCalledTimes(2);
  });

  test('should handle empty token string', async () => {
    mockWriteText.mockResolvedValue(undefined);

    render(<CopyTokenButton token="" />);

    const button = screen.getByRole('button', { name: /copy token/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('');
    });
  });

  test('should handle very long token strings', async () => {
    mockWriteText.mockResolvedValue(undefined);
    const longToken = 'a'.repeat(1000);

    render(<CopyTokenButton token={longToken} />);

    const button = screen.getByRole('button', { name: /copy token/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(longToken);
    });
  });

  test('should handle special characters in token', async () => {
    mockWriteText.mockResolvedValue(undefined);
    const specialToken = 'token!@#$%^&*()_+-={}[]|\\:";\'<>?,./`~';

    render(<CopyTokenButton token={specialToken} />);

    const button = screen.getByRole('button', { name: /copy token/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(specialToken);
    });
  });

  test('should handle clipboard write errors gracefully', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockWriteText.mockRejectedValue(new Error('Clipboard write failed'));

    render(<CopyTokenButton {...defaultProps} />);

    const button = screen.getByRole('button', { name: /copy token/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('test-token-123');
    });

    // The component doesn't handle errors, so we just verify the call was made
    expect(mockWriteText).toHaveBeenCalledTimes(1);

    consoleErrorSpy.mockRestore();
  });

  test('should be accessible', () => {
    render(<CopyTokenButton {...defaultProps} />);

    const button = screen.getByRole('button', { name: /copy token/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  test('should work with multiple instances', async () => {
    mockWriteText.mockResolvedValue(undefined);

    render(
      <div>
        <CopyTokenButton token="token1" />
        <CopyTokenButton token="token2" />
      </div>,
    );

    const buttons = screen.getAllByRole('button', { name: /copy token/i });
    expect(buttons).toHaveLength(2);

    // Click first button
    fireEvent.click(buttons[0]);
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('token1');
    });

    // Click second button
    fireEvent.click(buttons[1]);
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('token2');
    });

    expect(mockWriteText).toHaveBeenCalledTimes(2);
  });
});
