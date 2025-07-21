import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BookCard from './book-card';

vi.mock('@/components/ui/card');

describe('BookCard', () => {
  const mockBook = {
    id: '123-456',
    author: 'Test Author',
    title: 'Test Book',
    isbn: '123456789',
    publishedDate: '2023-01-01',
  };

  it('should render book details', () => {
    render(<BookCard book={mockBook} />);
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });
});
