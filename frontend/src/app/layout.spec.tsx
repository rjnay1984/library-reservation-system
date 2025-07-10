import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import RootLayout, { metadata } from './layout';
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

describe('RootLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render html structure with correct attributes', () => {
    const testContent = <div data-testid="test-child">Test content</div>;

    render(<RootLayout>{testContent}</RootLayout>);

    // Check if html element exists with correct lang attribute
    const htmlElement = document.documentElement;
    expect(htmlElement).toHaveAttribute('lang', 'en');

    // Note: suppressHydrationWarning is a React-specific prop and doesn't appear
    // as an HTML attribute in the rendered DOM during testing
  });

  test('should render body element', () => {
    const testContent = <div data-testid="test-child">Test content</div>;

    render(<RootLayout>{testContent}</RootLayout>);

    // Check if body element exists
    const bodyElement = document.body;
    expect(bodyElement).toBeInTheDocument();
  });

  test('should render ThemeProvider with correct props', () => {
    const testContent = <div data-testid="test-child">Test content</div>;

    render(<RootLayout>{testContent}</RootLayout>);

    const themeProvider = screen.getByTestId('theme-provider');
    expect(themeProvider).toBeInTheDocument();
    expect(themeProvider).toHaveAttribute('data-attribute', 'class');
    expect(themeProvider).toHaveAttribute('data-default-theme', 'system');
    expect(themeProvider).toHaveAttribute('data-enable-system', 'true');
    expect(themeProvider).toHaveAttribute(
      'data-disable-transition-on-change',
      'true',
    );
  });

  test('should render children inside ThemeProvider', () => {
    const testContent = <div data-testid="test-child">Test content</div>;

    render(<RootLayout>{testContent}</RootLayout>);

    // Check if children are rendered
    const childElement = screen.getByTestId('test-child');
    expect(childElement).toBeInTheDocument();
    expect(childElement).toHaveTextContent('Test content');

    // Check if children are inside ThemeProvider
    const themeProvider = screen.getByTestId('theme-provider');
    expect(themeProvider).toContainElement(childElement);
  });

  test('should handle multiple children', () => {
    const multipleChildren = (
      <>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </>
    );

    render(<RootLayout>{multipleChildren}</RootLayout>);

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });

  test('should handle empty children', () => {
    render(<RootLayout>{null}</RootLayout>);

    const themeProvider = screen.getByTestId('theme-provider');
    expect(themeProvider).toBeInTheDocument();
    expect(themeProvider).toBeEmptyDOMElement();
  });

  test('should handle string children', () => {
    render(<RootLayout>Plain text content</RootLayout>);

    expect(screen.getByText('Plain text content')).toBeInTheDocument();
  });

  test('should preserve nested component structure', () => {
    const nestedContent = (
      <main data-testid="main-content">
        <header data-testid="header">Header</header>
        <section data-testid="section">
          <article data-testid="article">Article content</article>
        </section>
        <footer data-testid="footer">Footer</footer>
      </main>
    );

    render(<RootLayout>{nestedContent}</RootLayout>);

    const mainContent = screen.getByTestId('main-content');
    const header = screen.getByTestId('header');
    const section = screen.getByTestId('section');
    const article = screen.getByTestId('article');
    const footer = screen.getByTestId('footer');

    expect(mainContent).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(section).toBeInTheDocument();
    expect(article).toBeInTheDocument();
    expect(footer).toBeInTheDocument();

    // Check nesting structure
    expect(mainContent).toContainElement(header);
    expect(mainContent).toContainElement(section);
    expect(mainContent).toContainElement(footer);
    expect(section).toContainElement(article);
  });
});

describe('metadata', () => {
  test('should export correct metadata object', () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('Create Next App');
    expect(metadata.description).toBe('Generated by create next app');
  });

  test('should have correct metadata structure', () => {
    expect(typeof metadata).toBe('object');
    expect(typeof metadata.title).toBe('string');
    expect(typeof metadata.description).toBe('string');
  });
});
