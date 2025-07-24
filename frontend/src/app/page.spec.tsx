import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from './page';

// Mock the Home component
vi.mock('@/features/home/components/home', () => ({
  default: vi.fn(() => (
    <div data-testid="home-component">
      <h1>Mocked Home Component</h1>
    </div>
  )),
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render the HomePage component', async () => {
    render(
      await HomePage({
        searchParams: Promise.resolve({ page: '1', perPage: '10' }),
      }),
    );

    expect(screen.getByTestId('home-component')).toBeInTheDocument();
    expect(screen.getByText('Mocked Home Component')).toBeInTheDocument();
  });
});
