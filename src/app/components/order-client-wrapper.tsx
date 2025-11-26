'use client';

import { useState } from 'react';
import { BookList } from '@/app/components/book-list';
import { CartView } from '@/app/components/cart-view';
import type { Book, OrderItem } from '@/lib/data';

export type CartItem = {
  book: Book;
  quantity: number;
};

export function OrderClientWrapper() {
  const [cart, setCart] = useState<Map<string, CartItem>>(new Map());

  const addToCart = (book: Book, quantity: number = 1) => {
    setCart(prevCart => {
      const newCart = new Map(prevCart);
      const existingItem = newCart.get(book.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        newCart.set(book.id, { book, quantity });
      }
      return newCart;
    });
  };

  const updateQuantity = (bookId: string, newQuantity: number) => {
    setCart(prevCart => {
      const newCart = new Map(prevCart);
      if (newQuantity <= 0) {
        newCart.delete(bookId);
      } else {
        const item = newCart.get(bookId);
        if (item) {
          item.quantity = newQuantity;
        } else if (newQuantity > 0) {
            // This case should not happen with the current UI flow, but as a safeguard:
            // If you can update quantity for a book not in cart, it should be added.
            // This would require finding the book details from a master list.
        }
      }
      return newCart;
    });
  };
  
  const clearCart = () => {
    setCart(new Map());
  }

  const cartItems: OrderItem[] = Array.from(cart.values()).map(item => ({
    bookId: item.book.id,
    quantity: item.quantity,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
      <div className="lg:col-span-2">
        <BookList addToCart={addToCart} updateQuantity={updateQuantity} cart={cart} />
      </div>
      <div className="lg:col-span-1 mt-12 lg:mt-0">
        <div className="sticky top-24">
          <CartView cart={cart} updateQuantity={updateQuantity} cartItemsForForm={cartItems} clearCart={clearCart} />
        </div>
      </div>
    </div>
  );
}
