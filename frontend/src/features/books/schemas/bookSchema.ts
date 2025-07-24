import z from 'zod';

export const bookSchema = z.object({
  id: z.uuid(),
  title: z.string().min(2).max(100),
  author: z.string().min(2).max(100),
  publishedDate: z.string(),
  isbn: z.string().length(9),
});

export type Book = z.infer<typeof bookSchema>;
