'use client';

import { useEffect, useState } from 'react';
import { Gift, Star } from 'lucide-react';

type ReferralData = {
  mobile: string;
  totalBooks: number;
  currentMilestone: { threshold: number; name: string } | null;
  nextMilestone: { threshold: number; name: string } | null;
};

type ReferralProgressProps = {
  data: ReferralData;
};

const milestones = [
  { threshold: 20, name: 'Spiritual Gift 1' },
  { threshold: 50, name: 'Spiritual Gift 2' },
  { threshold: 100, name: 'Spiritual Gift 3' },
];

export function ReferralProgress({ data }: ReferralProgressProps) {
  const { totalBooks, currentMilestone, nextMilestone } = data;
  const [progress, setProgress] = useState(0);

  const maxThreshold = milestones[milestones.length - 1].threshold;
  
  useEffect(() => {
    // Animate progress bar on load
    const targetProgress = Math.min((totalBooks / (nextMilestone?.threshold || maxThreshold)) * 100, 100);
    const timeout = setTimeout(() => setProgress(targetProgress), 100);
    return () => clearTimeout(timeout);
  }, [totalBooks, nextMilestone, maxThreshold]);

  return (
    <div className="text-center">
      <h3 className="text-2xl font-headline">Your Progress</h3>
      <p className="text-5xl font-bold font-headline text-accent my-2">{totalBooks}</p>
      <p className="text-muted-foreground">Total books from you and your referrals</p>

      <div className="my-8">
        <div className="relative pt-8">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {milestones.map(ms => {
            const isAchieved = totalBooks >= ms.threshold;
            const position = (ms.threshold / maxThreshold) * 100;
            return (
              <div
                key={ms.name}
                className="absolute top-0 flex flex-col items-center"
                style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                    isAchieved ? 'bg-accent text-accent-foreground border-accent' : 'bg-background border-muted-foreground'
                  }`}
                >
                  {isAchieved ? <Star className="w-5 h-5" /> : <Gift className="w-5 h-5" />}
                </div>
                <p className="text-xs font-semibold mt-2">{ms.threshold}</p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">{ms.name}</p>
              </div>
            );
          })}
        </div>
      </div>
      
      {currentMilestone && <p>Congratulations! You've unlocked: <span className="font-bold text-accent">{currentMilestone.name}</span>.</p>}
      {nextMilestone && <p>Your next reward is <span className="font-bold text-accent">{nextMilestone.name}</span> at {nextMilestone.threshold} books.</p>}
      {!nextMilestone && totalBooks >= maxThreshold && <p className="font-bold text-accent">You've unlocked all rewards! Amazing!</p>}
    </div>
  );
}
