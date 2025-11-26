import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { placeholderImageMap } from '@/lib/data';
import type { Book } from '@/lib/data';
import { ShoppingCart } from 'lucide-react';

type BookCardProps = {
  book: Book;
  addToCart: (book: Book) => void;
};

export function BookCard({ book, addToCart }: BookCardProps) {
  const image = placeholderImageMap.get(book.imageId);

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        {image && (
          <div className="aspect-[2/3] relative w-full">
            <Image
              src={image.imageUrl}
              alt={`Cover of ${book.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              data-ai-hint={image.imageHint}
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <CardTitle className="font-headline text-lg leading-snug">{book.title}</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="font-semibold text-lg">${book.price.toFixed(2)}</p>
        <Button size="sm" onClick={() => addToCart(book)}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}
