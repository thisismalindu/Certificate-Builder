import type { Metadata } from "next";
import { Forum, Great_Vibes, Inter, Libre_Baskerville } from "next/font/google";
import "./globals.css";

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  weight: "400",
  subsets: ["latin"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const invitationBody = Inter({
  variable: "--font-invitation-body",
  subsets: ["latin"],
});

const invitationDisplay = Forum({
  variable: "--font-invitation-display",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RCC Certificate and Invitation Builder",
  description: "Create and download Roman Catholic College certificates and invitations.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
    className={`${greatVibes.variable} ${libreBaskerville.variable} ${invitationBody.variable} ${invitationDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
