'use client';

import React, { useState } from 'react';
import { Palette, LogOut, Trophy, Target, Gauge, Home } from 'lucide-react';
import { useSession } from '@/app/context/SessionContext';
import { THEMES } from '@/app/lib/themes';
import VisitCounter from './VisitCounter';

interface TopBarProps {
  liveStats?: { wpm: number; accuracy: number } | null;
  onHome?: () => void;
}

export default function TopBar({ liveStats, onHome }: TopBarProps) {
  const { user, progress, logout, setTheme } = useSession();
  const [showThemes, setShowThemes] = useState(false);

  return (
    <header
      className="flex items-center justify-between px-6 py-3 border-b"
      style={{ background: 'var(--surface)', borderColor: 'var(--key-border)' }}
    >
      {/* Left: user name */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-white font-bold"
          style={{ background: 'var(--accent)' }}
        >
          {user?.name?.charAt(0).toUpperCase() ?? '?'}
        </div>
        <div>
          <p className="font-semibold leading-tight" style={{ color: 'var(--text)' }}>
            {user?.name}
          </p>
          <p className="text-xs leading-tight" style={{ color: 'var(--text-muted)' }}>
            {user?.email}
          </p>
        </div>
      </div>

      {/* Center: live stats */}
      {liveStats && (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4" style={{ color: 'var(--accent)' }} />
            <span className="font-semibold" style={{ color: 'var(--text)' }}>
              {liveStats.wpm} <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>PPM</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" style={{ color: 'var(--accent)' }} />
            <span className="font-semibold" style={{ color: 'var(--text)' }}>
              {liveStats.accuracy}%
            </span>
          </div>
        </div>
      )}

      {/* Right: score, visit counter, theme, logout */}
      <div className="flex items-center gap-3">
        <VisitCounter />
        <div
          className="flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{ background: 'var(--accent-soft)' }}
        >
          <Trophy className="h-4 w-4" style={{ color: 'var(--accent)' }} />
          <span className="font-bold" style={{ color: 'var(--text)' }}>
            {progress.totalPoints.toLocaleString('pt-BR')}
          </span>
        </div>

        {onHome && (
          <button
            onClick={onHome}
            title="Voltar ao início"
            className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:opacity-80"
            style={{ background: 'var(--surface-2)', color: 'var(--text)' }}
          >
            <Home className="h-4 w-4" />
          </button>
        )}

        <div className="relative">
          <button
            onClick={() => setShowThemes((s) => !s)}
            title="Mudar cores"
            className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:opacity-80"
            style={{ background: 'var(--surface-2)', color: 'var(--text)' }}
          >
            <Palette className="h-4 w-4" />
          </button>
          {showThemes && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowThemes(false)} />
              <div
                className="absolute right-0 top-11 z-40 w-44 rounded-xl border p-2 shadow-xl"
                style={{ background: 'var(--surface)', borderColor: 'var(--key-border)' }}
              >
                <p className="px-2 py-1 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                  Esquema de cores
                </p>
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setShowThemes(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm transition hover:opacity-80"
                    style={{
                      background: progress.theme === t.id ? 'var(--accent-soft)' : 'transparent',
                      color: 'var(--text)',
                    }}
                  >
                    <span>{t.name}</span>
                    <span className="flex gap-1">
                      <span
                        className="h-4 w-4 rounded-full border"
                        style={{ background: t.vars['--bg'], borderColor: 'var(--key-border)' }}
                      />
                      <span
                        className="h-4 w-4 rounded-full"
                        style={{ background: t.vars['--accent'] }}
                      />
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={logout}
          title="Sair"
          className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:opacity-80"
          style={{ background: 'var(--surface-2)', color: 'var(--text)' }}
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
