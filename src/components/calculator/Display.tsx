'use client';

import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { evaluate, formatNumber } from '@/lib/math';
import { prettifyExpression } from '@/utils/expression';
import { useCalculatorStore } from '@/store/calculatorStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useAnimationsEnabled } from '@/hooks/useAnimationsEnabled';

interface DisplayProps {
  booting?: boolean;
}

/**
 * The LCD. Renders a running preview while typing and the final result after
 * equals, with subtle digit animation, annunciators (memory / angle unit) and a
 * glass reflection overlay. All visual richness is CSS; logic stays here.
 */
export function Display({ booting = false }: DisplayProps) {
  const expression = useCalculatorStore((s) => s.expression);
  const result = useCalculatorStore((s) => s.result);
  const lastExpression = useCalculatorStore((s) => s.lastExpression);
  const error = useCalculatorStore((s) => s.error);
  const justEvaluated = useCalculatorStore((s) => s.justEvaluated);
  const hasMemory = useCalculatorStore((s) => s.hasMemory);

  const mode = useSettingsStore((s) => s.mode);
  const angleUnit = useSettingsStore((s) => s.angleUnit);
  const precision = useSettingsStore((s) => s.precision);
  const animate = useAnimationsEnabled();

  const { main, sub, mainKey, isError } = useMemo(() => {
    if (error) {
      return { main: 'Error', sub: error, mainKey: `err:${error}`, isError: true };
    }
    if (justEvaluated && result) {
      return { main: result, sub: lastExpression ?? '', mainKey: `res:${result}`, isError: false };
    }
    if (expression === '') {
      return { main: '0', sub: '', mainKey: 'live', isError: false };
    }

    const pretty = prettifyExpression(expression);
    const preview = evaluate(expression, { angleUnit });
    const previewText =
      preview.ok && Number.isFinite(preview.value) ? formatNumber(preview.value, precision) : '';
    const sub = previewText && previewText !== pretty ? previewText : '';
    return { main: pretty, sub, mainKey: 'live', isError: false };
  }, [error, justEvaluated, result, lastExpression, expression, angleUnit, precision]);

  const longClass =
    main.length > 18 ? 'calc-lcd__main--xs' : main.length > 12 ? 'calc-lcd__main--sm' : '';

  return (
    <div className="calc-lcd" data-booting={booting ? 'true' : undefined} role="status" aria-live="polite">
      <div className="calc-lcd__screen">
        <div className="calc-lcd__annunciators" aria-hidden="true">
          <span className="calc-lcd__ann" data-on={hasMemory ? 'true' : undefined}>
            M
          </span>
          {mode === 'scientific' ? (
            <span className="calc-lcd__ann" data-on="true">
              {angleUnit.toUpperCase()}
            </span>
          ) : null}
          <span className="calc-lcd__ann calc-lcd__ann--brand">CALSUMA</span>
        </div>

        <div className="calc-lcd__sub" aria-hidden={sub ? undefined : true}>
          {booting ? ' ' : sub || ' '}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={booting ? 'boot' : mainKey}
            className={`calc-lcd__main ${longClass}`}
            data-error={isError ? 'true' : undefined}
            initial={animate && mainKey.startsWith('res') ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={animate ? { opacity: 0, y: -10 } : undefined}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {booting ? <span className="calc-lcd__ghost">88888888</span> : main}
          </motion.div>
        </AnimatePresence>

        <span className="calc-lcd__glare" aria-hidden="true" />
        <span className="calc-lcd__grid" aria-hidden="true" />
      </div>
      <p className="sr-only">
        {isError ? `Error: ${sub}` : justEvaluated ? `Result ${main}` : `Current entry ${main}`}
      </p>
    </div>
  );
}
