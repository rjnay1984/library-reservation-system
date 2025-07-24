import z from 'zod';

const serverSchema = z.object({
  API_URL: z.url(),
  SESSION_DB_URL: z.string(),
  AUTH_URL: z.string().url(),
});

const libraryEnv = serverSchema.parse({
  API_URL: process.env.API_URL,
  SESSION_DB_URL: process.env.SESSION_DB_URL,
  AUTH_URL: process.env.AUTH_URL,
});

export { libraryEnv };
