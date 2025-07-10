import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';

// Store original environment
const originalAuthUrl = process.env.AUTH_URL;

// Mock better-sqlite3
vi.mock('better-sqlite3', () => {
  const mockDatabase = {
    prepare: vi.fn().mockReturnValue({
      run: vi.fn(),
      get: vi.fn(),
      all: vi.fn(),
    }),
    exec: vi.fn(),
    close: vi.fn(),
    pragma: vi.fn(),
  };

  return {
    default: vi.fn(() => mockDatabase),
  };
});

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
  });

  afterEach(() => {
    process.env.AUTH_URL = originalAuthUrl;
    vi.resetModules();
  });

  test('should initialize database with correct path', async () => {
    // Import after mocks are set up
    await import('./auth');

    expect(Database).toHaveBeenCalledWith('./sqlite.db');
  });

  test('should call betterAuth with correct configuration', async () => {
    await import('./auth');

    expect(mockBetterAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        database: expect.any(Object),
        user: {
          additionalFields: {
            groups: {
              type: 'string[]',
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

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const result = await mapProfileToUser(mockProfile);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Mapping profile to user:',
        mockProfile,
      );
      expect(result).toEqual({
        ...mockProfile,
        groups: 'admin,user',
      });

      consoleSpy.mockRestore();
    });

    test('should map profile without groups to empty string', async () => {
      const mockProfile = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
      };

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const result = await mapProfileToUser(mockProfile);

      expect(result).toEqual({
        ...mockProfile,
        groups: '',
      });

      consoleSpy.mockRestore();
    });

    test('should map profile with null groups to empty string', async () => {
      const mockProfile = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        groups: null,
      };

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const result = await mapProfileToUser(mockProfile);

      expect(result).toEqual({
        ...mockProfile,
        groups: '',
      });

      consoleSpy.mockRestore();
    });

    test('should map profile with empty groups array to empty string', async () => {
      const mockProfile = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        groups: [],
      };

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const result = await mapProfileToUser(mockProfile);

      expect(result).toEqual({
        ...mockProfile,
        groups: '',
      });

      consoleSpy.mockRestore();
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
});
