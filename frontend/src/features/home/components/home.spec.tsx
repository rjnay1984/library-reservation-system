import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './home';

vi.mock('@/features/books/components/book-list', () => ({
  __esModule: true,
  default: vi.fn(() => <div>Mocked Book List</div>),
}));

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test('should render the home page with a book list', () => {
    render(<Home searchParams={{ page: 1, perPage: 10 }} />);
    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.getByText('Mocked Book List')).toBeInTheDocument();
  });
});
