'use client';

import React from 'react';
import { KEYBOARD_ROWS, KeyDef } from '@/app/lib/keyboard';

interface KeyboardProps {
  /** char that should be pressed next (lowercase) */
  targetChar?: string;
  /** feedback state for the last press */
  lastResult?: { char: string; correct: boolean } | null;
}

const UNIT = 44; // base key width in px
const GAP = 5;

function keyMatchesTarget(k: KeyDef, target?: string): boolean {
  if (!target) return false;
  if (target === ' ') return k.special === 'space';
  return k.key.toLowerCase() === target.toLowerCase();
}

export default function Keyboard({ targetChar, lastResult }: KeyboardProps) {
  return (
    <div
      className="inline-block rounded-xl p-3 select-none"
      style={{ background: 'var(--surface-2)' }}
    >
      <div className="flex flex-col gap-[5px]">
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-[5px]">
            {row.map((k) => {
              const isTarget = keyMatchesTarget(k, targetChar);
              const width = (k.width ?? 1) * UNIT + ((k.width ?? 1) - 1) * GAP;

              let bg = 'var(--key-bg)';
              let border = 'var(--key-border)';
              let color = 'var(--text)';
              let boxShadow = '0 2px 0 var(--key-border)';

              if (isTarget) {
                if (lastResult && !lastResult.correct) {
                  bg = 'var(--error)';
                  border = 'var(--error)';
                  color = '#fff';
                  boxShadow = '0 0 0 3px var(--error)';
                } else {
                  bg = 'var(--accent)';
                  border = 'var(--accent)';
                  color = '#fff';
                  boxShadow = '0 0 0 3px var(--accent-soft)';
                }
              }

              return (
                <div
                  key={k.key}
                  className="flex items-center justify-center rounded-md text-sm font-medium relative"
                  style={{
                    width,
                    height: UNIT,
                    background: bg,
                    border: `1px solid ${border}`,
                    color,
                    boxShadow,
                    transition: 'background 0.1s, box-shadow 0.1s, color 0.1s',
                  }}
                >
                  {k.shiftLabel && (
                    <span className="absolute top-1 left-1.5 text-[9px] opacity-60">
                      {k.shiftLabel}
                    </span>
                  )}
                  <span className={k.shiftLabel ? 'mt-2' : ''}>{k.label}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
