// All encryption happens entirely in the browser — nothing sensitive touches the server.

function b64Encode(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function b64Decode(str: string): Uint8Array<ArrayBuffer> {
  const arr = Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
  // Ensure the underlying buffer is a plain ArrayBuffer (required by SubtleCrypto)
  return new Uint8Array(arr.buffer.slice(arr.byteOffset, arr.byteOffset + arr.byteLength));
}

/**
 * Derive a 256-bit AES-GCM key from the mnemonic using PBKDF2.
 * The salt must be stored alongside the ciphertext for decryption.
 */
export async function deriveKey(
  mnemonic: string,
  salt: Uint8Array<ArrayBuffer>
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(mnemonic),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/** Encrypt a JSON-serialisable payload. Returns base64-encoded iv, salt, and ciphertext. */
export async function encrypt(
  mnemonic: string,
  payload: object
): Promise<{ iv: string; salt: string; ciphertext: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(16)) as Uint8Array<ArrayBuffer>;
  const iv = crypto.getRandomValues(new Uint8Array(12)) as Uint8Array<ArrayBuffer>;
  const key = await deriveKey(mnemonic, salt);
  const enc = new TextEncoder();

  const cipherbuf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(JSON.stringify(payload))
  );

  return {
    iv: b64Encode(iv.buffer),
    salt: b64Encode(salt.buffer),
    ciphertext: b64Encode(cipherbuf),
  };
}

/** Decrypt a payload previously encrypted with `encrypt()`. */
export async function decrypt<T = unknown>(
  mnemonic: string,
  iv: string,
  salt: string,
  ciphertext: string
): Promise<T> {
  const key = await deriveKey(mnemonic, b64Decode(salt));
  const dec = new TextDecoder();

  const plainbuf = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: b64Decode(iv) },
    key,
    b64Decode(ciphertext)
  );

  return JSON.parse(dec.decode(plainbuf)) as T;
}

/**
 * Derive a pseudonymous user_id from the mnemonic using SHA-256.
 * This hash is sent to the server; the mnemonic itself never leaves the browser.
 */
export async function hashUserId(mnemonic: string): Promise<string> {
  const enc = new TextEncoder();
  const hashBuf = await crypto.subtle.digest("SHA-256", enc.encode(mnemonic));
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
