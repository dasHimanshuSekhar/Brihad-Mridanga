'use client';

import { useState, useEffect } from 'react';
import { Feather, Pen, Quote, Glasses, Coffee, Bookmark, BookCopy, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const icons = [Feather, Pen, Quote, Glasses, Coffee, Bookmark, BookCopy, Lightbulb];
const gameIcons = [...icons, ...icons];

const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const generateCards = () => shuffleArray([...gameIcons]).map((Icon, index) => ({ id: index, Icon, isFlipped: false, isMatched: false }));

export function EmbeddedGame() {
  const [cards, setCards] = useState(generateCards());
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    resetGame();
  }, []);


  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.Icon === secondCard.Icon) {
        setCards(prev => prev.map(card => (card.Icon === firstCard.Icon ? { ...card, isMatched: true } : card)));
        setFlippedIndices([]);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((card, index) => (index === firstIndex || index === secondIndex ? { ...card, isFlipped: false } : card)));
          setFlippedIndices([]);
        }, 1000);
      }
      setMoves(moves + 1);
    }
  }, [flippedIndices, cards, moves]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length < 2 && !cards[index].isFlipped) {
      setCards(prev => prev.map((card, i) => (i === index ? { ...card, isFlipped: true } : card)));
      setFlippedIndices(prev => [...prev, index]);
    }
  };
  
  const resetGame = () => {
    setCards(generateCards());
    setFlippedIndices([]);
    setMoves(0);
  };

  const isGameWon = cards.every(card => card.isMatched);

  if (!isClient) {
    return null; // Or a placeholder/skeleton loader
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="font-semibold">Moves: <span className="text-accent">{moves}</span></p>
          <Button variant="outline" onClick={resetGame}>Reset Game</Button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card, index) => {
            const Icon = card.Icon;
            return (
              <div key={index} className="aspect-square" onClick={() => !card.isMatched && handleCardClick(index)}>
                <div className={cn(
                  'w-full h-full rounded-md flex items-center justify-center cursor-pointer transition-transform duration-500',
                  'transform-style-3d',
                  card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
                )}>
                  <div className={cn(
                    'absolute w-full h-full flex items-center justify-center rounded-md backface-hidden',
                    'bg-muted'
                  )} />
                  <div className={cn(
                    'absolute w-full h-full flex items-center justify-center rounded-md backface-hidden rotate-y-180',
                    'bg-accent/20',
                    card.isMatched ? 'border-2 border-accent' : ''
                  )}>
                    <Icon className="w-1/2 h-1/2 text-accent" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {isGameWon && (
            <div className="text-center mt-6">
                <h3 className="text-2xl font-headline text-accent">Congratulations!</h3>
                <p>You completed the game in {moves} moves.</p>
            </div>
        )}
        <style jsx>{`
            .transform-style-3d { transform-style: preserve-3d; }
            .rotate-y-180 { transform: rotateY(180deg); }
            .backface-hidden { backface-visibility: hidden; }
        `}</style>
      </CardContent>
    </Card>
  );
}
