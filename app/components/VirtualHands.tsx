'use client';

import React from 'react';
import { FingerId, FINGER_HAND } from '@/app/lib/keyboard';

interface VirtualHandsProps {
  activeFinger?: FingerId;
}

const ACTIVE = 'var(--accent)';
const SKIN = '#e8b893';
const SKIN_DARK = '#d49d77';
const STROKE = '#b07b56';

// Finger order on each hand from thumb side
// Left hand fingers: thumb, L-index, L-middle, L-ring, L-pinky
// Right hand fingers: thumb, R-index, R-middle, R-ring, R-pinky

function Finger({
  x,
  width,
  height,
  active,
  baseY = 90,
}: {
  x: number;
  width: number;
  height: number;
  active: boolean;
  baseY?: number;
}) {
  const fill = active ? ACTIVE : SKIN;
  const stroke = active ? ACTIVE : STROKE;
  return (
    <rect
      x={x}
      y={baseY - height}
      width={width}
      height={height + 30}
      rx={width / 2}
      fill={fill}
      stroke={stroke}
      strokeWidth={2}
      style={{ transition: 'fill 0.12s, stroke 0.12s' }}
    />
  );
}

/** A single hand drawn as SVG. mirror=true for right hand. */
function Hand({
  hand,
  activeFinger,
}: {
  hand: 'left' | 'right';
  activeFinger?: FingerId;
}) {
  const isLeft = hand === 'left';

  // Finger ids ordered index->pinky for this hand
  const fingerIds: FingerId[] = isLeft
    ? ['L-index', 'L-middle', 'L-ring', 'L-pinky']
    : ['R-index', 'R-middle', 'R-ring', 'R-pinky'];

  const thumbActive = activeFinger === 'thumb';

  // Finger geometry (index, middle, ring, pinky) — heights vary
  const fingerData = [
    { w: 22, h: 70 }, // index
    { w: 22, h: 82 }, // middle
    { w: 22, h: 74 }, // ring
    { w: 19, h: 56 }, // pinky
  ];

  // base x positions for the 4 fingers
  const xs = [60, 86, 112, 138];

  const content = (
    <svg width={200} height={210} viewBox="0 0 200 210">
      {/* Palm */}
      <path
        d="M48 88 Q44 150 70 185 Q100 205 135 188 Q165 168 162 110 L162 92 Q120 100 90 96 Q66 94 48 88 Z"
        fill={SKIN_DARK}
        stroke={STROKE}
        strokeWidth={2}
      />
      {/* Fingers */}
      {fingerData.map((f, i) => (
        <Finger
          key={i}
          x={xs[i]}
          width={f.w}
          height={f.h}
          baseY={96}
          active={activeFinger === fingerIds[i]}
        />
      ))}
      {/* Thumb */}
      <rect
        x={150}
        y={120}
        width={20}
        height={56}
        rx={10}
        transform="rotate(48 160 148)"
        fill={thumbActive ? ACTIVE : SKIN}
        stroke={thumbActive ? ACTIVE : STROKE}
        strokeWidth={2}
        style={{ transition: 'fill 0.12s, stroke 0.12s' }}
      />
    </svg>
  );

  return (
    <div className="flex flex-col items-center gap-1">
      <div style={{ transform: isLeft ? 'scaleX(-1)' : 'none' }}>{content}</div>
      <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
        {isLeft ? 'Mão esquerda' : 'Mão direita'}
      </span>
    </div>
  );
}

export default function VirtualHands({ activeFinger }: VirtualHandsProps) {
  const activeHand = activeFinger ? FINGER_HAND[activeFinger] : undefined;

  return (
    <div className="flex items-end justify-center gap-8">
      <div
        className="rounded-xl p-2 transition"
        style={{
          outline: activeHand === 'left' ? `2px solid var(--accent)` : '2px solid transparent',
        }}
      >
        <Hand hand="left" activeFinger={activeFinger} />
      </div>
      <div
        className="rounded-xl p-2 transition"
        style={{
          outline: activeHand === 'right' ? `2px solid var(--accent)` : '2px solid transparent',
        }}
      >
        <Hand hand="right" activeFinger={activeFinger} />
      </div>
    </div>
  );
}
