import { ImageResponse } from "next/og";
import { OPPORTUNITIES } from "@/data/opportunities";

const DISPLAY_COUNT = `${Math.floor(OPPORTUNITIES.length / 100) * 100}+`;

export const alt = "The Blueprint Project, free opportunities for high school students";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "sans-serif",
          gap: "16px",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            display: "flex",
          }}
        >
          The Blueprint Project
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#94a3b8",
            maxWidth: "800px",
            textAlign: "center",
            display: "flex",
          }}
        >
          {DISPLAY_COUNT} free internships, scholarships & competitions for high school
          students, verified by hand.
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
