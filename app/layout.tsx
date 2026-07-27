import React from "react";
import { Instrument_Sans, Libre_Baskerville } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NUZII",
  description: "Elevate Your Everyday Style with NUZII",
};

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
  weight: ["400", "700"],
  display: "swap",
});

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body
        className={`${instrumentSans.variable} ${libreBaskerville.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
