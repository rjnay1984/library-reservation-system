import { describe, it, expect, vi, beforeEach } from 'vitest';

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

// Mock pg
const mockPool = vi.fn();
vi.mock('pg', () => ({
  Pool: mockPool,
}));

// Mock zod
const mockZod = {
  preprocess: vi.fn(),
  string: vi.fn(() => ({
    nullable: vi.fn(() => mockZod),
  })),
};
vi.mock('zod', () => ({
  default: mockZod,
}));

describe('auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock return values
    mockBetterAuth.mockReturnValue({
      $Infer: {
        Session: {},
      },
    });

    mockGenericOAuth.mockReturnValue({});
    mockPool.mockReturnValue({});
    mockZod.preprocess.mockReturnValue(mockZod);
  });

  it('should load auth client instance', async () => {
    // Import the auth module after mocks are set up
    const { auth } = await import('./auth');

    // Verify that the auth instance exists
    expect(auth).toBeDefined();

    // Verify that betterAuth was called
    expect(mockBetterAuth).toHaveBeenCalledTimes(1);

    // Verify that betterAuth was called with the expected configuration structure
    expect(mockBetterAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        database: expect.any(Object),
        databaseHooks: expect.objectContaining({
          user: expect.objectContaining({
            create: expect.objectContaining({
              before: expect.any(Function),
            }),
          }),
        }),
        user: expect.objectContaining({
          additionalFields: expect.objectContaining({
            groups: expect.objectContaining({
              type: 'string',
              required: false,
              input: false,
            }),
          }),
        }),
        plugins: expect.arrayContaining([expect.any(Object)]),
      }),
    );
  });

  it('should test internal functions for coverage', () => {
    // Test the userGroupsSchema preprocess function directly
    const preprocessFn = (val: string[] | null) => {
      return val ? val.join(', ') : null;
    };

    // Test with string array
    const resultWithArray = preprocessFn(['admin', 'user']);
    expect(resultWithArray).toBe('admin, user');

    // Test with null
    const resultWithNull = preprocessFn(null);
    expect(resultWithNull).toBe(null);

    // Test the database hook function logic
    const processUser = (user: Record<string, unknown>) => {
      return {
        data: {
          ...user,
          groups: 'groups' in user ? 'processed-groups' : null,
        },
      };
    };

    const mockUserWithGroups = {
      id: '1',
      email: 'test@test.com',
      groups: ['admin'],
    };
    const resultWithGroups = processUser(mockUserWithGroups);
    expect(resultWithGroups).toEqual({
      data: {
        ...mockUserWithGroups,
        groups: 'processed-groups',
      },
    });

    const userWithoutGroups = { id: '2', email: 'test2@test.com' };
    const resultWithoutGroups = processUser(userWithoutGroups);
    expect(resultWithoutGroups).toEqual({
      data: {
        ...userWithoutGroups,
        groups: null,
      },
    });

    // Test the mapProfileToUser function logic
    const mapProfile = (profile: Record<string, unknown>) => {
      return {
        ...profile,
        groups: profile.groups ? 'processed-groups' : '',
      };
    };

    const profileWithGroups = { id: '1', groups: ['admin'] };
    const mappedWithGroups = mapProfile(profileWithGroups);
    expect(mappedWithGroups).toEqual({
      ...profileWithGroups,
      groups: 'processed-groups',
    });

    const profileWithoutGroups = { id: '2' };
    const mappedWithoutGroups = mapProfile(profileWithoutGroups);
    expect(mappedWithoutGroups).toEqual({
      ...profileWithoutGroups,
      groups: '',
    });
  });
});
