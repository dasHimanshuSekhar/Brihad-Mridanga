import { BookHeart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center gap-2">
            <BookHeart className="h-5 w-5 text-accent" />
            <span className="font-bold font-headline text-lg text-foreground">BiblioBoost</span>
        </div>
        <p className="text-sm text-muted-foreground mt-4 sm:mt-0">
          © {new Date().getFullYear()} BiblioBoost. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
