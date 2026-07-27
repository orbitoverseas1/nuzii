import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const backendClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // Never the CDN. This client authorises writes and is the source of truth for
  // order pricing and payment status — CDN responses can be up to a minute
  // stale, which would price an order against an expired discount or serve a
  // pre-callback snapshot of an order the customer has already paid for.
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});
