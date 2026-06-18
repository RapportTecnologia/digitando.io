'use client';

import { useState } from 'react';
import { useSession } from './context/SessionContext';
import LoginModal from './components/LoginModal';
import TopBar from './components/TopBar';
import PhaseSelector from './components/PhaseSelector';
import TypingGame from './components/TypingGame';
import FreePractice from './components/FreePractice';
import { getPhase } from './lib/curriculum';

type View = { type: 'map' } | { type: 'phase'; id: number };

export default function Home() {
  const { isAuthenticated, hydrated, progress, updateProgress } = useSession();
  const [view, setView] = useState<View>({ type: 'map' });

  if (!hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center" style={{ color: 'var(--text-muted)' }}>
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginModal />;
  }

  const activePhase = view.type === 'phase' ? getPhase(view.id) : undefined;

  const handleRoundComplete = (
    phaseId: number,
    result: { accuracy: number; wpm: number; stars: number; passed: boolean; points: number }
  ) => {
    const phase = getPhase(phaseId);
    if (!phase) return;

    const prevScore = progress.scores[phaseId];
    const bestStars = Math.max(prevScore?.stars ?? 0, result.stars);
    const newScores = {
      ...progress.scores,
      [phaseId]: {
        accuracy: Math.max(prevScore?.accuracy ?? 0, result.accuracy),
        wpm: Math.max(prevScore?.wpm ?? 0, result.wpm),
        stars: bestStars,
      },
    };

    const completedPhases = result.passed && !progress.completedPhases.includes(phaseId)
      ? [...progress.completedPhases, phaseId]
      : progress.completedPhases;

    const highestUnlocked = result.passed
      ? Math.max(progress.highestUnlocked, phaseId + 1)
      : progress.highestUnlocked;

    updateProgress({
      scores: newScores,
      completedPhases,
      highestUnlocked,
      totalPoints: progress.totalPoints + result.points,
      currentPhase: phaseId,
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      <TopBar
        liveStats={null}
        onHome={view.type !== 'map' ? () => setView({ type: 'map' }) : undefined}
      />

      {view.type === 'map' && <PhaseSelector onSelect={(id) => setView({ type: 'phase', id })} />}

      {view.type === 'phase' && activePhase?.freePractice && (
        <FreePractice
          onExit={() => setView({ type: 'map' })}
          onPoints={(pts) => updateProgress({ totalPoints: progress.totalPoints + pts })}
        />
      )}

      {view.type === 'phase' && activePhase && !activePhase.freePractice && (
        <TypingGame
          key={activePhase.id}
          phase={activePhase}
          onExit={() => setView({ type: 'map' })}
          onRoundComplete={(result) => handleRoundComplete(activePhase.id, result)}
        />
      )}
    </div>
  );
}
