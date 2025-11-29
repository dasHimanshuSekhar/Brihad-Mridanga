
import placeholderData from './placeholder-images.json';
import type { ImagePlaceholder } from './placeholder-images';
import type { Timestamp } from 'firebase/firestore';

export type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
  imageId: string;
};

export const books: Book[] = [
  { id: '1', title: 'Bhagavad-gītā As It Is English (Big)', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 240.00, imageId: 'bgEngBig' },
  { id: '2', title: 'Bhagavad-gītā As It Is English (Small)', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 190.00, imageId: 'bgEngSmall' },
  { id: '3', title: 'Bhagavad-gītā As It Is Odia (Big)', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 240.00, imageId: 'bgOdiaBig' },
  { id: '4', title: 'Bhagavad-gītā As It Is Hindi (Big)', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 200.00, imageId: 'bgHindiBig' },
  { id: '5', title: 'Bhagavad-gītā As It Is Hindi (Small)', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 180.00, imageId: 'bgHindiSmall' },
  { id: '6', title: 'Krishna (The Supreme Personality of Godhead)-English', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 250.00, imageId: 'krsnaEngBig' },
  { id: '7', title: 'Krishna (The Supreme Personality of Godhead)-Hindi', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 230.00, imageId: 'krsnaHindiBig' },
  { id: '8', title: 'Krishna (The Supreme Personality of Godhead)-Odia', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 250.00, imageId: 'krsnaOdiaBig' }
];


export type OrderItem = {
  bookId: string;
  quantity: number;
};

export type Order = {
  id: string;
  name: string;
  address: string;
  mobile: string;
  email: string;
  referralCode?: string;
  items: OrderItem[];
  totalAmount: number;
  timestamp: Date | Timestamp;
  status: 'New' | 'Shipped' | 'Delivered' | 'Cancelled';
};

// This acts as our "database". In a real app, this would be a DB call.
// We add some mock orders to populate the leaderboard and referral data.
export let orders: Order[] = [];


export const placeholderImages: ImagePlaceholder[] = placeholderData.placeholderImages;

export const placeholderImageMap = new Map<string, ImagePlaceholder>(
  placeholderImages.map(img => [img.id, img])
);

export const booksMap = new Map<string, Book>(
  books.map(book => [book.id, book])
);
