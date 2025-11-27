import placeholderData from './placeholder-images.json';
import type { ImagePlaceholder } from './placeholder-images';

export type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
  imageId: string;
};

export const books: Book[] = [
  { id: '1', title: 'Bhagavad-gītā As It Is English (Big)', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 15.00, imageId: 'bgEngBig' },
  { id: '2', title: 'Bhagavad-gītā As It Is English (Small)', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 25.00, imageId: 'bgEngBig' },
  { id: '3', title: 'Bhagavad-gītā As It Is Odia (Big)', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 30.00, imageId: 'bgEngBig' },
  { id: '4', title: 'Bhagavad-gītā As It Is Hindi (Big)', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 10.00, imageId: 'bgEngBig' },
  { id: '5', title: 'Bhagavad-gītā As It Is Hindi (Small)', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 8.00, imageId: 'bgEngBig' },
  { id: '6', title: 'Krishna (The Supreme Personality of Godhead)-English', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 7.00, imageId: 'krsnaEngBig' },
  { id: '7', title: 'Krishna (The Supreme Personality of Godhead)-Hindi', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 20.00, imageId: 'krsnaEngBig' },
  { id: '8', title: 'Krishna (The Supreme Personality of Godhead)-Odia', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 9.00, imageId: 'krsnaEngBig' },
  { id: '9', title: 'Bhagavad-gītā As It Is Bengali', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 6.00, imageId: 'bgEngBig' }
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
  timestamp: Date;
  status: 'New' | 'Shipped' | 'Delivered' | 'Cancelled';
};

// This acts as our "database". In a real app, this would be a DB call.
// We add some mock orders to populate the leaderboard and referral data.
export let orders: Order[] = [
    { id: 'ord1', name: 'Alice', address: '123 Main St', mobile: '1112223333', email: 'alice@example.com', items: [{ bookId: '1', quantity: 2 }, { bookId: '2', quantity: 3 }], totalAmount: 70.95, timestamp: new Date('2024-01-10'), status: 'New' },
    { id: 'ord2', name: 'Bob', address: '456 Oak Ave', mobile: '4445556666', email: 'bob@example.com', referralCode: '1112223333', items: [{ bookId: '3', quantity: 5 }], totalAmount: 54.95, timestamp: new Date('2024-01-12'), status: 'Shipped' },
    { id: 'ord3', name: 'Charlie', address: '789 Pine Ln', mobile: '7778889999', email: 'charlie@example.com', items: [{ bookId: '1', quantity: 18 }], totalAmount: 233.82, timestamp: new Date('2024-01-15'), status: 'Delivered' },
    { id: 'ord4', name: 'Diana', address: '101 Maple Rd', mobile: '1011021033', email: 'diana@example.com', referralCode: '7778889999', items: [{ bookId: '5', quantity: 25 }], totalAmount: 449.75, timestamp: new Date('2024-02-01'), status: 'New' },
    { id: 'ord5', name: 'Eve', address: '212 Birch Ct', mobile: '2122132144', email: 'eve@example.com', referralCode: '7778889999', items: [{ bookId: '6', quantity: 30 }], totalAmount: 449.70, timestamp: new Date('2024-02-05'), status: 'New' },
    { id: 'ord6', name: 'Frank', address: '333 Elm St', mobile: '3334445555', email: 'frank@example.com', referralCode: '7778889999', items: [{ bookId: '7', quantity: 50 }], totalAmount: 449.50, timestamp: new Date('2024-02-10'), status: 'Cancelled' },
];

export const placeholderImages: ImagePlaceholder[] = placeholderData.placeholderImages;

export const placeholderImageMap = new Map<string, ImagePlaceholder>(
  placeholderImages.map(img => [img.id, img])
);

export const booksMap = new Map<string, Book>(
  books.map(book => [book.id, book])
);
