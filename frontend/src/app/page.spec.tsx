import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from './page';

// Mock the Home component
vi.mock('@/components/home/home', () => ({
  default: vi.fn(() => (
    <div data-testid="home-component">
      <h1>Mocked Home Component</h1>
    </div>
  )),
}));

describe('HomePage', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
  });

  test('should render the HomePage component', async () => {
    const result = await HomePage();
    render(result);

    expect(screen.getByTestId('home-component')).toBeInTheDocument();
    expect(screen.getByText('Mocked Home Componentt')).toBeInTheDocument();
  });
});
