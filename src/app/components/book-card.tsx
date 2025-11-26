import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { placeholderImageMap } from '@/lib/data';
import type { Book } from '@/lib/data';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type BookCardProps = {
  book: Book;
  addToCart: (book: Book) => void;
  updateQuantity: (bookId: string, newQuantity: number) => void;
  quantity: number;
};

export function BookCard({ book, addToCart, updateQuantity, quantity }: BookCardProps) {
  const image = placeholderImageMap.get(book.imageId);

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0 relative">
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
        {quantity === 0 ? (
          <Button size="sm" onClick={() => addToCart(book)}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(book.id, quantity - 1)}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-bold w-5 text-center">{quantity}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(book.id, quantity + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
