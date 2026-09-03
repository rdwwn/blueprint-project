import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About · The Blueprint Project",
  description:
    "Our mission is to make the education sector radically more open for high school students: free, verified, and researched by hand.",
};

export default function MissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}