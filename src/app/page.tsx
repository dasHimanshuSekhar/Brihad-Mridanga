
import { Suspense } from "react";
import { Header } from "@/app/components/header";
import { Hero } from "@/app/components/hero";
import { OrderClientWrapper } from "@/app/components/order-client-wrapper";
import { ReferralChecker } from "@/app/components/referral-checker";
import { Leaderboard } from "@/app/components/leaderboard";
import { EmbeddedGame } from "@/app/components/embedded-game";
import { Footer } from "@/app/components/footer";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

function LeaderboardSkeleton() {
  return (
    <div className="max-w-2xl mx-auto">
       <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background font-body">
      <Header />
      <main className="flex-1">
        <Hero />
        
        <section id="order" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-headline text-center mb-4">Order Your Spiritual Books</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">Select your books from our curated collection and place your order. Don't forget to add a referral code if you have one!</p>
            <OrderClientWrapper />
          </div>
        </section>
        
        <section id="referral" className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-headline text-center mb-4">Referral Rewards</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">Check your referral progress and see how close you are to earning spiritual gifts. Enter your mobile number to begin.</p>
            <ReferralChecker />
          </div>
        </section>

        <section id="leaderboard" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-headline text-center mb-4">Public Leaderboard</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">See our top readers and referrers. Your next purchase could land you on this list!</p>
            <Suspense fallback={<LeaderboardSkeleton />}>
              <Leaderboard />
            </Suspense>
          </div>
        </section>

        <section id="game" className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-headline text-center mb-4">A Literary Diversion</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">Take a short break with our book-themed memory game while you ponder your next read.</p>
            <EmbeddedGame />
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
