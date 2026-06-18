'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { setCookie, getCookie } from 'cookies-next/client';
import { applyTheme } from '@/app/lib/themes';

export interface User {
  name: string;
  email: string;
}

export interface PhaseScore {
  accuracy: number;
  wpm: number;
  stars: number;
}

export interface UserProgress {
  currentPhase: number;
  highestUnlocked: number;
  completedPhases: number[];
  scores: Record<number, PhaseScore>;
  theme: string;
  totalPoints: number;
}

interface SessionContextType {
  user: User | null;
  progress: UserProgress;
  isAuthenticated: boolean;
  hydrated: boolean;
  login: (name: string, email: string) => void;
  logout: () => void;
  updateProgress: (updates: Partial<UserProgress>) => void;
  setTheme: (theme: string) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const DEFAULT_PROGRESS: UserProgress = {
  currentPhase: 1,
  highestUnlocked: 1,
  completedPhases: [],
  scores: {},
  theme: 'light',
  totalPoints: 0,
};

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

// Per-email progress key so different users on the same computer keep separate sessions.
// Cookie names cannot contain characters like '=', '+', '/', so we sanitize the email
// into a safe token instead of using raw base64.
function progressKey(email: string) {
  const safe = email
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '_');
  return `progress_${safe}`;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const loadProgressForUser = useCallback((u: User): UserProgress => {
    const stored = getCookie(progressKey(u.email));
    if (stored) {
      try {
        return { ...DEFAULT_PROGRESS, ...JSON.parse(stored as string) };
      } catch {
        return DEFAULT_PROGRESS;
      }
    }
    return DEFAULT_PROGRESS;
  }, []);

  useEffect(() => {
    const storedUser = getCookie('current_user');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser as string);
        const userProgress = loadProgressForUser(parsedUser);
        setUser(parsedUser);
        setProgress(userProgress);
        setIsAuthenticated(true);
        applyTheme(userProgress.theme);
      } catch {
        /* ignore */
      }
    } else {
      applyTheme('light');
    }
    setHydrated(true);
  }, [loadProgressForUser]);

  const persistProgress = useCallback((email: string, p: UserProgress) => {
    setCookie(progressKey(email), JSON.stringify(p), { maxAge: COOKIE_MAX_AGE });
  }, []);

  const login = useCallback(
    (name: string, email: string) => {
      const userData: User = { name: name.trim(), email: email.trim() };
      const userProgress = loadProgressForUser(userData);
      // keep latest name
      setUser(userData);
      setProgress(userProgress);
      setIsAuthenticated(true);
      setCookie('current_user', JSON.stringify(userData), { maxAge: COOKIE_MAX_AGE });
      persistProgress(userData.email, userProgress);
      applyTheme(userProgress.theme);
    },
    [loadProgressForUser, persistProgress]
  );

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setProgress(DEFAULT_PROGRESS);
    setCookie('current_user', '', { maxAge: 0 });
    applyTheme('light');
  }, []);

  const updateProgress = useCallback(
    (updates: Partial<UserProgress>) => {
      setProgress((prev) => {
        const next = { ...prev, ...updates };
        if (user) persistProgress(user.email, next);
        return next;
      });
    },
    [user, persistProgress]
  );

  const setTheme = useCallback(
    (theme: string) => {
      applyTheme(theme);
      updateProgress({ theme });
    },
    [updateProgress]
  );

  return (
    <SessionContext.Provider
      value={{ user, progress, isAuthenticated, hydrated, login, logout, updateProgress, setTheme }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
