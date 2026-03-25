import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "PR Simulator — PR Quest" },
  description: "Practice the PR flow in the browser with a live repo diagram.",
};

export default function LearnGameLayout({ children }: { children: React.ReactNode }) {
  return children;
}
