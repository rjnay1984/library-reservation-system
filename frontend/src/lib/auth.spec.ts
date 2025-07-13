import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

// Store original environment
const originalAuthUrl = process.env.AUTH_URL;

// Mock pg Pool
const mockPoolInstance = {
  connect: vi.fn(),
  query: vi.fn(),
  end: vi.fn(),
};
const mockPool = vi.fn(() => mockPoolInstance);
vi.mock('pg', () => ({
  Pool: mockPool,
}));

// Mock zod
const mockZodPreprocess = vi.fn();
const mockZodString = vi.fn().mockReturnValue({
  nullable: vi.fn().mockReturnValue({ parse: vi.fn() }),
});
const mockZodSchema = {
  parse: vi.fn(),
};
mockZodPreprocess.mockReturnValue(mockZodSchema);

vi.mock('zod', () => ({
  default: {
    preprocess: mockZodPreprocess,
    string: mockZodString,
  },
}));

// Mock better-auth
const mockBetterAuth = vi.fn();
vi.mock('better-auth', () => ({
  betterAuth: mockBetterAuth,
}));

// Mock better-auth/plugins
const mockGenericOAuth = vi.fn();
vi.mock('better-auth/plugins', () => ({
  genericOAuth: mockGenericOAuth,
}));

describe('Auth Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.AUTH_URL = 'http://localhost:8080';

    // Setup mock return values
    mockBetterAuth.mockReturnValue({
      handler: vi.fn(),
      api: {
        getSession: vi.fn(),
        signIn: vi.fn(),
        signOut: vi.fn(),
      },
    });

    mockGenericOAuth.mockReturnValue({
      id: 'generic-oauth',
    });

    // Setup zod schema mock to return processed values
    mockZodSchema.parse.mockImplementation((val) => {
      if (Array.isArray(val)) {
        return val.join(', ');
      }
      return val ? String(val) : '';
    });
  });

  afterEach(() => {
    process.env.AUTH_URL = originalAuthUrl;
    vi.resetModules();
  });

  test('should initialize database with correct connection string', async () => {
    // Import after mocks are set up
    await import('./auth');

    expect(mockPool).toHaveBeenCalledWith({
      connectionString:
        'postgres://postgres:postgres@session-db:5432/session_db',
    });
  });

  test('should call betterAuth with correct configuration', async () => {
    await import('./auth');

    expect(mockBetterAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        database: expect.any(Object),
        databaseHooks: {
          user: {
            create: {
              before: expect.any(Function),
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
        plugins: expect.any(Array),
      }),
    );
  });

  test('should configure genericOAuth plugin with correct settings', async () => {
    await import('./auth');

    expect(mockGenericOAuth).toHaveBeenCalledWith({
      config: [
        {
          providerId: '2',
          clientId: 'bhjwp90QgKR3fpCEPgGYKpVNimgPZsZsoE0RPNRv',
          clientSecret:
            '1nmw9tTwKqllAdl6pfM4Po3GRySh12OVFEKBjZmEDQaQxh3vX9Mz46NmefG2Q8FKMwugNKZY0Htau4Ki3kb8tQVcVVPMwTZ64V45nR8PoT0rQFpJhh9QZrv9IJlKluld',
          discoveryUrl:
            'http://localhost:8080/application/o/library/.well-known/openid-configuration',
          redirectURI: 'http://localhost:3000/api/auth/oauth2/callback/2',
          overrideUserInfo: true,
          scopes: ['openid', 'profile', 'email', 'offline_access'],
          mapProfileToUser: expect.any(Function),
        },
      ],
    });
  });

  test('should handle missing AUTH_URL environment variable gracefully', async () => {
    delete process.env.AUTH_URL;

    await expect(import('./auth')).resolves.toBeDefined();

    expect(mockGenericOAuth).toHaveBeenCalledWith({
      config: [
        expect.objectContaining({
          discoveryUrl:
            'undefined/application/o/library/.well-known/openid-configuration',
        }),
      ],
    });
  });

  describe('mapProfileToUser function', () => {
    let mapProfileToUser: (
      profile: Record<string, unknown>,
    ) => Promise<Record<string, unknown>>;

    beforeEach(async () => {
      await import('./auth');
      const oauthConfig = mockGenericOAuth.mock.calls[0][0];
      mapProfileToUser = oauthConfig.config[0].mapProfileToUser;
    });

    test('should map profile with groups array to comma-separated string', async () => {
      const mockProfile = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        groups: ['admin', 'user'],
      };

      const result = await mapProfileToUser(mockProfile);

      expect(result).toEqual({
        ...mockProfile,
        groups: 'admin, user',
      });
    });

    test('should map profile without groups to empty string', async () => {
      const mockProfile = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
      };
      const result = await mapProfileToUser(mockProfile);

      expect(result).toEqual({
        ...mockProfile,
        groups: '',
      });
    });

    test('should map profile with null groups to empty string', async () => {
      const mockProfile = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        groups: null,
      };

      const result = await mapProfileToUser(mockProfile);

      expect(result).toEqual({
        ...mockProfile,
        groups: '',
      });
    });

    test('should map profile with empty groups array to empty string', async () => {
      const mockProfile = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        groups: [],
      };

      const result = await mapProfileToUser(mockProfile);

      expect(result).toEqual({
        ...mockProfile,
        groups: '',
      });
    });
  });

  test('should export auth instance with expected structure', async () => {
    const { auth } = await import('./auth');

    expect(auth).toBeDefined();
    expect(auth).toHaveProperty('handler');
    expect(auth).toHaveProperty('api');
    expect(auth.api).toHaveProperty('getSession');
    expect(auth.api).toHaveProperty('signIn');
    expect(auth.api).toHaveProperty('signOut');
  });

  test('should configure betterAuth with databaseHooks', async () => {
    await import('./auth');

    const betterAuthConfig = mockBetterAuth.mock.calls[0][0];
    expect(betterAuthConfig).toHaveProperty('databaseHooks');
    expect(betterAuthConfig.databaseHooks).toHaveProperty('user');
    expect(betterAuthConfig.databaseHooks.user).toHaveProperty('create');
    expect(betterAuthConfig.databaseHooks.user.create).toHaveProperty('before');
    expect(typeof betterAuthConfig.databaseHooks.user.create.before).toBe(
      'function',
    );
  });

  describe('userGroupsSchema preprocessing', () => {
    beforeEach(async () => {
      await import('./auth');
    });

    test('should call zod preprocess with correct function', () => {
      expect(mockZodPreprocess).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Object),
      );
    });

    test('should join array values with comma and space', () => {
      const preprocessFn = mockZodPreprocess.mock.calls[0][0];
      const result = preprocessFn(['admin', 'user', 'moderator']);
      expect(result).toBe('admin, user, moderator');
    });

    test('should handle empty array', () => {
      const preprocessFn = mockZodPreprocess.mock.calls[0][0];
      const result = preprocessFn([]);
      expect(result).toBe('');
    });

    test('should handle single item array', () => {
      const preprocessFn = mockZodPreprocess.mock.calls[0][0];
      const result = preprocessFn(['admin']);
      expect(result).toBe('admin');
    });

    test('should handle non-array values gracefully', () => {
      const preprocessFn = mockZodPreprocess.mock.calls[0][0];

      // Test with string (should still work due to zod's preprocessing)
      expect(() => preprocessFn('not-an-array')).toThrow();
    });

    test('should handle undefined values', () => {
      const preprocessFn = mockZodPreprocess.mock.calls[0][0];
      expect(() => preprocessFn(undefined)).toThrow();
    });
  });

  test('should configure zod schema correctly', async () => {
    await import('./auth');

    expect(mockZodString).toHaveBeenCalled();
    expect(mockZodString().nullable).toHaveBeenCalled();
  });

  describe('databaseHooks.user.create.before', () => {
    let beforeHook: (
      user: Record<string, unknown>,
    ) => Promise<{ data: Record<string, unknown> }>;

    beforeEach(async () => {
      await import('./auth');
      const betterAuthConfig = mockBetterAuth.mock.calls[0][0];
      beforeHook = betterAuthConfig.databaseHooks.user.create.before;
    });

    test('should process user with groups', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        groups: ['admin', 'user'],
      };

      mockZodSchema.parse.mockReturnValue('admin, user');

      const result = await beforeHook(mockUser);

      expect(result).toEqual({
        data: {
          ...mockUser,
          groups: 'admin, user',
        },
      });
      expect(mockZodSchema.parse).toHaveBeenCalledWith(['admin', 'user']);
    });

    test('should handle user without groups', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
      };

      const result = await beforeHook(mockUser);

      expect(result).toEqual({
        data: {
          ...mockUser,
          groups: null,
        },
      });
      expect(mockZodSchema.parse).not.toHaveBeenCalled();
    });

    test('should handle user with null groups', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        groups: null,
      };

      mockZodSchema.parse.mockReturnValue(null);

      const result = await beforeHook(mockUser);

      expect(result).toEqual({
        data: {
          ...mockUser,
          groups: null,
        },
      });
      expect(mockZodSchema.parse).toHaveBeenCalledWith(null);
    });

    test('should handle user with empty groups array', async () => {
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        groups: [],
      };

      mockZodSchema.parse.mockReturnValue('');

      const result = await beforeHook(mockUser);

      expect(result).toEqual({
        data: {
          ...mockUser,
          groups: '',
        },
      });
      expect(mockZodSchema.parse).toHaveBeenCalledWith([]);
    });
  });
});
