"use client";

import { MainProgressTile } from "@/components/dashboard/MainProgressTile";
import { ContributorsTile } from "@/components/dashboard/ContributorsTile";
import { EmojiOfTheDayTile } from "@/components/dashboard/EmojiOfTheDayTile";
import { ButtonMenuTile } from "@/components/dashboard/ButtonMenuTile";

export default function HomePage() {
  return (
    <main className="flex-1 px-3 py-6 sm:px-4 sm:py-8 w-full min-w-0">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[var(--color-accent)]">
          Learn How to Make Pull Requests
        </h1>
        <p className="text-[var(--color-text-muted)] text-sm sm:text-base mb-6">
          Play around with PRs. Change the emoji, add a button, add your name.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:row-span-1">
            <MainProgressTile />
          </div>
          <div>
            <ContributorsTile />
          </div>
          <div>
            <EmojiOfTheDayTile />
          </div>
          <div>
            <ButtonMenuTile />
          </div>
        </div>
      </div>
    </main>
  );
}
