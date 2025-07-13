import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import RootLayout from './layout';
import { ReactNode } from 'react';

// Mock the ThemeProvider component
vi.mock('@/components/theme-provider', () => ({
  ThemeProvider: ({
    children,
    attribute,
    defaultTheme,
    enableSystem,
    disableTransitionOnChange,
  }: {
    children?: ReactNode;
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
  }) => (
    <div
      data-testid="theme-provider"
      data-attribute={attribute}
      data-default-theme={defaultTheme}
      data-enable-system={enableSystem}
      data-disable-transition-on-change={disableTransitionOnChange}
    >
      {children}
    </div>
  ),
}));

// Mock CSS import
vi.mock('./globals.css', () => ({}));

// Mock the Navigation component
vi.mock('@/components/navigation', () => ({
  __esModule: true,
  default: () => <div data-testid="mockNavigation">Navigation</div>,
}));

describe('RootLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders navigation component', () => {
    render(<RootLayout>{<div>Test Child</div>}</RootLayout>);

    expect(screen.getByTestId('mockNavigation')).toBeInTheDocument();
  });
  test('renders children correctly', () => {
    const children = <div>Test Child</div>;
    render(<RootLayout>{children}</RootLayout>);

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
});
