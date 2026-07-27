import "server-only";

/**
 * Absolute origin of this deployment, used to build the URLs iPay sends the
 * customer back to.
 *
 * Netlify sets `URL` (the canonical site address) and `DEPLOY_PRIME_URL` (the
 * address of this specific deploy/branch) automatically, so deploy previews
 * work without extra configuration. An explicit `NEXT_PUBLIC_BASE_URL` wins
 * when set, which is what production should use.
 */
export const getSiteUrl = (): string => {
  const candidate =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    "http://localhost:3000";

  const baseUrl = candidate.replace(/\/+$/, "");

  // A stale or misconfigured base URL against the live gateway would send
  // customers to a dead page *after* their card was charged, so fail loudly
  // rather than take the payment.
  if (process.env.IPAY_ENV === "live") {
    let parsed: URL;
    try {
      parsed = new URL(baseUrl);
    } catch {
      throw new Error(`Invalid site URL for live payments: "${baseUrl}"`);
    }
    if (parsed.protocol !== "https:") {
      throw new Error(
        `Live payments require an https site URL, got "${baseUrl}". Set NEXT_PUBLIC_BASE_URL.`
      );
    }
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
      throw new Error(
        `Live payments cannot use a localhost site URL ("${baseUrl}"). Set NEXT_PUBLIC_BASE_URL.`
      );
    }
  }

  return baseUrl;
};
