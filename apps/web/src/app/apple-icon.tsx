import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#111111",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#f3bd21",
          fontSize: 130,
          fontWeight: 700,
          fontFamily: "Georgia, serif",
          letterSpacing: "-0.05em"
        }}
      >
        R
      </div>
    ),
    { ...size }
  );
}
