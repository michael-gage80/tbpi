import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  // Legacy URLs from the previous (Squarespace) site that Google still has
  // indexed. Without these, they 404 on the new site. Each points to the
  // closest equivalent page so link equity and bookmarks are preserved.
  async redirects() {
    return [
      // Homepage
      { source: "/home", destination: "/", permanent: true },

      // Organisation / about
      { source: "/who-we-are", destination: "/about", permanent: true },
      // NOTE: the old Squarespace /staff (team directory) redirect was removed —
      // /staff is now the staff area landing page. The team section is still
      // reachable via /directory below.
      { source: "/governance", destination: "/about#governance", permanent: true },
      { source: "/directory", destination: "/about#team", permanent: true },

      // Work
      { source: "/our-work", destination: "/research", permanent: true },
      { source: "/our-initiatives", destination: "/programmes", permanent: true },
      { source: "/pioneers-of-change", destination: "/programmes", permanent: true },
      { source: "/future-global-leadership-programme", destination: "/programmes/fglp", permanent: true },

      // Media & press
      { source: "/in-the-media", destination: "/media", permanent: true },
      { source: "/podcasts", destination: "/media", permanent: true },

      // Engage
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/collaborations", destination: "/work-with-us", permanent: true },
      { source: "/recruitment", destination: "/work-with-us", permanent: true },

      // No dedicated donations page yet — route to contact
      { source: "/donate", destination: "/contact", permanent: true },
      { source: "/donation", destination: "/contact", permanent: true },

      // Legacy blog / insights → research
      { source: "/insights", destination: "/research", permanent: true },
      { source: "/insights/:slug+", destination: "/research", permanent: true },
      { source: "/blog-3", destination: "/research", permanent: true },
      { source: "/blog-3/:slug+", destination: "/research", permanent: true },
      { source: "/datahub/:slug+", destination: "/research", permanent: true },

      // Legacy event detail pages → events index
      { source: "/events/:slug+", destination: "/events", permanent: true },

      // Legacy downloadable files (whitepapers/PDFs) → research
      { source: "/s/:file+", destination: "/research", permanent: true },
    ];
  },
};

export default nextConfig;
