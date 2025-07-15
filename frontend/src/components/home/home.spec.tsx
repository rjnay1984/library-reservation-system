import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './home';

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test('should render the home page with copy token button', async () => {
    render(await Home());
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });
});
