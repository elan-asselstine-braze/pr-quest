"use client";

import type { ReactNode } from "react";

/**
 * Full-width repo sketch with annotations that appear as each phase unlocks.
 */

type RepoStateVisualProps = {
  stageIndex: number;
  branchName: string;
  contributorPreview: string;
  isDone: boolean;
};

const VB_W = 480;
const VB_H = 198;
const MAIN_Y = 120;
const BRANCH_Y = 24;
const FORK_X = 118;
/** Where the branch meets main after merge (on the project line). */
const MERGE_ON_MAIN_X = 258;
/** Main HEAD after the change is merged. */
const MAIN_HEAD_AFTER_MERGE_X = 336;
const BRANCH_TIP_X = 296;
/** Remote label box in viewBox coords — centered under the branch line. */
const REMOTE_BOX_W = 148;
const REMOTE_BOX_X = BRANCH_TIP_X - REMOTE_BOX_W / 2;
const REMOTE_BOX_Y = 152;
const REMOTE_BOX_H = 32;

function PopG({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <g
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
        pointerEvents: "none" as const,
      }}
    >
      {children}
    </g>
  );
}

function Pill({
  x,
  y,
  w,
  h,
  stroke,
  fill,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  stroke: string;
  fill: string;
}) {
  return <rect x={x} y={y} width={w} height={h} rx={5} fill={fill} stroke={stroke} strokeWidth={1} />;
}

export function RepoStateVisual({ stageIndex, branchName, contributorPreview, isDone }: RepoStateVisualProps) {
  const branchLabel = branchName || "your-branch";
  const nameSnippet =
    contributorPreview.trim().length >= 2 && !/^your\s*name$/i.test(contributorPreview.trim())
      ? contributorPreview.trim()
      : "Your Name";
  const shortName = nameSnippet.length > 18 ? `${nameSnippet.slice(0, 16)}…` : nameSnippet;

  /** Final merge step onward: show the change landed on main (not only after overlay). */
  const mergedOnMain = stageIndex >= 9 || isDone;
  const hasFeatureBranch = stageIndex >= 2;
  const showWorkingChange = stageIndex >= 3 && !mergedOnMain;
  const showStaging = stageIndex >= 4 && !mergedOnMain;
  const showCommit = stageIndex >= 5 && !mergedOnMain;
  const showRemote = stageIndex >= 6 && !mergedOnMain;
  const showPR = stageIndex >= 7 && !mergedOnMain;
  const showReview = stageIndex >= 7 && !mergedOnMain;
  const showApproved = stageIndex >= 8 && !mergedOnMain;

  const mainLineEndX = mergedOnMain ? MAIN_HEAD_AFTER_MERGE_X : hasFeatureBranch ? FORK_X : 248;
  const mainHeadX = mergedOnMain ? MAIN_HEAD_AFTER_MERGE_X : hasFeatureBranch ? FORK_X : 248;

  return (
    <div
      className="rounded-xl border-2 border-[var(--color-accent)]/45 bg-gradient-to-b from-zinc-900/95 to-[#07070c] px-3 py-3 sm:px-4 sm:py-4 overflow-hidden shadow-[0_12px_48px_-16px_rgba(167,139,250,0.35)]"
      aria-label="Repository state"
    >
      <h2 className="text-sm font-semibold text-[var(--color-text)] mb-2">Your project</h2>

      <div className="relative w-full overflow-visible rounded-xl border border-white/10 bg-black/50">
        <svg
          className="block w-full overflow-hidden rounded-xl"
          style={{ height: "min(240px, 42vw)", minHeight: 200 }}
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          {/* Main line (project line): extends past the merge point once the change is on main */}
          {!mergedOnMain ? (
            <>
              <line
                x1="18"
                y1={MAIN_Y}
                x2={mainLineEndX}
                y2={MAIN_Y}
                stroke="rgb(52 211 153)"
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity={0.85}
              />
              <circle cx={mainHeadX} cy={MAIN_Y} r="7" fill="rgb(52 211 153)" />
            </>
          ) : (
            <>
              <line
                x1="18"
                y1={MAIN_Y}
                x2={MAIN_HEAD_AFTER_MERGE_X}
                y2={MAIN_Y}
                stroke="rgb(52 211 153)"
                strokeWidth="3.5"
                strokeLinecap="round"
                opacity={0.92}
              />
              {/* Merge commit on main — where the branch work joins the project line */}
              <circle cx={MERGE_ON_MAIN_X} cy={MAIN_Y} r="6" fill="rgb(52 211 153)" stroke="rgb(167 139 250)" strokeWidth="2" />
              <circle cx={MAIN_HEAD_AFTER_MERGE_X} cy={MAIN_Y} r="7" fill="rgb(52 211 153)" />
            </>
          )}

          {/* Feature branch */}
          {hasFeatureBranch && !mergedOnMain && (
            <>
              <path
                d={`M ${FORK_X} ${MAIN_Y} Q ${FORK_X + 26} ${MAIN_Y - 14} ${FORK_X + 44} ${BRANCH_Y} H ${BRANCH_TIP_X}`}
                fill="none"
                stroke="rgb(167 139 250)"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <circle cx={BRANCH_TIP_X} cy={BRANCH_Y} r="6" fill="rgb(167 139 250)" />
            </>
          )}

          {mergedOnMain && (
            <>
              {/* Branch history (faded) leading to merge */}
              <path
                d={`M ${FORK_X} ${MAIN_Y} Q ${FORK_X + 26} ${MAIN_Y - 14} ${FORK_X + 44} ${BRANCH_Y} H ${BRANCH_TIP_X}`}
                fill="none"
                stroke="rgb(167 139 250)"
                strokeWidth="2.6"
                strokeLinecap="round"
                opacity={0.38}
              />
              <circle cx={BRANCH_TIP_X} cy={BRANCH_Y} r="5" fill="rgb(167 139 250)" opacity={0.45} />
              {/* Merge: branch tip into main */}
              <path
                d={`M ${BRANCH_TIP_X} ${BRANCH_Y} Q ${BRANCH_TIP_X - 8} ${MAIN_Y - 36} ${MERGE_ON_MAIN_X} ${MAIN_Y}`}
                fill="none"
                stroke="rgb(167 139 250)"
                strokeWidth="2.6"
                strokeLinecap="round"
                opacity={0.85}
              />
            </>
          )}

          {showRemote && (
            <line
              x1={BRANCH_TIP_X}
              y1={BRANCH_Y + 16}
              x2={BRANCH_TIP_X}
              y2={REMOTE_BOX_Y}
              stroke="rgb(113 113 122)"
              strokeWidth="1.5"
            />
          )}

          {showPR && (
            <rect
              x="178"
              y="82"
              width="76"
              height="24"
              rx="5"
              fill="rgba(167,139,250,0.14)"
              stroke="rgba(167,139,250,0.55)"
              strokeWidth={1.2}
            />
          )}

          {/* —— Annotations (pop in with phase) —— */}

          <PopG show={stageIndex >= 0}>
            <Pill x={14} y={136} w={46} h={18} fill="rgba(24,24,27,0.92)" stroke="rgba(52,211,153,0.35)" />
            <text x={22} y={149} fill="rgb(161 161 170)" fontSize="10" fontFamily="ui-monospace, system-ui, monospace">
              main
            </text>
          </PopG>

          <PopG show={showWorkingChange}>
            <Pill x={10} y={44} w={152} h={58} fill="rgba(12,12,14,0.94)" stroke="rgba(52,211,153,0.28)" />
            <text x={18} y={60} fill="rgb(113 113 122)" fontSize="9" fontFamily="ui-monospace, system-ui, monospace">
              contributors.ts
            </text>
            <text x={18} y={78} fill="rgb(52 211 153)" fontSize="9" fontFamily="ui-monospace, system-ui, monospace">
              {`+ "${shortName}"`}
            </text>
          </PopG>

          <PopG show={showStaging}>
            <Pill x={18} y={92} w={64} h={16} fill="rgba(120,53,15,0.35)" stroke="rgba(245,158,11,0.45)" />
            <text x={26} y={104} fill="rgb(251 191 36)" fontSize="9" fontFamily="system-ui, sans-serif">
              Staged
            </text>
          </PopG>

          <PopG show={showCommit}>
            <Pill x={252} y={36} w={56} h={16} fill="rgba(24,24,27,0.92)" stroke="rgba(167,139,250,0.35)" />
            <text x={260} y={48} fill="rgb(196 181 253)" fontSize="9" fontFamily="system-ui, sans-serif">
              Commit
            </text>
          </PopG>

          <PopG show={showPR}>
            <text
              x={216}
              y={98}
              textAnchor="middle"
              fill="rgb(196 181 253)"
              fontSize="9"
              fontWeight="600"
              fontFamily="system-ui, sans-serif"
            >
              Open PR
            </text>
          </PopG>

          <PopG show={showReview}>
            <Pill x={268} y={80} w={72} h={18} fill="rgba(24,24,27,0.92)" stroke="rgba(161,161,170,0.35)" />
            <text x={276} y={93} fill="rgb(161 161 170)" fontSize="9" fontFamily="system-ui, sans-serif">
              Review
            </text>
          </PopG>

          <PopG show={showApproved}>
            <Pill x={350} y={80} w={78} h={18} fill="rgba(6,78,59,0.45)" stroke="rgba(52,211,153,0.45)" />
            <text x={360} y={93} fill="rgb(52 211 153)" fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">
              Approved
            </text>
          </PopG>

          <PopG show={mergedOnMain}>
            <Pill x={198} y={MAIN_Y - 36} w={168} h={22} fill="rgba(6,78,59,0.55)" stroke="rgba(52,211,153,0.5)" />
            <text
              x={282}
              y={MAIN_Y - 21}
              textAnchor="middle"
              fill="rgb(167 243 208)"
              fontSize="10"
              fontWeight="600"
              fontFamily="system-ui, sans-serif"
            >
              On main — your change shipped
            </text>
          </PopG>
        </svg>
        {/* HTML overlay: SVG foreignObject + flex often mis-sizes and clips with ellipsis */}
        {hasFeatureBranch && !mergedOnMain && (
          <div className="pointer-events-none absolute left-[24%] right-2 top-1.5 z-10 sm:left-[27%] sm:right-3 sm:top-2">
            <div className="flex justify-end">
              <span
                className="inline-block max-w-full rounded-md border border-violet-400/35 bg-zinc-900/95 px-2 py-1 text-right text-[10px] font-mono leading-snug text-violet-200 shadow-sm [overflow-wrap:anywhere] [word-break:break-word]"
                style={{
                  whiteSpace: "normal",
                  overflow: "visible",
                  textOverflow: "clip",
                  wordBreak: "break-word",
                }}
              >
                {branchLabel}
              </span>
            </div>
          </div>
        )}
        {showRemote && (
          <div
            className="pointer-events-none absolute z-10 flex items-center justify-center rounded-md border border-zinc-600 bg-[rgb(24,24,27)] px-1.5 py-1 box-border"
            style={{
              left: `${(REMOTE_BOX_X / VB_W) * 100}%`,
              top: `${(REMOTE_BOX_Y / VB_H) * 100}%`,
              width: `${(REMOTE_BOX_W / VB_W) * 100}%`,
              minHeight: `${(REMOTE_BOX_H / VB_H) * 100}%`,
            }}
          >
            <span
              className="block w-full text-center text-[8px] font-mono leading-snug text-zinc-400 sm:text-[9px]"
              style={{
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                whiteSpace: "normal",
                textOverflow: "clip",
              }}
            >
              {`origin/${branchLabel}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
