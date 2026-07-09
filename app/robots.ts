import type { MetadataRoute } from "next";

const BASE_URL = "https://www.theblackpolicyinstitute.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Non-public routes that should not be indexed.
      disallow: ["/api/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
