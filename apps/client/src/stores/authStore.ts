import { UserRole } from '@resourvereign/common/models/user.js';
import { setToken } from '@slangy/client/rest/init.js';
import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';

import { generateToken, renewToken } from '../api/auth';

const TOKEN_KEY = 'token';
const TOKEN_REFRESH_TIMEOUT = 60 * 60 * 1000; // 1 hour

type LoggedUser = {
  id: string;
  username: string;
  role: UserRole;
};

type TokenPayload = LoggedUser & {
  iat: number;
  exp: number;
};

type AuthState = {
  token?: string;
  user?: LoggedUser;
  isAdmin?: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
};

const userFromToken = (token: string): LoggedUser | undefined => {
  const { id, username, role, exp } = jwtDecode<TokenPayload>(token);

  if (exp * 1000 < Date.now()) {
    return undefined;
  }

  // TODO: perform toke validation

  return {
    id,
    username,
    role,
  };
};

export const authStoreFactory = () =>
  create<AuthState>((set) => {
    const tokenFromLocalStorage = localStorage.getItem(TOKEN_KEY);
    const tokenFromSessionStorage = sessionStorage.getItem(TOKEN_KEY);
    const token = tokenFromLocalStorage || tokenFromSessionStorage;
    let rememberMe = Boolean(tokenFromLocalStorage);
    let refreshTokenInterval: ReturnType<typeof setInterval> | undefined;

    const saveToken = (token: string) => {
      const user = userFromToken(token);

      if (user) {
        setToken(token);
        set({ token, user: userFromToken(token) });
        if (rememberMe) {
          localStorage.setItem(TOKEN_KEY, token);
        } else {
          sessionStorage.setItem(TOKEN_KEY, token);
        }
        startRefreshTokenInterval();
        return true;
      }

      stopRefreshTokenInterval();
      setToken(undefined);
      set({ token: undefined, user: undefined });
      return false;
    };

    const refreshToken = async () => {
      try {
        const newToken = await renewToken();
        saveToken(newToken);
      } catch (e) {
        console.error(e);
      }
    };

    const stopRefreshTokenInterval = () => {
      if (refreshTokenInterval) {
        clearInterval(refreshTokenInterval);
        refreshTokenInterval = undefined;
      }
    };

    const startRefreshTokenInterval = () => {
      stopRefreshTokenInterval();
      refreshTokenInterval = setInterval(refreshToken, TOKEN_REFRESH_TIMEOUT);
    };

    if (token) {
      setToken(token);
      refreshToken();
    }

    const user = token ? userFromToken(token) : undefined;

    return {
      user,
      isAdmin: user?.role === UserRole.admin,
      login: async (email: string, password: string, newRememberMe: boolean) => {
        try {
          const token = await generateToken(email, password);
          if (token) {
            rememberMe = newRememberMe;
            return saveToken(token);
          }
        } catch (e) {
          console.log(e);
        }
        return false;
      },
      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
        setToken(undefined);
        stopRefreshTokenInterval();
        rememberMe = false;

        set({ token: undefined, user: undefined });
      },
    };
  });
