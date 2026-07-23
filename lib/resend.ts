import "server-only";
import { Resend } from "resend";

// Server-only Resend client. Instantiated lazily so a missing API key
// (e.g. local/dev without credentials) never crashes module import or checkout.
let client: Resend | null = null;

export const getResendClient = (): Resend | null => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[resend] RESEND_API_KEY is not set — order emails will be skipped."
    );
    return null;
  }
  if (!client) {
    client = new Resend(apiKey);
  }
  return client;
};
