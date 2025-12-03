"use server";

import { z } from "zod";
import { books, booksMap } from "@/lib/data";
import type { Order } from "@/lib/data";
import { revalidatePath } from "next/cache";

// ✅ admin SDK (server-only)
import { adminDb } from "@/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";

// --- Firestore helpers (admin SDK) ---

async function getOrdersFromDB(): Promise<Order[]> {
  try {
    const snapshot = await adminDb.collection("orders").get();

    const orderList: Order[] = snapshot.docs.map((doc) => {
      const data = doc.data() as any;
      const ts = data.timestamp as FirebaseFirestore.Timestamp | undefined;

      return {
        id: doc.id,
        ...data,
        timestamp: ts ? ts.toDate() : new Date(),
      } as Order;
    });

    return orderList;
  } catch (err: any) {
    console.error("🔥 Firestore getOrdersFromDB error:", err);

    // If Firestore DB itself is not created / NOT_FOUND, treat as "no orders"
    // Firebase error code 5 is NOT_FOUND
    const isNotFound = 
      err?.code === 5 || 
      err?.code === "NOT_FOUND" ||
      err?.message?.includes("NOT_FOUND") ||
      err?.details?.includes?.("Database not found");

    if (isNotFound) {
      console.warn("⚠️ Firestore database not found, returning empty orders list");
      return [];
    }

    throw err;
  }
}

// --- Referral & Leaderboard Logic ---

async function calculateScores(): Promise<Map<string, number>> {
  const orders = await getOrdersFromDB();
  const scores = new Map<string, number>();

  orders.forEach((order) => {
    // Skip cancelled orders and invalid orders
    if (order.status === "Cancelled" || !order.items || !Array.isArray(order.items)) return;

    // Safely calculate book count
    const bookCount = order.items.reduce((sum, item) => {
      const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
      return sum + Math.max(0, quantity); // Ensure non-negative
    }, 0);

    // Only add valid scores
    if (bookCount > 0) {
      scores.set(order.mobile, (scores.get(order.mobile) || 0) + bookCount);

      if (order.referralCode) {
        scores.set(
          order.referralCode,
          (scores.get(order.referralCode) || 0) + bookCount
        );
      }
    }
  });

  return scores;
}

export async function getReferralData(mobile: string) {
  if (!/^\d{10}$/.test(mobile)) {
    return { error: "Please enter a valid 10-digit mobile number." };
  }

  const scores = await calculateScores();
  const totalBooks = scores.get(mobile) || 0;

  const milestones = [
    { threshold: 20, name: "Spiritual Gift 1" },
    { threshold: 50, name: "Spiritual Gift 2" },
    { threshold: 100, name: "Spiritual Gift 3" },
  ];

  let currentMilestone: (typeof milestones)[number] | null = null;
  let nextMilestone: (typeof milestones)[number] | null = milestones[0];

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
    .slice(0, 10);

  return sortedScores.map(([mobile, totalBooks], index) => ({
    rank: index + 1,
    mobile: `******${mobile.slice(6)}`,
    totalBooks: Math.max(0, totalBooks || 0), // Ensure always a valid number
  }));
}

// --- Order Placement Logic ---

const orderItemSchema = z.object({
  bookId: z.string().min(1),
  quantity: z.number().int().min(1),
});

const orderSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  address: z
    .string()
    .min(10, { message: "Please enter a valid address." }),
  mobile: z
    .string()
    .regex(/^\d{10}$/, {
      message: "Please enter a valid 10-digit mobile number.",
    }),
  email: z
    .string()
    .email({ message: "Please enter a valid email." }),
  referralCode: z
    .string()
    .regex(/^\d{10}$/, {
      message: "Referral code must be a 10-digit mobile number.",
    })
    .optional()
    .or(z.literal("")),
  items: z
    .array(orderItemSchema)
    .min(1, { message: "Your cart is empty." }),
});

export async function placeOrder(data: unknown) {
  const validationResult = orderSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { items, ...customerData } = validationResult.data;

  const totalAmount = items.reduce((total, item) => {
    const book = booksMap.get(item.bookId);
    return total + (book ? book.price * item.quantity : 0);
  }, 0);

  if (totalAmount <= 0) {
    return {
      success: false,
      message: "Invalid order total. Please check your cart.",
    };
  }

  const newOrderData = {
    ...customerData,
    items,
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    timestamp: Timestamp.now(),
    status: "New" as const,
  };

  try {
    await adminDb.collection("orders").add(newOrderData);

    revalidatePath("/");
    revalidatePath("/admin");

    return {
      success: true,
      message:
        "Order placed successfully! Thank you for your purchase.",
    };
  } catch (error: any) {
    console.error("Error placing order: ", error);

    // If Firestore DB doesn't exist, provide helpful message
    const isNotFound = 
      error?.code === 5 || 
      error?.code === "NOT_FOUND" ||
      error?.message?.includes("NOT_FOUND");

    if (isNotFound) {
      return {
        success: false,
        message: "The order system is not yet initialized. Please try again later.",
      };
    }

    return {
      success: false,
      message: "Could not place order. Please try again.",
    };
  }
}
