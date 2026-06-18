'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ArrowLeft, Star, Trophy } from 'lucide-react';
import Keyboard from './Keyboard';
import VirtualHands from './VirtualHands';
import NoteTracks from './NoteTracks';
import { Phase, generateSequence, computeStars, passedPhase } from '@/app/lib/curriculum';
import { getFingerForChar, FingerId, FINGER_LABEL } from '@/app/lib/keyboard';

interface TypingGameProps {
  phase: Phase;
  onExit: () => void;
  onRoundComplete: (result: { accuracy: number; wpm: number; stars: number; passed: boolean; points: number }) => void;
}

interface RoundState {
  sequence: string;
  index: number;
  results: (boolean | undefined)[];
  errors: number;
  typed: number;
  startTime: number | null;
}

function newRound(phase: Phase): RoundState {
  const sequence = generateSequence(phase);
  return {
    sequence,
    index: 0,
    results: new Array(sequence.length).fill(undefined),
    errors: 0,
    typed: 0,
    startTime: null,
  };
}

export default function TypingGame({ phase, onExit, onRoundComplete }: TypingGameProps) {
  const [round, setRound] = useState<RoundState>(() => newRound(phase));
  const [lastResult, setLastResult] = useState<{ char: string; correct: boolean } | null>(null);
  const [finished, setFinished] = useState<null | {
    accuracy: number;
    wpm: number;
    stars: number;
    passed: boolean;
    points: number;
  }>(null);
  const [now, setNow] = useState(Date.now());

  const roundRef = useRef(round);
  roundRef.current = round;

  // live timer for stats
  useEffect(() => {
    if (round.startTime && !finished) {
      const id = setInterval(() => setNow(Date.now()), 200);
      return () => clearInterval(id);
    }
  }, [round.startTime, finished]);

  const targetChar = round.sequence[round.index];
  const activeFinger: FingerId | undefined = targetChar ? getFingerForChar(targetChar) : undefined;

  const computeStats = useCallback(
    (r: RoundState, endTime: number) => {
      const elapsedMin = r.startTime ? (endTime - r.startTime) / 60000 : 0;
      const correct = r.typed - r.errors;
      const wpm = elapsedMin > 0 ? Math.round(correct / 5 / elapsedMin) : 0;
      const accuracy = r.typed > 0 ? Math.round((correct / r.typed) * 100) : 100;
      return { wpm, accuracy };
    },
    []
  );

  const finishRound = useCallback(
    (r: RoundState) => {
      const { wpm, accuracy } = computeStats(r, Date.now());
      const stars = computeStars(accuracy, wpm, phase);
      const passed = passedPhase(accuracy, wpm, phase);
      const points = Math.max(0, (r.typed - r.errors) * 10 + stars * 100 + (passed ? 200 : 0));
      const result = { accuracy, wpm, stars, passed, points };
      setFinished(result);
      onRoundComplete(result);
    },
    [computeStats, phase, onRoundComplete]
  );

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (finished) return;
      const r = roundRef.current;
      if (r.index >= r.sequence.length) return;

      const expected = r.sequence[r.index];

      // Determine pressed char
      let pressed = e.key;
      if (pressed === ' ') {
        e.preventDefault();
      }
      // Ignore pure modifier / control keys
      if (
        pressed === 'Shift' ||
        pressed === 'Control' ||
        pressed === 'Alt' ||
        pressed === 'CapsLock' ||
        pressed === 'Tab' ||
        pressed === 'Meta' ||
        pressed === 'Dead' ||
        pressed === 'Enter' ||
        pressed === 'Backspace' ||
        pressed.startsWith('Arrow')
      ) {
        if (pressed === 'Tab') e.preventDefault();
        return;
      }
      if (pressed.length !== 1) return;

      const correct = pressed.toLowerCase() === expected.toLowerCase();

      setLastResult({ char: pressed.toLowerCase(), correct });

      setRound((prev) => {
        const start = prev.startTime ?? Date.now();
        const results = [...prev.results];
        results[prev.index] = correct;
        const next: RoundState = {
          ...prev,
          startTime: start,
          typed: prev.typed + 1,
          errors: prev.errors + (correct ? 0 : 1),
          index: correct ? prev.index + 1 : prev.index,
          results,
        };
        if (correct && next.index >= next.sequence.length) {
          // round done
          setTimeout(() => finishRound(next), 50);
        }
        return next;
      });
    },
    [finished, finishRound]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const restart = () => {
    setRound(newRound(phase));
    setLastResult(null);
    setFinished(null);
  };

  const liveStats = round.startTime ? computeStats(round, now) : { wpm: 0, accuracy: 100 };
  const progressPct = Math.round((round.index / Math.max(1, round.sequence.length)) * 100);

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-6 py-6">
      {/* header row */}
      <div className="flex w-full items-center justify-between">
        <button
          onClick={onExit}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:opacity-80"
          style={{ background: 'var(--surface-2)', color: 'var(--text)' }}
        >
          <ArrowLeft className="h-4 w-4" /> Fases
        </button>
        <div className="text-center">
          <h2 className="font-bold" style={{ color: 'var(--text)' }}>
            Fase {phase.id}: {phase.title}
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Meta: {phase.targetAccuracy}% de precisão • {phase.targetWpm} PPM
          </p>
        </div>
        <button
          onClick={restart}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:opacity-80"
          style={{ background: 'var(--surface-2)', color: 'var(--text)' }}
        >
          <RotateCcw className="h-4 w-4" /> Reiniciar
        </button>
      </div>

      {/* live stats bar */}
      <div className="flex w-full items-center gap-4">
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--accent)' }}
            animate={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="text-sm font-semibold tabular-nums" style={{ color: 'var(--text)' }}>
          {liveStats.wpm} PPM
        </span>
        <span className="text-sm font-semibold tabular-nums" style={{ color: 'var(--text)' }}>
          {liveStats.accuracy}%
        </span>
      </div>

      {/* finger hint */}
      <div
        className="rounded-full px-4 py-1.5 text-sm font-medium"
        style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
      >
        {activeFinger ? (
          <>
            Use o <b>{FINGER_LABEL[activeFinger]}</b> para a tecla{' '}
            <b>{targetChar === ' ' ? 'Espaço' : targetChar?.toUpperCase()}</b>
          </>
        ) : (
          'Posicione os dedos na linha base (A S D F — J K L Ç)'
        )}
      </div>

      {/* virtual hands */}
      <VirtualHands activeFinger={activeFinger} />

      {/* keyboard */}
      <div className="overflow-x-auto max-w-full">
        <Keyboard targetChar={targetChar} lastResult={lastResult} />
      </div>

      {/* note tracks */}
      <div className="w-full">
        <NoteTracks sequence={round.sequence} currentIndex={round.index} results={round.results} />
      </div>

      {/* completion overlay */}
      {finished && (
        <ResultOverlay result={finished} phase={phase} onRetry={restart} onExit={onExit} />
      )}
    </div>
  );
}

function ResultOverlay({
  result,
  phase,
  onRetry,
  onExit,
}: {
  result: { accuracy: number; wpm: number; stars: number; passed: boolean; points: number };
  phase: Phase;
  onRetry: () => void;
  onExit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm rounded-2xl p-8 text-center shadow-2xl"
        style={{ background: 'var(--surface)', color: 'var(--text)' }}
      >
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <motion.div key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: s * 0.15 }}>
              <Star
                className="h-10 w-10"
                fill={s <= result.stars ? 'var(--accent)' : 'none'}
                style={{ color: s <= result.stars ? 'var(--accent)' : 'var(--text-muted)' }}
              />
            </motion.div>
          ))}
        </div>

        <h3 className="text-xl font-bold">
          {result.passed ? 'Fase concluída!' : 'Quase lá!'}
        </h3>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {result.passed
            ? 'Você atingiu as metas e liberou a próxima fase.'
            : `Você precisa de ${phase.targetAccuracy}% de precisão e ${phase.targetWpm} PPM.`}
        </p>

        <div className="grid grid-cols-2 gap-3 my-5">
          <div className="rounded-xl p-3" style={{ background: 'var(--surface-2)' }}>
            <p className="text-2xl font-bold">{result.wpm}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>PPM</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'var(--surface-2)' }}>
            <p className="text-2xl font-bold">{result.accuracy}%</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Precisão</p>
          </div>
        </div>

        <div
          className="flex items-center justify-center gap-2 rounded-xl py-2 mb-5"
          style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
        >
          <Trophy className="h-4 w-4" />
          <span className="font-bold">+{result.points} pontos</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 rounded-lg py-2.5 font-medium transition hover:opacity-80"
            style={{ background: 'var(--surface-2)', color: 'var(--text)' }}
          >
            Repetir
          </button>
          <button
            onClick={onExit}
            className="flex-1 rounded-lg py-2.5 font-semibold text-white transition hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            {result.passed ? 'Continuar' : 'Voltar'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
