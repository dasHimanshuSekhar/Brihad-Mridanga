import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { placeholderImageMap } from '@/lib/data';

export function Hero() {
  const heroImage = placeholderImageMap.get('book1');

  return (
    <section className="relative w-full h-[60dvh] md:h-[70dvh] text-center flex flex-col justify-center items-center px-4">
       <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
       {heroImage && (
        <Image
            src={heroImage.imageUrl}
            alt="Bhagavad-gītā As It Is"
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
        />
       )}
      <div className="relative z-20 max-w-4xl">
        <h1 className="text-4xl font-extrabold tracking-tight font-headline md:text-6xl lg:text-7xl">
          Timeless Wisdom for the Modern Age
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-foreground/80 md:text-xl">
          Discover the profound teachings of the Vedas. Purchase authentic translations and commentaries by A.C. Bhaktivedanta Swami Prabhupāda, and embark on a journey of self-realization.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="#order">Explore the Collection</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
