// Served at /sitemap.xml. Implemented as a route handler (rather than the
// app/sitemap.ts metadata convention) because that convention reserves the
// /sitemap path, which is already used by the human-facing sitemap page.

const BASE_URL = "https://www.theblackpolicyinstitute.org";

// Public, indexable routes. Keep in sync with the app/ route tree.
// Anchor links (e.g. /about#team) are omitted — they are fragments of a
// page already listed here.
const routes: {
  path: string;
  priority: number;
  changeFrequency: string;
}[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/research", priority: 0.8, changeFrequency: "weekly" },
  { path: "/policy-areas", priority: 0.8, changeFrequency: "monthly" },
  { path: "/programmes", priority: 0.8, changeFrequency: "monthly" },
  { path: "/programmes/ypag", priority: 0.7, changeFrequency: "monthly" },
  { path: "/programmes/fglp", priority: 0.7, changeFrequency: "monthly" },
  { path: "/events", priority: 0.8, changeFrequency: "weekly" },
  { path: "/media", priority: 0.8, changeFrequency: "weekly" },
  { path: "/work-with-us", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/sitemap", priority: 0.3, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export function GET() {
  const lastmod = new Date().toISOString();

  const urls = routes
    .map(
      ({ path, priority, changeFrequency }) => `  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`
    )
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
