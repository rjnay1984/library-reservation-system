import z from 'zod';

/**
 * Schema for pagination parameters.
 * @param page - The page number to retrieve (default: 1).
 * @param perPage - The number of items per page (default: 20).
 */
export const paramsSchema = z.object({
  page: z.coerce.number().positive().optional().default(1).catch(1),
  perPage: z.coerce.number().min(1).optional().default(20).catch(20),
});

export type Params = z.infer<typeof paramsSchema>;
