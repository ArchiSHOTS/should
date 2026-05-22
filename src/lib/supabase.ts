import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { fetch as undiciFetch, Agent } from "undici";
import { type LookupOptions } from "dns";
import { Resolver } from "dns/promises";

// Server-only — never import this from client components.

// Node.js native fetch uses the OS libc DNS resolver which may not have
// propagated newly-created hostnames yet. We bypass it using undici with a
// custom lookup that calls Node's dns.Resolver pointed at public DNS.
// undici's lookup callback expects an array of {address, family} records —
// different from the Node net.connect (err, address, family) signature.
const dnsResolver = new Resolver();
dnsResolver.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);

type UndiciFamilyRecord = { address: string; family: number };
type UndiciLookupCallback = (
  err: NodeJS.ErrnoException | null,
  addresses: UndiciFamilyRecord[]
) => void;

const customAgent = new Agent({
  connect: {
    lookup: (hostname: string, _opts: LookupOptions, callback: UndiciLookupCallback) => {
      dnsResolver
        .resolve4(hostname)
        .then((addresses: string[]) =>
          callback(null, addresses.map((address) => ({ address, family: 4 })))
        )
        .catch((err: NodeJS.ErrnoException) => callback(err, []));
    },
  },
});

const customFetch = (url: RequestInfo | URL, init?: RequestInit) =>
  undiciFetch(url as Parameters<typeof undiciFetch>[0], {
    ...(init as Parameters<typeof undiciFetch>[1]),
    dispatcher: customAgent,
  }) as unknown as Promise<Response>;

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing Supabase env vars: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
  }

  _client = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: customFetch },
  });

  return _client;
}
