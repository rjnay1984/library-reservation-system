import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import BookList from './book-list';
import { getAllBooks } from '../actions';

const mockBookData = [
  {
    id: '123-456',
    title: 'Book One',
    author: 'Author One',
    publishedDate: '2023-01-01',
    isbn: '1234567890',
  },
  {
    id: '123-457',
    title: 'Book Two',
    author: 'Author Two',
    publishedDate: '2023-02-01',
    isbn: '0987654321',
  },
  {
    id: '123-458',
    title: 'Book Three',
    author: 'Author Three',
    publishedDate: '2023-03-01',
    isbn: '1122334455',
  },
];

vi.mock('../actions', () => ({
  getAllBooks: vi.fn(),
}));
const mockedGetAllBooks = vi.mocked(getAllBooks);

describe('BookList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetAllBooks.mockResolvedValue({
      data: mockBookData,
      totalResults: mockBookData.length,
      page: 1,
      perPage: 10,
    });
  });

  it('should render the book list', async () => {
    render(await BookList({ params: { page: 1, perPage: 10 } }));
    expect(screen.getByText('Book List')).toBeInTheDocument();
  });
  it('should display page 2 results', async () => {
    render(await BookList({ params: { page: 2, perPage: 10 } }));
    expect(screen.getByText('Book List')).toBeInTheDocument();
    expect(mockedGetAllBooks).toBeCalledWith(2, 10);
  });
});
