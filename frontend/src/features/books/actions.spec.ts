import { vi, describe, it, expect } from 'vitest';
import { getAllBooks, getBookById } from './actions';
import { beforeEach } from 'node:test';

vi.mock('@/lib/env', () => ({
  libraryEnv: {
    API_URL: 'http://localhost',
  },
}));

describe('book-actions', () => {
  describe('getAllBooks', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
    it('should fetch all books', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({
          page: 1,
          perPage: 20,
          totalResults: 100,
          totalPages: 5,
          data: [
            {
              id: '550e8400-e29b-41d4-a716-446655440000',
              title: 'Book 1',
              author: 'Author 1',
              isbn: '123456789',
              publishedDate: '2023-01-01',
            },
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              title: 'Book 2',
              author: 'Author 2',
              isbn: '987654321',
              publishedDate: '2023-01-02',
            },
          ],
        }),
      } as Response);
      const books = await getAllBooks();
      expect(books).toBeDefined();
      expect(Array.isArray(books.data)).toBe(true);
    });
    it('throws an error when fetch fails', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error',
      } as Response);
      await expect(getAllBooks()).rejects.toThrow('Failed to fetch books');
    });
  });

  describe('getBookById', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
    it('should fetch a book by ID', async () => {
      const bookId = '550e8400-e29b-41d4-a716-446655440000';
      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({
          id: bookId,
          title: 'Book 1',
          author: 'Author 1',
          isbn: '123456789',
          publishedDate: '2023-01-01',
        }),
      } as Response);
      const book = await getBookById(bookId);
      expect(book).toBeDefined();
      expect(book.id).toBe(bookId);
    });
    it('throws an error when fetch fails', async () => {
      const bookId = '550e8400-e29b-41d4-a716-446655440000';
      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error',
      } as Response);
      await expect(getBookById(bookId)).rejects.toThrow('Failed to fetch book');
    });
  });
});
