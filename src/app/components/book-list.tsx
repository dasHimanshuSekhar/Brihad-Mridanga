import { books } from '@/lib/data';
import type { Book } from '@/lib/data';
import { BookCard } from '@/app/components/book-card';

type BookListProps = {
  addToCart: (book: Book) => void;
};

export function BookList({ addToCart }: BookListProps) {
  return (
    <div>
      <h3 className="text-2xl font-headline mb-6">Our Collection</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map(book => (
          <BookCard key={book.id} book={book} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
}
