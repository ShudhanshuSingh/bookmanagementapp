'use client';

import { useState, useEffect, useCallback } from 'react';
import { GreetingData } from '@/types';

function getGreeting(hour: number): GreetingData {
  if (hour < 12) return { text: 'Good morning', icon: '🌅' };
  if (hour < 17) return { text: 'Good afternoon', icon: '☀️' };
  if (hour < 21) return { text: 'Good evening', icon: '🌆' };
  return { text: 'Good night', icon: '🌙' };
}

interface GreetingBannerProps {
  userName: string;
}

export default function GreetingBanner({ userName }: GreetingBannerProps) {
  const [greeting, setGreeting] = useState<GreetingData>(() =>
    getGreeting(new Date().getHours())
  );

  const updateGreeting = useCallback(() => {
    setGreeting(getGreeting(new Date().getHours()));
  }, []);

  useEffect(() => {
    const interval = setInterval(updateGreeting, 60_000);
    return () => clearInterval(interval);
  }, [updateGreeting]);

  return (
    <div className="flex items-center gap-2">
      <h1 className="text-2xl font-bold text-gray-900">
        {greeting.text}, {userName}
      </h1>
      <span className="text-2xl" role="img" aria-label={greeting.text}>
        {greeting.icon}
      </span>
    </div>
  );
}
