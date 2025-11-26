'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getReferralData } from '@/app/actions';
import { ReferralProgress } from './referral-progress';

type ReferralResult = {
  mobile: string;
  totalBooks: number;
  currentMilestone: { threshold: number, name: string } | null;
  nextMilestone: { threshold: number, name: string } | null;
} | { error: string };


export function ReferralChecker() {
  const [mobile, setMobile] = useState('');
  const [result, setResult] = useState<ReferralResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCheck = () => {
    startTransition(async () => {
      const data = await getReferralData(mobile);
      setResult(data);
    });
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="tel"
            placeholder="Enter your 10-digit mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="text-base"
          />
          <Button onClick={handleCheck} disabled={isPending} className="sm:w-48 bg-accent text-accent-foreground hover:bg-accent/90">
            {isPending ? 'Checking...' : 'Check Progress'}
          </Button>
        </div>
        
        {result && (
          <div className="mt-8">
            {'error' in result ? (
              <p className="text-destructive text-center">{result.error}</p>
            ) : (
              <ReferralProgress data={result} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
