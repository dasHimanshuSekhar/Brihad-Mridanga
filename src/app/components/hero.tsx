import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { placeholderImageMap } from '@/lib/data';

export function Hero() {
  const heroImage = placeholderImageMap.get('book5');

  return (
    <section className="relative w-full h-[60dvh] md:h-[70dvh] text-center flex flex-col justify-center items-center px-4">
       <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
       {heroImage && (
        <Image
            src={heroImage.imageUrl}
            alt="A beautiful book arrangement"
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
        />
       )}
      <div className="relative z-20 max-w-4xl">
        <h1 className="text-4xl font-extrabold tracking-tight font-headline md:text-6xl lg:text-7xl">
          Where Every Page Turned is a Reward Earned
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-foreground/80 md:text-xl">
          Welcome to BiblioBoost, the unique book-buying experience that rewards your love for reading. Purchase books, refer friends, and unlock spiritual gifts on your literary journey.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="#order">Start Your Journey</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
