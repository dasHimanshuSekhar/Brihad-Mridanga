import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6">
          <span className="font-bold font-headline text-xl text-foreground">Brihad Mridanga</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/#order" className="transition-colors hover:text-accent">Order</Link>
          <Link href="/#referral" className="transition-colors hover:text-accent">Rewards</Link>
          <Link href="/#leaderboard" className="transition-colors hover:text-accent">Leaderboard</Link>
          <Link href="/#game" className="transition-colors hover:text-accent">Game</Link>
          <Link href="/admin" className="transition-colors hover:text-accent">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
