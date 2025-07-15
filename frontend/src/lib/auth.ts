import { betterAuth } from 'better-auth';
import { genericOAuth } from 'better-auth/plugins';
import { Pool } from 'pg';
import z from 'zod';

const userGroupsSchema = z.preprocess((val: string[] | null) => {
  return val ? val.join(', ') : null;
}, z.string().nullable());

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.SESSION_DB_URL,
  }),
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              groups:
                'groups' in user ? userGroupsSchema.parse(user.groups) : null,
            },
          };
        },
      },
    },
  },
  user: {
    additionalFields: {
      groups: {
        type: 'string',
        required: false,
        input: false,
      },
    },
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: '2',
          clientId: 'bhjwp90QgKR3fpCEPgGYKpVNimgPZsZsoE0RPNRv',
          clientSecret:
            '1nmw9tTwKqllAdl6pfM4Po3GRySh12OVFEKBjZmEDQaQxh3vX9Mz46NmefG2Q8FKMwugNKZY0Htau4Ki3kb8tQVcVVPMwTZ64V45nR8PoT0rQFpJhh9QZrv9IJlKluld',
          discoveryUrl: `${process.env.AUTH_URL}/application/o/library/.well-known/openid-configuration`,
          redirectURI: `http://localhost:3000/api/auth/oauth2/callback/2`,
          overrideUserInfo: true,
          scopes: ['openid', 'profile', 'email', 'offline_access'],
          mapProfileToUser: async (profile) => {
            return {
              ...profile,
              groups: profile.groups
                ? userGroupsSchema.parse(profile.groups)
                : '',
            };
          },
        },
      ],
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
