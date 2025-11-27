
"use server";

import { z } from 'zod';
import { books, booksMap } from '@/lib/data';
import type { Order, OrderItem } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { initializeAdmin } from '@/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';


async function getOrdersFromDB(): Promise<Order[]> {
  const { firestore } = await initializeAdmin();
  const ordersCol = firestore.collection('orders');
  const orderSnapshot = await ordersCol.get();
  const orderList = orderSnapshot.docs.map(doc => {
    const data = doc.data();
    return { 
        id: doc.id,
        ...data,
        timestamp: (data.timestamp as Timestamp).toDate() // Convert Firestore Timestamp to JS Date
    } as Order;
  });
  return orderList;
}

// --- Referral & Leaderboard Logic ---

async function calculateScores(): Promise<Map<string, number>> {
  const orders = await getOrdersFromDB();
  const scores = new Map<string, number>();

  orders.forEach(order => {
    if (order.status === 'Cancelled') return; 
    const bookCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

    scores.set(order.mobile, (scores.get(order.mobile) || 0) + bookCount);

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
  
  const scores = await calculateScores();
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
  const scores = await calculateScores();
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

  const newOrderData = {
    ...customerData,
    items,
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    timestamp: Timestamp.now(),
    status: 'New' as const,
  };

  try {
    const { firestore } = await initializeAdmin();
    const docRef = await firestore.collection("orders").add(newOrderData);
    
    revalidatePath('/');
    revalidatePath('/admin');

    return { success: true, orderId: docRef.id, message: "Order placed successfully! Thank you for your purchase." };
  } catch (error) {
    console.error("Error placing order: ", error);
    return { success: false, message: "Could not place order. Please try again." };
  }
}
