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
  { id: '1', title: 'Bhagavad-gītā As It Is', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 15.00, imageId: 'book1' },
  { id: '2', title: 'Śrīmad-Bhāgavatam', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 25.00, imageId: 'book2' },
  { id: '3', title: 'Caitanya-caritāmṛta', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 30.00, imageId: 'book3' },
  { id: '4', title: 'The Nectar of Devotion', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 10.00, imageId: 'book4' },
  { id: '5', title: 'The Nectar of Instruction', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 8.00, imageId: 'book5' },
  { id: '6', title: 'Easy Journey to Other Planets', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 7.00, imageId: 'book6' },
  { id: '7', title: 'Kṛṣṇa, the Supreme Personality of Godhead', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 20.00, imageId: 'book7' },
  { id: '8', title: 'Perfect Questions, Perfect Answers', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 9.00, imageId: 'book8' },
  { id: '9', title: 'The Laws of Nature: An Infallible Justice', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 6.00, imageId: 'book9' },
  { id: '10', title: 'Chant and Be Happy', author: 'A.C. Bhaktivedanta Swami Prabhupāda', price: 5.00, imageId: 'book10' },
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
