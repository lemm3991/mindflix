// src/lib/server/auth.ts - Server-Only Authentication, Session Token & Bcrypt Password Management
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

export interface ServerUser {
  id: string;
  username: string;
  email: string;
  name: string;
  defaultPasswordBcrypt: string;
}

// Secret for HMAC session token signing
const SESSION_SECRET = process.env.AUTH_SECRET || 'mindflix-secure-production-secret-salt-2026-v1';
const COOKIE_NAME = 'mindflix_session';
const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days
const BCRYPT_SALT_ROUNDS = 12;

// Standard non-reversible Bcrypt Password Hashes with Salt Work Factor 12
const INITIAL_USERS: ServerUser[] = [
  {
    id: 'user-lemmg0800',
    username: 'lemmg0800',
    email: 'lemmg0800@mindflix.local',
    name: 'Lemmg0800',
    // Hash for '19931503' generated with bcrypt (12 rounds)
    defaultPasswordBcrypt: '$2b$12$SKlRFwDPob5NpZY8wCj5oeVmsaFBuEwWjy3y1i7dpOcV7X9yKJX0u'
  },
  {
    id: 'user-tamydoagro',
    username: 'tamydoagro',
    email: 'tamydoagro@mindflix.local',
    name: 'Tamydoagro',
    // Hash for 'mndflx2026' generated with bcrypt (12 rounds)
    defaultPasswordBcrypt: '$2b$12$TIh97M2oQQKcO85uzOEYkuHTfytbHtKWyScQ7nk5qCry0L/XPWf3u'
  }
];

const PRIMARY_CUSTOM_PASS_PATH = path.resolve(process.cwd(), 'src', 'data', 'custom_passwords.json');
const TMP_CUSTOM_PASS_PATH = path.join(os.tmpdir(), 'mindflix_custom_passwords.json');

function getCustomPasswordHashes(): Record<string, string> {
  let custom: Record<string, string> = {};
  if (fs.existsSync(PRIMARY_CUSTOM_PASS_PATH)) {
    try {
      custom = JSON.parse(fs.readFileSync(PRIMARY_CUSTOM_PASS_PATH, 'utf8'));
    } catch {}
  }
  if (fs.existsSync(TMP_CUSTOM_PASS_PATH)) {
    try {
      const tmp = JSON.parse(fs.readFileSync(TMP_CUSTOM_PASS_PATH, 'utf8'));
      custom = { ...custom, ...tmp };
    } catch {}
  }
  return custom;
}

function saveCustomPasswordHash(username: string, bcryptHash: string): boolean {
  const current = getCustomPasswordHashes();
  current[username.toLowerCase()] = bcryptHash;
  const jsonStr = JSON.stringify(current, null, 2);

  try {
    const dir = path.dirname(PRIMARY_CUSTOM_PASS_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(PRIMARY_CUSTOM_PASS_PATH, jsonStr, 'utf8');
    return true;
  } catch (err: any) {
    try {
      fs.writeFileSync(TMP_CUSTOM_PASS_PATH, jsonStr, 'utf8');
      return true;
    } catch {
      return false;
    }
  }
}

export function findUserByUsername(username: string): ServerUser | null {
  if (!username) return null;
  const norm = username.trim().toLowerCase();
  const user = INITIAL_USERS.find(u => u.username.toLowerCase() === norm || u.email.toLowerCase() === norm);
  return user || null;
}

export function findUserById(id: string): ServerUser | null {
  if (!id) return null;
  const user = INITIAL_USERS.find(u => u.id === id);
  return user || null;
}

/**
 * Verifies credentials using standard Bcrypt constant-time comparison
 */
export async function verifyCredentials(
  inputLogin: string,
  inputPass: string
): Promise<{ success: boolean; user?: ServerUser }> {
  if (!inputLogin || !inputPass) return { success: false };

  const user = findUserByUsername(inputLogin);
  if (!user) return { success: false };

  const customHashes = getCustomPasswordHashes();
  const targetHash = customHashes[user.username.toLowerCase()] || user.defaultPasswordBcrypt;

  try {
    const isMatch = await bcrypt.compare(inputPass.trim(), targetHash);
    if (isMatch) {
      return { success: true, user };
    }
  } catch (err) {
    console.error('Bcrypt comparison error:', err);
  }

  return { success: false };
}

/**
 * Updates password using standard Bcrypt hashing with 12 salt rounds
 */
export async function updateServerUserPassword(
  username: string,
  newPass: string
): Promise<boolean> {
  if (!username || !newPass || newPass.trim().length < 6) return false;
  const user = findUserByUsername(username);
  if (!user) return false;

  try {
    const bcryptHash = await bcrypt.hash(newPass.trim(), BCRYPT_SALT_ROUNDS);
    return saveCustomPasswordHash(user.username, bcryptHash);
  } catch (err) {
    console.error('Bcrypt hashing error:', err);
    return false;
  }
}

// Session Token Creation & Verification
export interface SessionPayload {
  uid: string;
  username: string;
  name: string;
  iat: number;
  exp: number;
}

export function createSessionToken(user: ServerUser): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + SESSION_MAX_AGE_SECONDS;

  const payload: SessionPayload = {
    uid: user.id,
    username: user.username,
    name: user.name,
    iat,
    exp
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

export function verifySessionToken(token?: string | null): SessionPayload | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadB64)
    .digest('base64url');

  try {
    const sigBuf = Buffer.from(signature, 'utf8');
    const expSigBuf = Buffer.from(expectedSig, 'utf8');
    if (sigBuf.length !== expSigBuf.length || !crypto.timingSafeEqual(sigBuf, expSigBuf)) {
      return null;
    }
  } catch {
    return null;
  }

  try {
    const payload: SessionPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }

    if (!findUserById(payload.uid)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export { COOKIE_NAME, SESSION_MAX_AGE_SECONDS };
