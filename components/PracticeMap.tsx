"use client";

import Link from "next/link";
import {
  practiceTasks,
  isPracticeTaskUnlocked,
  isTaskComplete,
  type Progress,
  type PracticeTask,
  type TaskDifficulty,
} from "@/lib/levels";

const DIFFICULTY_LABELS: Record<TaskDifficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

/** Snake layout: row 0 L→R, row 1 R→L, row 2 L→R, etc. 4 columns. */
const COLS = 4;
const DIFFICULTY_ORDER: TaskDifficulty[] = ["beginner", "intermediate", "advanced"];
const MAP_TASKS = practiceTasks
  .filter((t) => t.id > 3)
  .sort((a, b) => {
    const ai = DIFFICULTY_ORDER.indexOf(a.difficulty);
    const bi = DIFFICULTY_ORDER.indexOf(b.difficulty);
    return ai !== bi ? ai - bi : a.id - b.id;
  });

/** Task-specific icons for the map nodes */
const TASK_ICONS: Record<number, string> = {
  4: "😀",   // Add a new emoji
  5: "🔘",   // Useless button
  6: "⚡",   // Task filter
  7: "🌓",   // Light mode toggle
  8: "⬆️",   // Back to top
  9: "❓",   // Confirmation before reset
  10: "🔎",  // Task search
  11: "🎉",  // Confetti
  12: "🎲",  // Random task picker
  13: "💡",  // Fun fact
  14: "💬",  // Quote of the day
  15: "🏆",  // Achievement badges
  16: "🎨",  // Theme color picker
};

function getNodePosition(index: number): { col: number; row: number } {
  const row = Math.floor(index / COLS);
  const colInRow = index % COLS;
  const col = row % 2 === 0 ? colInRow : COLS - 1 - colInRow;
  return { col, row };
}

function getUnlockMessage(task: PracticeTask, progress: Progress): string {
  if (task.unlocksAfter === "first-pr") return "Complete your first PR to unlock";
  return "Complete 4 beginner tasks to unlock";
}

/** Generate SVG path through node centers in order. */
function PracticePathSVG({
  nodeSize,
  gap,
  offsetX,
  offsetY,
  pathStroke,
}: {
  nodeSize: number;
  gap: number;
  offsetX: number;
  offsetY: number;
  pathStroke: string;
}) {
  const step = nodeSize + gap;
  const r = nodeSize / 2;
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < MAP_TASKS.length; i++) {
    const { col, row } = getNodePosition(i);
    const cx = offsetX + col * step;
    const cy = offsetY + row * step;
    points.push({ x: cx, y: cy });
  }
  if (points.length < 2) return null;
  const d = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");
  return (
    <path
      d={d}
      fill="none"
      stroke={pathStroke}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="8 6"
      opacity={0.5}
    />
  );
}

type MapNodeProps = {
  task: PracticeTask;
  progress: Progress;
  filter: TaskDifficulty | "all";
  nodeSize: number;
  gap: number;
  col: number;
  row: number;
};

function MapNode({ task, progress, filter, nodeSize, gap, col, row }: MapNodeProps) {
  const unlocked = isPracticeTaskUnlocked(task, progress);
  const done = isTaskComplete(task.id, progress);
  const matchesFilter = filter === "all" || task.difficulty === filter;

  const step = nodeSize + gap;
  const r = nodeSize / 2;
  const left = 12 + col * step;
  const top = 12 + row * step;

  const content = (
    <>
      <div
        className={`
          w-full h-full rounded-full flex flex-col items-center justify-center
          border-2 transition-all duration-200
          ${!matchesFilter ? "opacity-40 scale-90" : ""}
          ${done ? "bg-emerald-500/30 border-emerald-500 shadow-lg shadow-emerald-500/20" : ""}
          ${unlocked && !done ? "bg-[var(--color-accent)]/20 border-[var(--color-accent)] hover:scale-110 hover:shadow-lg hover:shadow-[var(--color-accent)]/30" : ""}
          ${!unlocked ? "bg-white/5 border-white/20" : ""}
        `}
      >
        {done ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : !unlocked ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        ) : (
          <span className="text-base leading-none" aria-hidden>{TASK_ICONS[task.id] ?? "•"}</span>
        )}
      </div>
      <div
        className="absolute left-1/2 -translate-x-1/2 top-full pt-2 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <div className="glass-card px-2 py-1.5 text-xs max-w-[180px]">
          <span className="font-medium text-[var(--color-text)]">{task.title}</span>
          <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] ${
            task.difficulty === "beginner" ? "bg-emerald-500/20 text-emerald-400" :
            task.difficulty === "intermediate" ? "bg-amber-500/20 text-amber-400" :
            "bg-purple-500/20 text-purple-400"
          }`}>
            {DIFFICULTY_LABELS[task.difficulty]}
          </span>
          {!unlocked && (
            <p className="text-[var(--color-text-muted)] mt-0.5">{getUnlockMessage(task, progress)}</p>
          )}
        </div>
      </div>
    </>
  );

  const pos = { left: left - r, top: top - r, width: nodeSize, height: nodeSize };
  if (unlocked) {
    return (
      <Link
        href={task.path}
        className="absolute group"
        style={pos}
        aria-label={`${task.title} - ${done ? "Completed" : "Go to task"}`}
      >
        {content}
      </Link>
    );
  }
  return (
    <div
      className="absolute group cursor-default"
      style={pos}
      aria-label={`${task.title} - Locked`}
      title={getUnlockMessage(task, progress)}
    >
      {content}
    </div>
  );
}

type PracticeMapProps = {
  progress: Progress;
  filter: TaskDifficulty | "all";
};

export function PracticeMap({ progress, filter }: PracticeMapProps) {
  const nodeSize = 44;
  const gap = 20;
  const offsetX = 12;
  const offsetY = 12;

  const rows = Math.ceil(MAP_TASKS.length / COLS);
  const cols = Math.min(COLS, MAP_TASKS.length);
  const width = offsetX * 2 + cols * (nodeSize + gap) - gap;
  const height = offsetY * 2 + rows * (nodeSize + gap) - gap;

  return (
    <div className="relative mx-auto" style={{ width, height, maxWidth: "100%" }}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <PracticePathSVG
          nodeSize={nodeSize}
          gap={gap}
          offsetX={offsetX}
          offsetY={offsetY}
          pathStroke="var(--color-accent)"
        />
      </svg>
      {MAP_TASKS.map((task, i) => {
        const { col, row } = getNodePosition(i);
        return (
          <MapNode
            key={task.id}
            task={task}
            progress={progress}
            filter={filter}
            nodeSize={nodeSize}
            gap={gap}
            col={col}
            row={row}
          />
        );
      })}
    </div>
  );
}
