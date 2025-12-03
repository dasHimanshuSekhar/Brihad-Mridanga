export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
        <div>
          <span className="font-bold font-headline text-lg text-foreground">BrihadMridanga</span>
        </div>
        <p className="text-sm text-muted-foreground mt-4 sm:mt-0">
          © {new Date().getFullYear()} BrihadMridanga. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
