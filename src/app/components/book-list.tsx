'use client';

import { books } from '@/lib/data';
import type { Book } from '@/lib/data';
import { BookCard } from '@/app/components/book-card';
import type { CartItem } from './order-client-wrapper';

type BookListProps = {
  addToCart: (book: Book) => void;
  updateQuantity: (bookId: string, newQuantity: number) => void;
  cart: Map<string, CartItem>;
};

export function BookList({ addToCart, updateQuantity, cart }: BookListProps) {
  return (
    <div>
      <h3 className="text-2xl font-headline mb-6">Our Collection</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map(book => {
          const cartItem = cart.get(book.id);
          const quantity = cartItem ? cartItem.quantity : 0;
          return <BookCard key={book.id} book={book} addToCart={addToCart} updateQuantity={updateQuantity} quantity={quantity} />
        })}
      </div>
    </div>
  );
}
