import z from 'zod';

/**
 * Schema for pagination parameters.
 * @param page - The page number to retrieve (default: 1).
 * @param perPage - The number of items per page (default: 20).
 */
export const paramsSchema = z.preprocess(
  (val) => {
    const page =
      val && typeof val === 'object' && 'page' in val
        ? parseInt(val.page as string, 10)
        : 1;
    const perPage =
      val && typeof val === 'object' && 'perPage' in val
        ? parseInt(val.perPage as string, 10)
        : 20;
    return { page, perPage };
  },
  z.object({
    page: z.number().optional().default(1),
    perPage: z.number().optional().default(20),
  }),
);
export type Params = z.infer<typeof paramsSchema>;
