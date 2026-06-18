'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Star, Check, Play, Target, Gauge, FileText } from 'lucide-react';
import { PHASES } from '@/app/lib/curriculum';
import { useSession } from '@/app/context/SessionContext';

interface PhaseSelectorProps {
  onSelect: (phaseId: number) => void;
}

export default function PhaseSelector({ onSelect }: PhaseSelectorProps) {
  const { progress } = useSession();

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
          Sua jornada de digitação
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Conclua cada fase com 95% de precisão e a velocidade alvo para liberar a próxima.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PHASES.map((phase, idx) => {
          const unlocked = phase.id <= progress.highestUnlocked;
          const completed = progress.completedPhases.includes(phase.id);
          const score = progress.scores[phase.id];
          const stars = score?.stars ?? 0;

          return (
            <motion.button
              key={phase.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              disabled={!unlocked}
              onClick={() => unlocked && onSelect(phase.id)}
              className="relative flex flex-col gap-3 rounded-2xl border p-5 text-left transition"
              style={{
                background: 'var(--surface)',
                borderColor: completed ? 'var(--success)' : 'var(--key-border)',
                opacity: unlocked ? 1 : 0.55,
                cursor: unlocked ? 'pointer' : 'not-allowed',
              }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl font-bold text-lg"
                  style={{
                    background: phase.freePractice
                      ? 'var(--accent-soft)'
                      : completed
                      ? 'var(--success)'
                      : 'var(--accent)',
                    color: phase.freePractice ? 'var(--accent)' : '#fff',
                  }}
                >
                  {phase.freePractice ? <FileText className="h-5 w-5" /> : completed ? <Check className="h-5 w-5" /> : phase.id}
                </div>
                {!unlocked && <Lock className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />}
                {unlocked && !phase.freePractice && (
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className="h-4 w-4"
                        fill={s <= stars ? 'var(--accent)' : 'none'}
                        style={{ color: s <= stars ? 'var(--accent)' : 'var(--text-muted)' }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold" style={{ color: 'var(--text)' }}>
                  {phase.title}
                </h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {phase.description}
                </p>
              </div>

              {!phase.freePractice && (
                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-1">
                    <Target className="h-3.5 w-3.5" /> {phase.targetAccuracy}%
                  </span>
                  <span className="flex items-center gap-1">
                    <Gauge className="h-3.5 w-3.5" /> {phase.targetWpm} PPM
                  </span>
                </div>
              )}

              {unlocked && (
                <div
                  className="flex items-center gap-1 text-sm font-medium mt-auto"
                  style={{ color: 'var(--accent)' }}
                >
                  <Play className="h-3.5 w-3.5" fill="var(--accent)" />
                  {completed ? 'Treinar novamente' : 'Iniciar'}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
