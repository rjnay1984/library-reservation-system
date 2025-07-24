import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import BookList from './book-list';
import { getAllBooks } from '../actions';
import { Book } from '../schemas/bookSchema';

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

vi.mock('@/components/ui/pagination');
vi.mock('@/components/ui/button');
vi.mock('./book-card', () => ({
  __esModule: true,
  default: ({ book }: { book: Book }) => (
    <div data-testid="mock-book-card">{book.title}</div>
  ),
}));
describe('BookList', () => {
  const mockedGetAllBooks = vi.mocked(getAllBooks);
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetAllBooks.mockResolvedValue({
      data: mockBookData,
      totalResults: mockBookData.length,
      page: 1,
      perPage: 10,
      totalPages: 1,
    });
  });

  it('should render the book list', async () => {
    render(await BookList({ params: { page: 1, perPage: 10 } }));
    expect(screen.getByText('Book List')).toBeInTheDocument();
    expect(screen.queryAllByTestId('mock-book-card').length).toBe(3);
  });
  it('should display page 2 results', async () => {
    render(await BookList({ params: { page: 2, perPage: 10 } }));
    expect(screen.getByText('Book List')).toBeInTheDocument();
    expect(mockedGetAllBooks).toBeCalledWith(2, 10);
  });
  it('should display no books found when no books are returned', async () => {
    mockedGetAllBooks.mockResolvedValue({
      data: [],
      totalResults: 0,
      page: 1,
      perPage: 10,
      totalPages: 1,
    });
    render(await BookList({ params: { page: 1, perPage: 10 } }));
    expect(screen.getByText('No books found.')).toBeInTheDocument();
  });

  describe('BookList Pagination', () => {
    it('should render pagination when totalPages is > 2 (page 1)', async () => {
      mockedGetAllBooks.mockResolvedValueOnce({
        data: mockBookData,
        totalResults: mockBookData.length,
        page: 1,
        perPage: 10,
        totalPages: 10,
      });
      render(await BookList({ params: { page: 1, perPage: 10 } }));
      expect(screen.getByTestId('mock-pagination-next')).toBeInTheDocument();
      expect(
        screen.getByTestId('mock-pagination-ellipsis'),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('mock-pagination-previous'),
      ).not.toBeInTheDocument();
    });
    it('should render ellipsis when user is on page 3 or above', async () => {
      mockedGetAllBooks.mockResolvedValueOnce({
        data: mockBookData,
        totalResults: mockBookData.length,
        page: 3,
        perPage: 10,
        totalPages: 10,
      });
      render(await BookList({ params: { page: 3, perPage: 10 } }));
      expect(screen.queryAllByTestId('mock-pagination-ellipsis').length).toBe(
        2,
      );
    });
  });
});
