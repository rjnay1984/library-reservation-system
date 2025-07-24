import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import BookDetailPage from './page';

vi.mock('@/features/books/actions', () => ({
  getBookById: vi.fn().mockResolvedValue({
    title: 'Test Book',
    author: 'Test Author',
    isbn: '123456789',
  }),
}));

describe('BookDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the book detail page', async () => {
    render(await BookDetailPage({ params: { id: '1' } }));
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Author: Test Author')).toBeInTheDocument();
    expect(screen.getByText('123456789')).toBeInTheDocument();
  });
});
