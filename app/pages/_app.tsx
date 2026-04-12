import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Syne, DM_Sans, Major_Mono_Display } from "next/font/google";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

/** Logo wordmark — Google Fonts “Major Mono Display”. */
const majorMonoDisplay = Major_Mono_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-major-mono",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`${syne.variable} ${dmSans.variable} ${majorMonoDisplay.variable} min-h-screen font-body antialiased`}
    >
      <Component {...pageProps} />
    </div>
  );
}
