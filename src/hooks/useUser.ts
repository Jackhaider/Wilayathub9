'use client';

export interface UserHookResult {
  user: any;
  isUserLoading: boolean;
  userError: Error | null;
}

/**
 * ✅ Always provides a test user (no real login required)
 */
export const useUser = (): UserHookResult => {
  // 🧪 Default test user
  const testUser = {
    uid: 'test123',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: null,
  };

  // Return fake login data — skip Firebase entirely
  return {
    user: testUser,
    isUserLoading: false,
    userError: null,
  };
};
