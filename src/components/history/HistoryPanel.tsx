'use client';

import { useMemo, useState } from 'react';
import type { HistoryEntry } from '@/types';
import { useCalculatorStore } from '@/store/calculatorStore';
import { SearchIcon } from '@/components/icons';
import { HistoryItem } from './HistoryItem';

interface HistoryPanelProps {
  onRecall: (entry: HistoryEntry) => void;
}

/** Sort pinned entries first, otherwise keep newest-first insertion order. */
function sortEntries(entries: HistoryEntry[]): HistoryEntry[] {
  return [...entries].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.timestamp - a.timestamp;
  });
}

/**
 * Searchable, unlimited calculation history. Supports recall, copy, pin and
 * delete, plus a bulk clear that preserves pinned items.
 */
export function HistoryPanel({ onRecall }: HistoryPanelProps) {
  const history = useCalculatorStore((s) => s.history);
  const togglePin = useCalculatorStore((s) => s.togglePin);
  const deleteEntry = useCalculatorStore((s) => s.deleteHistoryEntry);
  const clearHistory = useCalculatorStore((s) => s.clearHistory);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const sorted = sortEntries(history);
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(
      (entry) =>
        entry.expression.toLowerCase().includes(q) || entry.result.toLowerCase().includes(q),
    );
  }, [history, query]);

  const hasHistory = history.length > 0;

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--panel-fg-muted)]">
          <SearchIcon />
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search history"
          aria-label="Search calculation history"
          className="w-full rounded-xl border border-[var(--panel-border)] bg-[var(--input-bg)] py-2.5 pl-10 pr-3 text-sm text-[var(--panel-fg)] placeholder:text-[var(--panel-fg-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
        />
      </div>

      {hasHistory ? (
        <div className="flex items-center justify-between text-xs text-[var(--panel-fg-muted)]">
          <span>
            {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
          </span>
          <button
            type="button"
            onClick={clearHistory}
            className="rounded-md px-2 py-1 font-medium text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          >
            Clear history
          </button>
        </div>
      ) : null}

      {filtered.length > 0 ? (
        <ul className="flex flex-col gap-2 overflow-y-auto pr-1">
          {filtered.map((entry) => (
            <HistoryItem
              key={entry.id}
              entry={entry}
              onRecall={onRecall}
              onTogglePin={togglePin}
              onDelete={deleteEntry}
            />
          ))}
        </ul>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center">
          <p className="text-sm font-medium text-[var(--panel-fg)]">
            {hasHistory ? 'No matches' : 'No calculations yet'}
          </p>
          <p className="max-w-[24ch] text-xs text-[var(--panel-fg-muted)]">
            {hasHistory
              ? 'Try a different search term.'
              : 'Your calculations will appear here. Pin the ones you want to keep.'}
          </p>
        </div>
      )}
    </div>
  );
}
