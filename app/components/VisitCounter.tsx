'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

export default function VisitCounter() {
  const [visits, setVisits] = useState<number>(0);
  const [todayVisits, setTodayVisits] = useState<number>(0);

  useEffect(() => {
    // Get stored data
    const storedVisits = localStorage.getItem('site_visits');
    const storedDate = localStorage.getItem('visit_date');
    const storedTodayVisits = localStorage.getItem('today_visits');

    const today = new Date().toDateString();
    const totalVisits = storedVisits ? parseInt(storedVisits, 10) : 0;
    const dailyVisits = storedDate === today ? (storedTodayVisits ? parseInt(storedTodayVisits, 10) : 0) : 0;

    // Increment counters
    const newTotal = totalVisits + 1;
    const newToday = storedDate === today ? dailyVisits + 1 : 1;

    // Store updated values
    localStorage.setItem('site_visits', newTotal.toString());
    localStorage.setItem('visit_date', today);
    localStorage.setItem('today_visits', newToday.toString());

    setVisits(newTotal);
    setTodayVisits(newToday);
  }, []);

  return (
    <div
      className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm"
      style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
    >
      <Eye className="h-4 w-4" style={{ color: 'var(--accent)' }} />
      <span className="font-medium" style={{ color: 'var(--text)' }}>
        {visits.toLocaleString('pt-BR')}
      </span>
      <span className="text-xs">
        ({todayVisits} hoje)
      </span>
    </div>
  );
}
