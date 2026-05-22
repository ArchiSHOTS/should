-- Run this in the Supabase SQL editor to set up the journal table.
-- No Supabase Auth required — access is controlled via the service role key
-- in the Next.js API routes. All content is E2EE; the server never sees plaintext.

CREATE TABLE IF NOT EXISTS journal_entries (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    TEXT        NOT NULL,   -- SHA-256(mnemonic), 64-char hex, no PII
  iv         TEXT        NOT NULL,   -- base64 AES-GCM initialization vector
  salt       TEXT        NOT NULL,   -- base64 PBKDF2 salt
  ciphertext TEXT        NOT NULL,   -- base64 AES-GCM encrypted JSON payload
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS journal_entries_user_id_idx ON journal_entries(user_id);

-- Disable RLS entirely; access is gate-kept by the service role key used
-- exclusively in server-side API routes. The API validates user_id format
-- before all queries. No client SDK ever touches this table directly.
ALTER TABLE journal_entries DISABLE ROW LEVEL SECURITY;
