import { Fraunces, Archivo, Spline_Sans_Mono } from "next/font/google";

// Display: Fraunces, variable, optical size high, italic available.
// We keep the full weight range so 300 (display) and 400 (category h2s)
// come from one self-hosted variable file, no extra requests, no FOUT.
export const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-fraunces",
});

// Body: Archivo 400/500.
export const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});

// Utility and labels: Spline Sans Mono 400/500.
export const splineMono = Spline_Sans_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-spline-mono",
});
