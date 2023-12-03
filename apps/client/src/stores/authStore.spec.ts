import { act, renderHook } from '@testing-library/react-hooks';
import { sign } from 'jsonwebtoken';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { generateToken, renewToken } from '../api/auth';

import { authStoreFactory } from './authStore';

// Generate a random string

const getToken = () => {
  const seed = Math.random().toString(36).substring(7);
  const randomPayload = {
    id: seed,
    username: `Test username ${seed}`,
  };

  return new Promise<[string, { id: string; username: string }]>((res, rej) => {
    sign(
      randomPayload,
      'test secret',
      {
        expiresIn: '7d',
      },
      (err: Error, encoded: string) => {
        if (err || encoded === undefined) {
          return rej(err);
        }
        return res([encoded, randomPayload]);
      },
    );
  });
};

// Mock the generateToken and renewToken functions
vi.mock('../api/auth', () => ({
  generateToken: vi.fn(),
  renewToken: vi.fn(),
}));
describe('authStore', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    // Clear all instances and calls to constructor and all methods:
    generateToken.mockClear();
    renewToken.mockClear();

    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();

    vi.clearAllTimers();
    vi.setSystemTime(0);
    await vi.runOnlyPendingTimersAsync();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initialization', () => {
    describe('token is not present in any storage', () => {
      it('session should be empty', () => {
        const useAuthStore = authStoreFactory();
        const { result } = renderHook(() => useAuthStore());
        expect(result.current.user).toBeUndefined();
        expect(sessionStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('token')).toBeNull();
      });
    });

    describe('token is in localStorage', () => {
      it('session should be recovered', async () => {
        const [token, user] = await getToken();
        const [newToken, newUser] = await getToken();
        renewToken.mockResolvedValueOnce(newToken);
        localStorage.setItem('token', token);
        const useAuthStore = authStoreFactory();
        const { result } = renderHook(() => useAuthStore());

        // Check that the token from localStorage is used
        expect(result.current.user.username).toBe(user.username);
        expect(result.current.user.id).toBe(user.id);
        expect(sessionStorage.getItem('token')).toBeNull();

        // Check that the token is refreshed upon initialization
        expect(renewToken).toHaveBeenCalledTimes(1);

        await vi.runOnlyPendingTimersAsync();

        // Check that the token is refreshed after TOKEN_REFRESH_TIMEOUT
        expect(renewToken).toHaveBeenCalledTimes(2);
        expect(localStorage.getItem('token')).toBe(newToken);
        expect(result.current.user.username).toBe(newUser.username);
        expect(result.current.user.id).toBe(newUser.id);
      });
    });

    describe('token is in sessionStorage', () => {
      it('session should be recovered', async () => {
        const [token, user] = await getToken();
        const [newToken, newUser] = await getToken();
        renewToken.mockResolvedValueOnce(newToken);
        sessionStorage.setItem('token', token);
        const useAuthStore = authStoreFactory();
        const { result } = renderHook(() => useAuthStore());

        // Check that the token from sessionStorage is used
        expect(result.current.user.username).toBe(user.username);
        expect(result.current.user.id).toBe(user.id);
        expect(localStorage.getItem('token')).toBeNull();

        // Check that the token is refreshed upon initialization
        expect(renewToken).toHaveBeenCalledTimes(1);

        await vi.runOnlyPendingTimersAsync();

        // Check that the token is refreshed after TOKEN_REFRESH_TIMEOUT
        expect(renewToken).toHaveBeenCalledTimes(2);
        expect(sessionStorage.getItem('token')).toBe(newToken);
        expect(result.current.user.username).toBe(newUser.username);
        expect(result.current.user.id).toBe(newUser.id);
      });
    });
  });

  describe('login', () => {
    it('should save token to localStore when rememberMe is true and initialize session', async () => {
      const [token, user] = await getToken();
      generateToken.mockResolvedValueOnce(token);
      const [newToken, newUser] = await getToken();
      renewToken.mockResolvedValueOnce(newToken);
      const useAuthStore = authStoreFactory();
      const { result, waitForNextUpdate } = renderHook(() => useAuthStore());

      act(() => {
        result.current.login('email@example.com', 'password', true);
      });

      await waitForNextUpdate();

      // Check that the token is saved in localStorage and session is initialized
      expect(localStorage.getItem('token')).toBe(token);
      expect(sessionStorage.getItem('token')).toBeNull();
      expect(result.current.user.username).toBe(user.username);
      expect(result.current.user.id).toBe(user.id);
      expect(renewToken).toHaveBeenCalledTimes(0);

      await vi.runOnlyPendingTimersAsync();

      // Check that the token is refreshed after TOKEN_REFRESH_TIMEOUT
      expect(renewToken).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem('token')).toBe(newToken);
      expect(result.current.user.username).toBe(newUser.username);
      expect(result.current.user.id).toBe(newUser.id);
    });

    it('should save token to sessionStore when rememberMe is false and initialize session', async () => {
      const [token, user] = await getToken();
      generateToken.mockResolvedValueOnce(token);
      const [newToken, newUser] = await getToken();
      renewToken.mockResolvedValueOnce(newToken);
      const useAuthStore = authStoreFactory();
      const { result, waitForNextUpdate } = renderHook(() => useAuthStore());

      act(() => {
        result.current.login('email@example.com', 'password', false);
      });

      await waitForNextUpdate();

      // Check that the token is saved in sessionStorage and session is initialized
      expect(localStorage.getItem('token')).toBeNull();
      expect(sessionStorage.getItem('token')).toBe(token);
      expect(result.current.user.username).toBe(user.username);
      expect(result.current.user.id).toBe(user.id);
      expect(renewToken).toHaveBeenCalledTimes(0);

      await vi.runOnlyPendingTimersAsync();

      // Check that the token is refreshed after TOKEN_REFRESH_TIMEOUT
      expect(renewToken).toHaveBeenCalledTimes(1);
      expect(sessionStorage.getItem('token')).toBe(newToken);
      expect(result.current.user.username).toBe(newUser.username);
      expect(result.current.user.id).toBe(newUser.id);
    });

    describe('logout', () => {
      it('should clear storage and session', async () => {
        const [token, user] = await getToken();
        const [newToken] = await getToken();
        generateToken.mockResolvedValueOnce(token);
        renewToken.mockResolvedValueOnce(newToken);
        const useAuthStore = authStoreFactory();
        const { result, waitForNextUpdate } = renderHook(() => useAuthStore());

        act(() => {
          result.current.login('email@example.com', 'password', false);
        });

        await waitForNextUpdate();

        expect(localStorage.getItem('token')).toBeNull();
        expect(sessionStorage.getItem('token')).toBe(token);
        expect(result.current.user.username).toBe(user.username);
        expect(result.current.user.id).toBe(user.id);

        act(() => {
          result.current.logout();
        });

        expect(localStorage.getItem('token')).toBeNull();
        expect(sessionStorage.getItem('token')).toBeNull();
        expect(result.current.user).toBeUndefined();
      });
    });
  });
});
