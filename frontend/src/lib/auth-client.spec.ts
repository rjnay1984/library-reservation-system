import { vi, describe, test, expect } from 'vitest';
import { genericOAuthClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

vi.mock('better-auth/react', () => ({
  createAuthClient: vi.fn(() => ({
    plugins: [genericOAuthClient()],
  })),
}));
describe('AuthClient', () => {
  test('should create an auth client with generic OAuth plugin', async () => {
    const client = await import('./auth-client');
    expect(createAuthClient).toHaveBeenCalled();
    expect(client.authClient).toBeDefined();
  });
});
