import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RWC Delivers — City Pitch Deck",
  description:
    "A city-powered delivery platform for independent restaurants in Redwood City. See how we keep money local, create youth jobs, and deliver 14:1 ROI.",
  openGraph: {
    title: "RWC Delivers — City Pitch Deck",
    description:
      "A city-powered delivery platform for independent restaurants. 15–20 youth jobs, $720K+ kept local annually, 14:1 ROI.",
    type: "website",
    siteName: "RWC Delivers",
  },
  twitter: {
    card: "summary_large_image",
    title: "RWC Delivers — City Pitch Deck",
    description:
      "A city-powered delivery platform for independent restaurants. 15–20 youth jobs, $720K+ kept local annually, 14:1 ROI.",
  },
};

export default function DeckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        header, footer, nav { display: none !important; }
        main { min-height: 100vh !important; margin: 0 !important; padding: 0 !important; }
      `}</style>
      {children}
    </>
  );
}
