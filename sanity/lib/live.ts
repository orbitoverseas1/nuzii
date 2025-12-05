// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity";
import { client } from "./client";

const token = process.env.SANITY_API_READ_TOKEN;

// Only require token on server-side
if (!token && typeof window === 'undefined') {
  throw new Error("Missing SANITY_API_READ_TOKEN");
}

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: undefined, // Don't expose token to browser
  fetchOptions: {
    revalidate: 0,
  },
  // client: client.withConfig({
  //   // Live content is currently only available on the experimental API
  //   // https://www.sanity.io/docs/api-versioning
  //   apiVersion: "vX",
  // }),
});
