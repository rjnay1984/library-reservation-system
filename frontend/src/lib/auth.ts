import { betterAuth } from 'better-auth';
import { genericOAuth } from 'better-auth/plugins';
import Database from 'better-sqlite3';

export const auth = betterAuth({
  database: new Database('./sqlite.db'),
  user: {
    additionalFields: {
      groups: {
        type: 'string[]',
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
          mapProfileToUser: async (profile) => {
            console.log('Mapping profile to user:', profile);
            return {
              ...profile,
              groups: profile.groups ? profile.groups.join(',') : '',
            };
          },
        },
      ],
    }),
  ],
});
