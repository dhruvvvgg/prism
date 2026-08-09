// Mock/Stub fallback implementation for compiler safety
import { User } from 'firebase/auth';

let cachedAccessToken: string | null = null;

export const db = {
  collection: () => ({
    doc: () => ({
      set: async () => {},
      get: async () => ({ exists: false, data: () => null }),
    })
  })
};

export const auth = {
  currentUser: null as User | null
};

export const initAuth = async (
  onAuthSuccess?: (user: any, token: string) => void,
  onAuthFailure?: () => void
) => {
  if (onAuthFailure) onAuthFailure();
  return () => {};
};

export const googleSignIn = async (): Promise<{ user: any; accessToken: string } | null> => {
  const dummyUser = { email: 'investor.demo@prism.io', displayName: 'Prism Demo Investor' };
  cachedAccessToken = 'simulated_google_token';
  return { user: dummyUser, accessToken: cachedAccessToken };
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const logout = async () => {
  cachedAccessToken = null;
};
