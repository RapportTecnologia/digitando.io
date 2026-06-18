'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface NoteTracksProps {
  sequence: string;
  currentIndex: number;
  /** results[i] = true correct, false incorrect, undefined not yet typed */
  results: (boolean | undefined)[];
}

const SLOT = 52; // px per note slot
const VISIBLE_BEFORE = 5;
const VISIBLE_AFTER = 8;

function displayChar(c: string) {
  if (c === ' ') return '␣';
  return c.toUpperCase();
}

export default function NoteTracks({ sequence, currentIndex, results }: NoteTracksProps) {
  const chars = sequence.split('');

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl"
      style={{ background: 'var(--track-bg)', height: 130 }}
    >
      {/* lane guide lines */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] opacity-30"
        style={{ background: 'var(--text-muted)' }}
      />

      {/* hit line (center) */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-[3px] -translate-x-1/2 z-20"
        style={{ background: 'var(--accent)' }}
      />
      <div
        className="absolute left-1/2 top-2 -translate-x-1/2 z-20 text-[10px] font-bold uppercase tracking-wider"
        style={{ color: 'var(--accent)' }}
      >
        digite
      </div>

      {/* notes container, centered on hit line, translated by currentIndex */}
      <motion.div
        className="absolute top-1/2 left-1/2"
        animate={{ x: -currentIndex * SLOT }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        style={{ translateY: '-50%' }}
      >
        {chars.map((c, i) => {
          const offset = i - currentIndex;
          if (offset < -VISIBLE_BEFORE || offset > VISIBLE_AFTER) return null;

          const isCurrent = i === currentIndex;
          const result = results[i];

          let bg = 'var(--surface)';
          let color = 'var(--text)';
          let border = 'var(--key-border)';
          let scale = 1;
          let opacity = 1;

          if (result === true) {
            bg = 'var(--success)';
            color = '#fff';
            border = 'var(--success)';
            opacity = 0.55;
          } else if (result === false) {
            bg = 'var(--error)';
            color = '#fff';
            border = 'var(--error)';
            opacity = 0.55;
          } else if (isCurrent) {
            bg = 'var(--accent)';
            color = '#fff';
            border = 'var(--accent)';
            scale = 1.25;
          } else {
            opacity = Math.max(0.35, 1 - offset * 0.08);
          }

          return (
            <div
              key={i}
              className="absolute flex items-center justify-center rounded-lg font-bold text-lg z-10"
              style={{
                left: i * SLOT - 22,
                top: -22,
                width: 44,
                height: 44,
                background: bg,
                color,
                border: `2px solid ${border}`,
                opacity,
                transform: `scale(${scale})`,
                transition: 'background 0.15s, opacity 0.2s, transform 0.15s',
                boxShadow: isCurrent ? '0 0 12px var(--accent)' : 'none',
              }}
            >
              {displayChar(c)}
            </div>
          );
        })}
      </motion.div>

      {/* feedback markers above/below hit line */}
      <ResultMarker results={results} currentIndex={currentIndex} />
    </div>
  );
}

function ResultMarker({
  results,
  currentIndex,
}: {
  results: (boolean | undefined)[];
  currentIndex: number;
}) {
  const last = currentIndex > 0 ? results[currentIndex - 1] : undefined;
  if (last === undefined) return null;
  return (
    <motion.div
      key={currentIndex}
      initial={{ opacity: 0, y: last ? 10 : -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute left-1/2 -translate-x-1/2 z-30 text-sm font-bold"
      style={{
        color: last ? 'var(--success)' : 'var(--error)',
        top: last ? undefined : 8,
        bottom: last ? 8 : undefined,
      }}
    >
      {last ? '✓ acerto' : '✗ erro'}
    </motion.div>
  );
}
