import z from 'zod';

const serverSchema = z.object({
  API_URL: z.url(),
});

const libraryEnv = serverSchema.parse({
  API_URL: process.env.API_URL,
});

export { libraryEnv };
