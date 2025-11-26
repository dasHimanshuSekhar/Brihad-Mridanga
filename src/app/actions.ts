"use server";

import { z } from 'zod';
import { books, orders, booksMap } from '@/lib/data';
import type { Order, OrderItem } from '@/lib/data';
import { revalidatePath } from 'next/cache';

// --- Referral & Leaderboard Logic ---

function calculateScores(): Map<string, number> {
  const scores = new Map<string, number>();

  orders.forEach(order => {
    const bookCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

    // Add to purchaser's score
    scores.set(order.mobile, (scores.get(order.mobile) || 0) + bookCount);

    // Add to referrer's score
    if (order.referralCode) {
      scores.set(order.referralCode, (scores.get(order.referralCode) || 0) + bookCount);
    }
  });

  return scores;
}

export async function getReferralData(mobile: string) {
  if (!/^\d{10}$/.test(mobile)) {
    return { error: 'Please enter a valid 10-digit mobile number.' };
  }
  
  const scores = calculateScores();
  const totalBooks = scores.get(mobile) || 0;

  const milestones = [
    { threshold: 20, name: 'Spiritual Gift 1' },
    { threshold: 50, name: 'Spiritual Gift 2' },
    { threshold: 100, name: 'Spiritual Gift 3' },
  ];

  let currentMilestone = null;
  let nextMilestone = milestones[0];

  for (let i = milestones.length - 1; i >= 0; i--) {
    if (totalBooks >= milestones[i].threshold) {
      currentMilestone = milestones[i];
      nextMilestone = milestones[i + 1] || null;
      break;
    }
    nextMilestone = milestones[i];
  }

  return {
    mobile,
    totalBooks,
    currentMilestone,
    nextMilestone,
  };
}

export async function getLeaderboardData() {
  const scores = calculateScores();
  const sortedScores = Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // Top 10

  return sortedScores.map(([mobile, totalBooks], index) => ({
    rank: index + 1,
    mobile: `******${mobile.slice(6)}`, // Anonymize mobile number
    totalBooks,
  }));
}


// --- Order Placement Logic ---

const orderItemSchema = z.object({
  bookId: z.string().min(1),
  quantity: z.number().int().min(1),
});

const orderSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  address: z.string().min(10, { message: "Please enter a valid address." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  referralCode: z.string().regex(/^\d{10}$/, { message: "Referral code must be a 10-digit mobile number." }).optional().or(z.literal('')),
  items: z.array(orderItemSchema).min(1, { message: "Your cart is empty." }),
});


export async function placeOrder(data: unknown) {
  const validationResult = orderSchema.safeParse(data);

  if (!validationResult.success) {
    return { success: false, errors: validationResult.error.flatten().fieldErrors };
  }

  const { items, ...customerData } = validationResult.data;

  const totalAmount = items.reduce((total, item) => {
    const book = booksMap.get(item.bookId);
    return total + (book ? book.price * item.quantity : 0);
  }, 0);

  if (totalAmount <= 0) {
    return { success: false, message: 'Invalid order total. Please check your cart.' };
  }

  const newOrder: Order = {
    id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ...customerData,
    items,
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    timestamp: new Date(),
  };

  // In a real app, you would save this to a database.
  // Here we are just pushing it to an in-memory array.
  orders.push(newOrder);

  revalidatePath('/'); // To update leaderboard and referral data on the page

  return { success: true, orderId: newOrder.id, message: "Order placed successfully! Thank you for your purchase." };
}
