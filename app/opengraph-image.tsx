import { ImageResponse } from "next/og";

// Default Open Graph / social-share card, rendered for every page that does not
// define its own. 1200×630 is the standard large-summary size.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "The Black Policy Institute";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0A0A",
          padding: "80px",
        }}
      >
        {/* Brand accent bar */}
        <div style={{ display: "flex", width: "160px", height: "10px", background: "#E8581A" }} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            The Black Policy Institute
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 34, color: "#E8581A", fontWeight: 600 }}>
            Evidence-Based Policy · Community-Powered Change
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "rgba(255,255,255,0.6)" }}>
          theblackpolicyinstitute.org
        </div>
      </div>
    ),
    { ...size }
  );
}
