'use client';

/**
 * Core calculator state machine. Holds the working expression, evaluated
 * result, memory register and calculation history. All mutations go through
 * small, well-defined actions so behaviour stays predictable and testable.
 *
 * History and memory are persisted; the volatile working expression is not.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CalcAction, HistoryEntry } from '@/types';
import { MAX_HISTORY, STORAGE_KEYS } from '@/constants/defaults';
import { evaluate, formatNumber, unformatNumber } from '@/lib/math';
import {
  canAppendDecimal,
  endsWithOperator,
  negateTrailingNumber,
  prettifyExpression,
} from '@/utils/expression';
import { createId } from '@/utils/id';
import { createJSONStorage } from '@/utils/storage';
import { useSettingsStore } from './settingsStore';

const MAX_EXPRESSION_LENGTH = 240;
const BINARY_OPERATORS = new Set(['+', '×', '÷', '^']);

const isBinaryOperator = (value: string): boolean =>
  BINARY_OPERATORS.has(value) || value === ' mod ';

interface CalculatorState {
  expression: string;
  /** Formatted result shown large after pressing equals. */
  result: string | null;
  /** The expression that produced the current result (small secondary line). */
  lastExpression: string | null;
  error: string | null;
  justEvaluated: boolean;
  memory: number;
  hasMemory: boolean;
  history: HistoryEntry[];
  hydrated: boolean;

  input: (value: string) => void;
  clearAll: () => void;
  clearEntry: () => void;
  del: () => void;
  negate: () => void;
  randomInput: () => void;
  evaluateExpression: () => void;
  memoryOp: (op: 'MC' | 'MR' | 'MS' | 'M+' | 'M-') => void;
  dispatch: (action: CalcAction) => void;

  recallHistory: (entry: HistoryEntry) => void;
  togglePin: (id: string) => void;
  deleteHistoryEntry: (id: string) => void;
  clearHistory: () => void;
  setHydrated: () => void;
}

/** Subset of state written to storage (see `partialize` below). */
type PersistedCalculatorState = Pick<CalculatorState, 'history' | 'memory' | 'hasMemory'>;

/** Read the live precision/angle settings without subscribing. */
const readSettings = () => {
  const { precision, angleUnit, autoHistory } = useSettingsStore.getState();
  return { precision, angleUnit, autoHistory };
};

/** Current numeric value of the working expression, or null when invalid. */
const currentValue = (expression: string): number | null => {
  if (expression.trim() === '') return 0;
  const { angleUnit } = readSettings();
  const res = evaluate(expression, { angleUnit });
  return res.ok ? res.value : null;
};

/** Trim history to the cap while always preserving pinned entries. */
const capHistory = (entries: HistoryEntry[]): HistoryEntry[] => {
  if (entries.length <= MAX_HISTORY) return entries;
  const pinned = entries.filter((entry) => entry.pinned);
  const unpinned = entries.filter((entry) => !entry.pinned);
  return [...pinned, ...unpinned].slice(0, MAX_HISTORY);
};

export const useCalculatorStore = create<CalculatorState>()(
  persist<CalculatorState, [], [], PersistedCalculatorState>(
    (set, get) => ({
      expression: '',
      result: null,
      lastExpression: null,
      error: null,
      justEvaluated: false,
      memory: 0,
      hasMemory: false,
      history: [],
      hydrated: false,

      input: (value) => {
        const state = get();
        let expr = state.expression;
        let justEvaluated = state.justEvaluated;

        if (justEvaluated) {
          if (isBinaryOperator(value) || value === '%' || value === '!' || value === '^2' || value === '^3') {
            justEvaluated = false; // chain from the previous result
          } else {
            expr = '';
            justEvaluated = false;
          }
        }

        if (expr.length >= MAX_EXPRESSION_LENGTH) return;

        if (value === '.' && !canAppendDecimal(expr)) return;

        if (isBinaryOperator(value)) {
          if (expr === '') return; // no leading binary operator
          if (endsWithOperator(expr)) {
            expr = expr.replace(/\s*mod\s*$/, '').replace(/\s*[+\-×÷^]\s*$/, '');
          }
        }

        set({ expression: expr + value, result: null, lastExpression: null, error: null, justEvaluated });
      },

      clearAll: () =>
        set({ expression: '', result: null, lastExpression: null, error: null, justEvaluated: false }),

      clearEntry: () => {
        const expr = get().expression;
        const next = expr.replace(/(\d*\.?\d+|[a-zπ√]+\(|\smod\s|[+\-×÷^%!()])$/i, '');
        set({ expression: next, result: null, error: null, justEvaluated: false });
      },

      del: () => {
        const state = get();
        const base = state.justEvaluated ? state.expression : state.expression;
        set({
          expression: base.slice(0, -1),
          result: null,
          error: null,
          justEvaluated: false,
        });
      },

      negate: () => {
        const state = get();
        set({
          expression: negateTrailingNumber(state.expression),
          result: null,
          error: null,
          justEvaluated: false,
        });
      },

      randomInput: () => {
        const value = Math.random();
        get().input(String(value));
      },

      evaluateExpression: () => {
        const state = get();
        const expr = state.expression.trim();
        if (expr === '') return;

        const { precision, angleUnit, autoHistory } = readSettings();
        const res = evaluate(expr, { angleUnit });

        if (!res.ok) {
          set({ error: res.error ?? 'Error', result: null, justEvaluated: false });
          return;
        }

        const formatted = formatNumber(res.value, precision);
        const pretty = prettifyExpression(expr);

        const entry: HistoryEntry = {
          id: createId(),
          expression: pretty,
          result: formatted,
          value: res.value,
          timestamp: Date.now(),
          pinned: false,
        };

        set({
          expression: Number.isFinite(res.value) ? unformatNumber(String(res.value)) : formatted,
          result: formatted,
          lastExpression: pretty,
          error: null,
          justEvaluated: true,
          history: autoHistory ? capHistory([entry, ...state.history]) : state.history,
        });
      },

      memoryOp: (op) => {
        const state = get();

        switch (op) {
          case 'MC':
            set({ memory: 0, hasMemory: false });
            return;
          case 'MR': {
            if (!state.hasMemory) return;
            const memStr = unformatNumber(String(state.memory));
            const expr = state.expression;
            if (state.justEvaluated || expr === '' || endsWithOperator(expr)) {
              set({
                expression: (state.justEvaluated ? '' : expr) + memStr,
                result: null,
                error: null,
                justEvaluated: false,
              });
            } else {
              const replaced = expr.replace(/(\d*\.?\d+)$/, memStr);
              set({ expression: replaced === expr ? expr + memStr : replaced, result: null, justEvaluated: false });
            }
            return;
          }
          case 'MS': {
            const value = currentValue(state.expression);
            if (value === null) return;
            set({ memory: value, hasMemory: true });
            return;
          }
          case 'M+': {
            const value = currentValue(state.expression);
            if (value === null) return;
            set({ memory: state.memory + value, hasMemory: true });
            return;
          }
          case 'M-': {
            const value = currentValue(state.expression);
            if (value === null) return;
            set({ memory: state.memory - value, hasMemory: true });
            return;
          }
          default:
            return;
        }
      },

      dispatch: (action) => {
        const store = get();
        switch (action.type) {
          case 'input':
            store.input(action.value);
            break;
          case 'clearAll':
            store.clearAll();
            break;
          case 'clearEntry':
            store.clearEntry();
            break;
          case 'delete':
            store.del();
            break;
          case 'evaluate':
            store.evaluateExpression();
            break;
          case 'negate':
            store.negate();
            break;
          case 'percent':
            store.input('%');
            break;
          case 'random':
            store.randomInput();
            break;
          case 'memory':
            store.memoryOp(action.op);
            break;
          default:
            break;
        }
      },

      recallHistory: (entry) => {
        const { precision } = readSettings();
        set({
          expression: Number.isFinite(entry.value)
            ? unformatNumber(String(entry.value))
            : entry.result,
          result: formatNumber(entry.value, precision),
          lastExpression: entry.expression,
          error: null,
          justEvaluated: true,
        });
      },

      togglePin: (id) =>
        set((state) => ({
          history: state.history.map((entry) =>
            entry.id === id ? { ...entry, pinned: !entry.pinned } : entry,
          ),
        })),

      deleteHistoryEntry: (id) =>
        set((state) => ({ history: state.history.filter((entry) => entry.id !== id) })),

      clearHistory: () => set((state) => ({ history: state.history.filter((e) => e.pinned) })),

      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: STORAGE_KEYS.calculator,
      storage: createJSONStorage<PersistedCalculatorState>(),
      partialize: (state) => ({
        history: state.history,
        memory: state.memory,
        hasMemory: state.hasMemory,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
