import type { NextConfig } from "next";

const securityHeaders = [
  // Block the site from being embedded in other pages (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Stop browsers from sniffing content types (e.g. serving HTML as JS).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Only send the origin as a referrer to other sites, never the full URL.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Keep camera/mic/payment off unless the site actually asks for them.
  // Geolocation stays allowed (the map's "Set your location" feature).
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), payment=(), usb=(), geolocation=(self)",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js injects inline bootstrap scripts/styles; Mapbox and the
      // range-input styling rely on inline styles too.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      // Images come from self, data/blob (map tiles) and any https host
      // (Unsplash, Google favicons, Mapbox assets).
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      // Nominatim (geocoding), Mapbox tiles/events, and dev HMR websockets.
      "connect-src 'self' https: ws: wss:",
      "worker-src 'self' blob:",
      "media-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
