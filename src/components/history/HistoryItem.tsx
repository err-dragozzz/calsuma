'use client';

import { useState } from 'react';
import type { HistoryEntry } from '@/types';
import { copyToClipboard } from '@/utils/clipboard';
import { formatRelativeTime } from '@/utils/time';
import { cn } from '@/utils/cn';
import { CheckIcon, CopyIcon, PinIcon, TrashIcon } from '@/components/icons';

interface HistoryItemProps {
  entry: HistoryEntry;
  onRecall: (entry: HistoryEntry) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
}

/** A single history row with recall, copy, pin and delete affordances. */
export function HistoryItem({ entry, onRecall, onTogglePin, onDelete }: HistoryItemProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (): Promise<void> => {
    const ok = await copyToClipboard(entry.result);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    }
  };

  return (
    <li className={cn('history-item', entry.pinned && 'history-item--pinned')}>
      <button
        type="button"
        className="history-item__recall"
        onClick={() => onRecall(entry)}
        title="Use this result"
      >
        <span className="history-item__expr">{entry.expression}</span>
        <span className="history-item__result">= {entry.result}</span>
        <span className="history-item__time">{formatRelativeTime(entry.timestamp)}</span>
      </button>
      <div className="history-item__actions">
        <button
          type="button"
          className={cn('history-item__action', entry.pinned && 'is-active')}
          aria-pressed={entry.pinned}
          aria-label={entry.pinned ? 'Unpin calculation' : 'Pin calculation'}
          title={entry.pinned ? 'Unpin' : 'Pin'}
          onClick={() => onTogglePin(entry.id)}
        >
          <PinIcon />
        </button>
        <button
          type="button"
          className="history-item__action"
          aria-label="Copy result"
          title="Copy result"
          onClick={handleCopy}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
        <button
          type="button"
          className="history-item__action"
          aria-label="Delete calculation"
          title="Delete"
          onClick={() => onDelete(entry.id)}
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
}
