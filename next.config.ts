import type { NextConfig } from "next";
import dns from "dns";

// The system DNS resolver may not have propagated new hostnames yet.
// Override to use well-known public resolvers for server-side API calls.
dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);

const nextConfig: NextConfig = {};

export default nextConfig;
