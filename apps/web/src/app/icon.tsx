import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 24,
          fontWeight: 700,
          fontFamily: "Georgia, serif",
          letterSpacing: "-0.05em",
          borderRadius: "6px"
        }}
      >
        R
      </div>
    ),
    { ...size }
  );
}
