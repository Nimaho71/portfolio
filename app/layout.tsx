import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nils Hogberg — Software Engineer",
  description: "Portfolio of Nils Hogberg — Software Engineer specialising in cybersecurity, systems programming, and AI.",
  keywords: ["Nils Hogberg", "software engineer", "cybersecurity", "chess engine", "fluid simulation"],
  openGraph: {
    title: "Nils Hogberg — Software Engineer",
    description: "Systems, security, and AI.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
