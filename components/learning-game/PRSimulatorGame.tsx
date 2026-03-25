"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LEARNING_GAME_STAGES,
  parseCheckoutBranch,
  validateGitAdd,
  validateGitCommit,
  validateGitPush,
} from "@/lib/learningGameStages";
import { RepoStateVisual } from "@/components/learning-game/RepoStateVisual";

const EDIT_PLACEHOLDER = "Your Name";

function isEditNameValid(value: string): boolean {
  const t = value.trim();
  return t.length >= 2 && !/^your\s*name$/i.test(t);
}

export function PRSimulatorGame() {
  const [stageIndex, setStageIndex] = useState(0);
  const [branchName, setBranchName] = useState("");
  const [commandInput, setCommandInput] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const stage = LEARNING_GAME_STAGES[stageIndex];
  const isDone = stageIndex >= LEARNING_GAME_STAGES.length;
  const [contributorDraft, setContributorDraft] = useState(EDIT_PLACEHOLDER);
  const [editLineVisible, setEditLineVisible] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  const editNameValid = useMemo(() => isEditNameValid(contributorDraft), [contributorDraft]);

  useEffect(() => {
    if (stage?.id !== "edit") {
      setEditLineVisible(false);
      return;
    }
    setEditLineVisible(false);
    const t = window.setTimeout(() => setEditLineVisible(true), 450);
    return () => window.clearTimeout(t);
  }, [stage?.id, stageIndex]);

  useEffect(() => {
    if (stage?.id !== "edit" || !editLineVisible) return;
    const el = editInputRef.current;
    if (!el) return;
    el.focus();
    el.select();
  }, [stage?.id, editLineVisible]);

  const tryAdvance = useCallback(() => {
    setFeedback(null);
    if (!stage || isDone) return;

    if (stage.id === "intro" || stage.id === "edit" || stage.ctaButtonLabel) return;

    const cmd = commandInput.trim();
    if (!cmd) {
      setFeedback("Enter a git command.");
      return;
    }

    if (stage.id === "branch") {
      const name = parseCheckoutBranch(cmd);
      if (!name) {
        setFeedback('Try: git checkout -b your-branch-name');
        return;
      }
      setBranchName(name);
      setCommandInput("");
      setStageIndex((i) => i + 1);
      return;
    }

    if (stage.id === "add") {
      if (!validateGitAdd(cmd)) {
        setFeedback("Try: git add . or git add path/to/file");
        return;
      }
      setCommandInput("");
      setStageIndex((i) => i + 1);
      return;
    }

    if (stage.id === "commit") {
      if (!validateGitCommit(cmd)) {
        setFeedback('Try: git commit -m "Your message here"');
        return;
      }
      setCommandInput("");
      setStageIndex((i) => i + 1);
      return;
    }

    if (stage.id === "push") {
      if (!validateGitPush(cmd, branchName)) {
        setFeedback(`Include your branch name: git push -u origin ${branchName || "your-branch"}`);
        return;
      }
      setCommandInput("");
      setStageIndex((i) => i + 1);
    }
  }, [branchName, commandInput, isDone, stage]);

  const advanceContinueOnly = useCallback(() => {
    setFeedback(null);
    setStageIndex((i) => i + 1);
  }, []);

  const confirmEditStep = useCallback(() => {
    setFeedback(null);
    if (stage?.id !== "edit") return;
    const t = contributorDraft.trim();
    if (t.length < 2) {
      setFeedback("Enter your name (at least 2 characters).");
      return;
    }
    if (/^your\s*name$/i.test(t)) {
      setFeedback('Replace "Your Name" with your real name.');
      return;
    }
    setStageIndex((i) => i + 1);
  }, [contributorDraft, stage?.id]);

  const resetGame = useCallback(() => {
    setStageIndex(0);
    setBranchName("");
    setCommandInput("");
    setContributorDraft(EDIT_PLACEHOLDER);
    setFeedback(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || isDone || !stage) return;
      if (stage.id === "edit") return;
      e.preventDefault();
      if (stage.ctaButtonLabel || stage.id === "intro") {
        advanceContinueOnly();
      } else {
        tryAdvance();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advanceContinueOnly, isDone, stage, tryAdvance]);

  return (
    <div className="space-y-4">
      <div className="relative min-h-[min(72vh,580px)] rounded-2xl border border-white/10 bg-[#06060a]/50 p-3 sm:p-4 lg:p-5">
        <div className="flex flex-col gap-5 sm:gap-6 w-full">
          {/* Top: full-width repo diagram */}
          <div className="w-full min-w-0" role="region" aria-label="Repository diagram">
            <RepoStateVisual
              stageIndex={stageIndex}
              branchName={branchName}
              contributorPreview={contributorDraft}
              isDone={isDone}
            />
          </div>

          {/* Below: current step + commands */}
          <aside className="w-full min-w-0 flex flex-col" role="region" aria-label="Instructions and commands">
            {!isDone && stage && (
              <div className="flex flex-col glass-card p-4 sm:p-5 border-[var(--color-accent)]/35 shadow-lg min-h-0 max-h-[min(70vh,520px)] overflow-hidden w-full">
                <div className="flex flex-col lg:flex-row lg:items-start gap-5 lg:gap-0 lg:divide-x lg:divide-white/10 min-h-0 flex-1">
                  <div className="lg:w-[min(34%,240px)] lg:min-w-[200px] xl:min-w-[220px] shrink-0 lg:pr-6">
                    <h3 className="text-xl font-semibold text-[var(--color-text)] tracking-tight leading-snug">
                      {stage.markerTitle}
                    </h3>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col gap-4 min-h-0 lg:pl-6 pt-1 border-t border-white/10 lg:border-t-0 lg:pt-0">
                    {(stage.why.trim() || stage.markerBody.trim()) ? (
                      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                        {stage.why.trim() || stage.markerBody.trim()}
                      </p>
                    ) : null}

                    <div className="space-y-3 min-h-0 flex-1 overflow-y-auto">
                  {stage.id !== "intro" && stage.id !== "edit" && (
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[10px] text-zinc-500">
                      {stage.ctaButtonLabel ? (
                        <span className="font-medium text-zinc-400">GitHub</span>
                      ) : (
                        <span className="font-mono text-emerald-500/80">terminal</span>
                      )}
                      {branchName ? (
                        <code className="text-[var(--color-accent)]/90">{branchName}</code>
                      ) : null}
                    </div>
                  )}
                  {stage.commandHint.trim() ? (
                    <p className="text-sm text-[var(--color-text-muted)]">{stage.commandHint}</p>
                  ) : null}
                  {stage.id !== "intro" && stage.id !== "edit" && stage.exampleCommand && (
                    <p className="text-[11px] text-zinc-500">
                      <span className="text-zinc-600">{stage.exampleLabel ?? "Example"}: </span>
                      <code className="bg-white/10 px-1.5 py-0.5 rounded text-[var(--color-accent)] text-xs">
                        {stage.exampleCommand}
                      </code>
                    </p>
                  )}
                  {stage.id === "edit" && (
                    <div className="rounded-lg border border-emerald-500/25 bg-[#0d1117] overflow-hidden text-left">
                      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 bg-white/5">
                        <span className="text-[11px] font-mono text-[var(--color-text-muted)]">lib/contributors.ts</span>
                        <span
                          className={`text-[10px] font-medium ${
                            !editLineVisible
                              ? "text-amber-400/90"
                              : editNameValid
                                ? "text-emerald-400"
                                : "text-amber-400/90"
                          }`}
                        >
                          {!editLineVisible ? "…" : editNameValid ? "OK" : "Edit"}
                        </span>
                      </div>
                      <div
                        className={`p-3 text-[11px] sm:text-xs font-mono leading-relaxed text-[var(--color-text-muted)] overflow-x-auto transition-all duration-500 ${
                          editLineVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
                        }`}
                      >
                        <span className="text-white/40 whitespace-pre">{"export const contributorsList = [\n  …\n"}</span>
                        <span className="text-emerald-400 select-none">+ </span>
                        <span className="text-[var(--color-text)]">&quot;</span>
                        <input
                          ref={editInputRef}
                          type="text"
                          value={contributorDraft}
                          onChange={(e) => setContributorDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              confirmEditStep();
                            }
                          }}
                          className="inline-block min-w-[6rem] max-w-[14rem] bg-emerald-950/50 border border-emerald-500/40 rounded px-1 py-0.5 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 align-baseline"
                          spellCheck={false}
                          autoCapitalize="words"
                          aria-label="Your name for the contributors list"
                        />
                        <span className="text-[var(--color-text)]">&quot;,</span>
                        <span className="text-white/40 whitespace-pre">{"\n];"}</span>
                      </div>
                    </div>
                  )}
                  {stage.id === "intro" ? (
                    <button
                      type="button"
                      onClick={advanceContinueOnly}
                      className="w-full px-4 py-3 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Continue
                    </button>
                  ) : stage.id === "edit" ? (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={confirmEditStep}
                        className="w-full px-4 py-3 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        Continue
                      </button>
                      {feedback && <p className="text-sm text-amber-400/90">{feedback}</p>}
                    </div>
                  ) : stage.ctaButtonLabel ? (
                    <button
                      type="button"
                      onClick={advanceContinueOnly}
                      className="w-full px-4 py-3 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      {stage.ctaButtonLabel}
                    </button>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <span className="text-emerald-400 font-mono text-sm shrink-0 pt-2.5">$</span>
                        <input
                          type="text"
                          value={commandInput}
                          onChange={(e) => setCommandInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && tryAdvance()}
                          className="flex-1 min-w-0 bg-black/30 border border-white/15 rounded-lg px-3 py-2 font-mono text-sm text-[var(--color-text)] placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
                          placeholder="Type your git command…"
                          spellCheck={false}
                          autoCapitalize="off"
                          autoCorrect="off"
                          aria-label="Git command for this milestone"
                        />
                        <button
                          type="button"
                          onClick={tryAdvance}
                          className="px-4 py-2 rounded-lg bg-white/10 text-sm font-medium text-[var(--color-text)] hover:bg-white/15 transition-colors shrink-0"
                        >
                          Run
                        </button>
                      </div>
                      {feedback && <p className="text-sm text-amber-400/90">{feedback}</p>}
                    </>
                  )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>

        {isDone && (
          <div className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl bg-black/65 backdrop-blur-sm p-4">
            <div className="glass-card max-w-sm p-6 text-center border-[var(--color-accent)]/30">
              <p className="text-2xl mb-3" aria-hidden>
                🎉
              </p>
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">All steps complete</h3>
              <button
                type="button"
                onClick={resetGame}
                className="px-4 py-2.5 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Play again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
