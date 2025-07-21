import z from 'zod';
import { bookSchema } from './schemas/bookSchema';
import { libraryEnv } from '@/lib/env';

const getAllBooksResponseSchema = z.object({
  page: z.number().int().min(1),
  perPage: z.number().int().min(1),
  totalResults: z.number().int(),
  totalPages: z.number().int().min(1),
  data: z.array(bookSchema),
});

/**
 * Fetch all books from the API.
 * @param page - The page number to retrieve (default: 1).
 * @param perPage - The number of books per page (default: 20).
 * @returns A promise that resolves to the list of books.
 */
export const getAllBooks = async (page: number = 1, perPage: number = 20) => {
  try {
    const response = await fetch(`${libraryEnv.API_URL}/books`, {
      headers: {
        'Content-Type': 'application/json',
        PerPage: perPage.toString(),
        Page: page.toString(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    const data: unknown = await response.json();
    return getAllBooksResponseSchema.parse(data);
  } catch (error) {
    throw error;
  }
};
