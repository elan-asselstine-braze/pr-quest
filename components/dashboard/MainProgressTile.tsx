"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  practiceTasks,
  STORAGE_KEY,
  defaultProgress,
  getTotalXP,
  getCurrentLevelFromXP,
  MAX_XP,
  LEARN_MARKED_COMPLETE_KEY,
  LEARN_MODULE_XP,
  SETUP_COMPLETE_KEY,
  SETUP_XP,
  getNextLearnModule,
  getNextPracticeTask,
  getPracticeTasksComplete,
  type Progress,
} from "@/lib/levels";
import { Badge } from "@/components/Badge";

function getProgress(): Progress {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(raw) };
  } catch {
    return defaultProgress;
  }
}

function getMarkedComplete(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LEARN_MARKED_COMPLETE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getSetupComplete(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(SETUP_COMPLETE_KEY) === "true";
  } catch {
    return false;
  }
}


export function MainProgressTile() {
  const [progress, setProgress] = useState<Progress>(defaultProgress);
  const [markedComplete, setMarkedComplete] = useState<number[]>([]);
  const [setupComplete, setSetupComplete] = useState(false);

  useEffect(() => {
    setProgress(getProgress());
    setMarkedComplete(getMarkedComplete());
    setSetupComplete(getSetupComplete());
  }, []);

  const learnXP = markedComplete.length * LEARN_MODULE_XP;
  const totalXP = getTotalXP(progress) + (setupComplete ? SETUP_XP : 0) + learnXP;
  const currentLevel = getCurrentLevelFromXP(totalXP);
  const tasksComplete = getPracticeTasksComplete(progress);
  const nextTask = getNextPracticeTask(progress);
  const nextLearnModule = getNextLearnModule(progress, markedComplete);
  const allLearnDone = nextLearnModule === null;

  const cta =
    nextLearnModule ? (
      <Link
        href={`/learn?module=${nextLearnModule.id}`}
        className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
      >
        {tasksComplete === 0 && markedComplete.length === 0 ? "Get started" : "Continue"}: {nextLearnModule.title}
      </Link>
    ) : !setupComplete ? (
      <Link
        href="/setup"
        className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Go to Setup →
      </Link>
    ) : nextTask ? (
      <Link
        href={nextTask.path}
        className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Try a practice: {nextTask.title} →
      </Link>
    ) : tasksComplete === practiceTasks.length ? (
      <p className="text-sm text-[var(--color-text-muted)]">You’ve completed all practice tasks. Nice work!</p>
    ) : (
      <Link
        href="/practice"
        className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Browse practice tasks →
      </Link>
    );

  return (
    <div className="glass-card p-4 sm:p-5 flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-3">Your learning journey</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">
        Earn XP by completing modules. Level up at each milestone.
      </p>
      <div className="flex-1 space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-[var(--color-text-muted)]">Level {currentLevel}</span>
            <span className="font-medium">{totalXP} / {MAX_XP} XP</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-300"
              style={{ width: `${Math.min(100, (totalXP / MAX_XP) * 100)}%` }}
            />
          </div>
        </div>
        {tasksComplete > 0 && (
          <div className="flex flex-wrap gap-2">
            {practiceTasks.slice(0, 5).map((q) => (
              <Badge
                key={q.id}
                id={q.id}
                label={q.title}
                unlocked={q.id === 1 ? progress.level1?.complete ?? false : progress.taskProgress?.[q.id] ?? false}
              />
            ))}
          </div>
        )}
        {cta}
      </div>
    </div>
  );
}
