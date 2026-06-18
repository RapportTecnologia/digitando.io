'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Play } from 'lucide-react';
import Keyboard from './Keyboard';
import VirtualHands from './VirtualHands';
import { getFingerForChar, FingerId, FINGER_LABEL } from '@/app/lib/keyboard';

interface FreePracticeProps {
  onExit: () => void;
  onPoints: (points: number) => void;
}

const SAMPLE =
  'A prática leva à perfeição. Digite este texto com calma, mantendo os dedos na posição correta e o olhar na tela.';

export default function FreePractice({ onExit, onPoints }: FreePracticeProps) {
  const [text, setText] = useState('');
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [typed, setTyped] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [lastResult, setLastResult] = useState<{ char: string; correct: boolean } | null>(null);
  const [done, setDone] = useState(false);

  const stateRef = useRef({ index, text, started, done });
  stateRef.current = { index, text, started, done };

  useEffect(() => {
    if (startTime && !done) {
      const id = setInterval(() => setNow(Date.now()), 200);
      return () => clearInterval(id);
    }
  }, [startTime, done]);

  const targetChar = started ? text[index] : undefined;
  const activeFinger: FingerId | undefined = targetChar ? getFingerForChar(targetChar) : undefined;

  const handleKey = useCallback((e: KeyboardEvent) => {
    const s = stateRef.current;
    if (!s.started || s.done) return;
    if (s.index >= s.text.length) return;

    let pressed = e.key;
    if (pressed === ' ') e.preventDefault();
    if (
      ['Shift', 'Control', 'Alt', 'CapsLock', 'Meta', 'Dead', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(pressed)
    ) {
      return;
    }
    if (pressed === 'Tab') {
      e.preventDefault();
      return;
    }
    if (pressed === 'Backspace') return;
    if (pressed.length !== 1) return;

    const expected = s.text[s.index];
    const correct = pressed.toLowerCase() === expected.toLowerCase();
    setLastResult({ char: pressed.toLowerCase(), correct });
    setStartTime((prev) => prev ?? Date.now());
    setTyped((t) => t + 1);
    if (!correct) {
      setErrors((er) => er + 1);
    } else {
      setIndex((i) => {
        const ni = i + 1;
        if (ni >= s.text.length) setDone(true);
        return ni;
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const elapsedMin = startTime ? (now - startTime) / 60000 : 0;
  const correct = typed - errors;
  const wpm = elapsedMin > 0 ? Math.round(correct / 5 / elapsedMin) : 0;
  const accuracy = typed > 0 ? Math.round((correct / typed) * 100) : 100;

  const start = () => {
    const t = text.trim();
    if (!t) return;
    setText(t);
    setStarted(true);
    setIndex(0);
    setErrors(0);
    setTyped(0);
    setStartTime(null);
    setDone(false);
    setLastResult(null);
  };

  const reset = () => {
    setStarted(false);
    setDone(false);
    setIndex(0);
    setErrors(0);
    setTyped(0);
    setStartTime(null);
  };

  useEffect(() => {
    if (done) {
      const pts = Math.max(0, correct * 5 + (accuracy >= 95 ? 100 : 0));
      onPoints(pts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5 px-6 py-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onExit}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:opacity-80"
          style={{ background: 'var(--surface-2)', color: 'var(--text)' }}
        >
          <ArrowLeft className="h-4 w-4" /> Fases
        </button>
        <h2 className="font-bold" style={{ color: 'var(--text)' }}>
          Prática Livre
        </h2>
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition hover:opacity-80"
          style={{ background: 'var(--surface-2)', color: 'var(--text)' }}
        >
          <RotateCcw className="h-4 w-4" /> Novo texto
        </button>
      </div>

      {!started ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Cole ou digite um texto para praticar. O app contabiliza acertos, precisão e velocidade.
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Cole seu texto aqui..."
            rows={6}
            className="w-full rounded-xl border p-4 outline-none transition focus:ring-2 resize-none"
            style={{ background: 'var(--surface)', borderColor: 'var(--key-border)', color: 'var(--text)' }}
          />
          <div className="flex gap-3">
            <button
              onClick={() => setText(SAMPLE)}
              className="rounded-lg px-4 py-2.5 text-sm font-medium transition hover:opacity-80"
              style={{ background: 'var(--surface-2)', color: 'var(--text)' }}
            >
              Usar texto de exemplo
            </button>
            <button
              onClick={start}
              disabled={!text.trim()}
              className="flex items-center gap-2 rounded-lg px-6 py-2.5 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--accent)' }}
            >
              <Play className="h-4 w-4" /> Começar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'var(--accent)' }}
                animate={{ width: `${Math.round((index / Math.max(1, text.length)) * 100)}%` }}
              />
            </div>
            <span className="text-sm font-semibold tabular-nums" style={{ color: 'var(--text)' }}>
              {wpm} PPM
            </span>
            <span className="text-sm font-semibold tabular-nums" style={{ color: 'var(--text)' }}>
              {accuracy}%
            </span>
          </div>

          {/* text display */}
          <div
            className="rounded-xl p-5 text-lg leading-relaxed font-mono"
            style={{ background: 'var(--surface)', color: 'var(--text)' }}
          >
            {text.split('').map((c, i) => {
              let style: React.CSSProperties = { color: 'var(--text-muted)' };
              if (i < index) style = { color: 'var(--success)' };
              else if (i === index)
                style = {
                  background: lastResult && !lastResult.correct ? 'var(--error)' : 'var(--accent)',
                  color: '#fff',
                  borderRadius: 3,
                };
              return (
                <span key={i} style={style}>
                  {c}
                </span>
              );
            })}
          </div>

          {activeFinger && (
            <div
              className="self-center rounded-full px-4 py-1.5 text-sm font-medium"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              Use o <b>{FINGER_LABEL[activeFinger]}</b>
            </div>
          )}

          <div className="flex justify-center">
            <VirtualHands activeFinger={activeFinger} />
          </div>

          <div className="flex justify-center overflow-x-auto max-w-full">
            <Keyboard targetChar={targetChar} lastResult={lastResult} />
          </div>

          {done && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-5 text-center"
              style={{ background: 'var(--accent-soft)', color: 'var(--text)' }}
            >
              <p className="text-lg font-bold">Concluído!</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {wpm} PPM • {accuracy}% de precisão • {correct} acertos
              </p>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
