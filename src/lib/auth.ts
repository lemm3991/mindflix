// auth.ts - Pre-configured Authorized Accounts with Custom Password Persistence
export interface ValidUser {
  id: string;
  username: string;
  email: string;
  name: string;
}

export const AUTHORIZED_USERS = [
  {
    id: 'user-lemmg0800',
    username: 'lemmg0800',
    email: 'lemmg0800@mindflix.local',
    defaultPassword: '19931503',
    name: 'Lemmg0800'
  },
  {
    id: 'user-tamydoagro',
    username: 'tamydoagro',
    email: 'tamydoagro@mindflix.local',
    defaultPassword: 'mndflx2026',
    name: 'Tamydoagro'
  }
];

const CUSTOM_PASS_KEY = 'mindflix_custom_passwords';

function getCustomPasswords(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(CUSTOM_PASS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getUserPassword(username: string): string {
  const custom = getCustomPasswords();
  const key = username.toLowerCase();
  if (custom[key]) return custom[key];

  const found = AUTHORIZED_USERS.find(u => u.username.toLowerCase() === key || u.email.toLowerCase() === key);
  return found ? found.defaultPassword : '';
}

export function updateUserPassword(username: string, newPassword: string): boolean {
  if (typeof window === 'undefined' || !username || !newPassword) return false;
  const custom = getCustomPasswords();
  const key = username.toLowerCase();
  custom[key] = newPassword.trim();
  try {
    localStorage.setItem(CUSTOM_PASS_KEY, JSON.stringify(custom));
    return true;
  } catch {
    return false;
  }
}

export function authenticateUser(inputLogin: string, inputPass: string): ValidUser | null {
  if (!inputLogin || !inputPass) return null;
  const normLogin = inputLogin.trim().toLowerCase();

  const found = AUTHORIZED_USERS.find(
    u => u.username.toLowerCase() === normLogin || u.email.toLowerCase() === normLogin
  );

  if (found) {
    const currentPass = getUserPassword(found.username);
    if (currentPass === inputPass.trim()) {
      return {
        id: found.id,
        username: found.username,
        email: found.email,
        name: found.name
      };
    }
  }
  return null;
}
