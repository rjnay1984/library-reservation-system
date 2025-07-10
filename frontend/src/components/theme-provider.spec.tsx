import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from './theme-provider';
import { ReactNode } from 'react';

// Mock next-themes
vi.mock('next-themes', () => ({
  ThemeProvider: ({
    children,
    ...props
  }: {
    children?: ReactNode;
    [key: string]: unknown;
  }) => (
    <div
      data-testid="next-themes-provider"
      data-theme-props={JSON.stringify(props)}
    >
      {children}
    </div>
  ),
}));

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render children correctly', () => {
    const testContent = 'Test content';

    render(
      <ThemeProvider>
        <div>{testContent}</div>
      </ThemeProvider>,
    );

    expect(screen.getByText(testContent)).toBeInTheDocument();
    expect(screen.getByTestId('next-themes-provider')).toBeInTheDocument();
  });

  test('should pass props to NextThemesProvider', () => {
    const testProps = {
      defaultTheme: 'system' as const,
      enableSystem: true,
      disableTransitionOnChange: true,
    };

    render(
      <ThemeProvider {...testProps}>
        <div>Test</div>
      </ThemeProvider>,
    );

    const provider = screen.getByTestId('next-themes-provider');
    const themeProps = JSON.parse(
      provider.getAttribute('data-theme-props') || '{}',
    ) as Record<string, unknown>;

    expect(themeProps).toMatchObject(testProps);
  });

  test('should render without additional props', () => {
    render(
      <ThemeProvider>
        <div>Test content</div>
      </ThemeProvider>,
    );

    expect(screen.getByTestId('next-themes-provider')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  test('should handle multiple children', () => {
    render(
      <ThemeProvider>
        <div>First child</div>
        <div>Second child</div>
        <span>Third child</span>
      </ThemeProvider>,
    );

    expect(screen.getByText('First child')).toBeInTheDocument();
    expect(screen.getByText('Second child')).toBeInTheDocument();
    expect(screen.getByText('Third child')).toBeInTheDocument();
  });

  test('should pass through custom theme props', () => {
    const customProps = {
      defaultTheme: 'dark' as const,
      enableSystem: false,
      storageKey: 'custom-theme',
      themes: ['light', 'dark', 'custom'],
    };

    render(
      <ThemeProvider {...customProps}>
        <div>Test</div>
      </ThemeProvider>,
    );

    const provider = screen.getByTestId('next-themes-provider');
    const themeProps = JSON.parse(
      provider.getAttribute('data-theme-props') || '{}',
    ) as Record<string, unknown>;

    expect(themeProps).toMatchObject(customProps);
  });

  test('should handle empty children', () => {
    render(<ThemeProvider />);

    expect(screen.getByTestId('next-themes-provider')).toBeInTheDocument();
  });

  test('should maintain component structure when nested', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <div data-testid="wrapper">
          <header>Header</header>
          <main>Main content</main>
          <footer>Footer</footer>
        </div>
      </ThemeProvider>,
    );

    const wrapper = screen.getByTestId('wrapper');
    expect(wrapper).toBeInTheDocument();
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Main content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
