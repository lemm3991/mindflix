// src/lib/server/crypto.ts - Server-Only AES-256-GCM Data Encryption at Rest
import crypto from 'node:crypto';

// Server-side encryption key derived securely from environment secret
const MASTER_SECRET = process.env.ENCRYPTION_SECRET || process.env.AUTH_SECRET || 'mindflix-master-data-encryption-key-2026';
const KEY_BYTES = crypto.createHash('sha256').update(MASTER_SECRET).digest();

/**
 * Encrypts sensitive plaintext (e.g. API keys, credentials) using AES-256-GCM
 * Output format: iv_hex:auth_tag_hex:ciphertext_hex
 */
export function encryptSensitiveData(plaintext: string): string {
  if (!plaintext || typeof plaintext !== 'string') return '';

  const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY_BYTES, iv);

  let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
  ciphertext += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${ciphertext}`;
}

/**
 * Decrypts AES-256-GCM encrypted string
 * Returns null if authentication tag fails or data is tampered
 */
export function decryptSensitiveData(encryptedPayload: string): string | null {
  if (!encryptedPayload || typeof encryptedPayload !== 'string') return null;

  // If input is not encrypted format (e.g., legacy raw key), return safely
  const parts = encryptedPayload.split(':');
  if (parts.length !== 3) {
    return encryptedPayload.startsWith('enc_') ? null : encryptedPayload;
  }

  try {
    const [ivHex, authTagHex, ciphertextHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', KEY_BYTES, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertextHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (err) {
    console.error('Decryption failed or data tampered:', err);
    return null;
  }
}

/**
 * Masks sensitive keys for UI display (e.g., AIzaSy•••••••••••3x)
 */
export function maskSensitiveKey(key?: string): string {
  if (!key || typeof key !== 'string') return '';
  const trimmed = key.trim();
  if (trimmed.length <= 8) return '••••••••';
  const start = trimmed.slice(0, 6);
  const end = trimmed.slice(-3);
  return `${start}${'•'.repeat(Math.min(24, Math.max(8, trimmed.length - 9)))}${end}`;
}
