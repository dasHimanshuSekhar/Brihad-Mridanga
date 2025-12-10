
'use server';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { adminDb } from '@/firebase/admin';
import { istNow } from '@/lib/time';
import { Timestamp } from 'firebase-admin/firestore';
import { encrypt } from '@/lib/session';


const loginSchema = z.object({
    userId: z.string(),
    password: z.string(),
});

export async function login(prevState: { error: string | undefined }, formData: FormData) {
    const validatedFields = loginSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { error: "Invalid fields provided." }
    }

    const { userId, password } = validatedFields.data;

    // Hardcoded credentials as requested
    if (userId === 'admin' && password === 'password') {
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        const session = await encrypt({ user: { id: userId, name: 'Admin' }, expires });
    
        cookies().set('session', session, { expires, httpOnly: true });

        // No need to return anything, redirect will be handled by middleware or page logic
    } else {
        return { error: 'Invalid User ID or Password.' }
    }
    redirect('/admin');
}


// --- Shiprocket Action ---
export async function forwardToShiprocket(orderId: string) {
  const orderRef = adminDb.collection('orders').doc(orderId);

  try {
    const orderSnap = await orderRef.get();
    if (!orderSnap.exists) {
        return { success: false, message: 'Order not found.' };
    }
    const order = orderSnap.data();
    
    if (order.status !== 'New') {
      return { success: false, message: `Order status is already '${order.status}'.` };
    }

    // In a real app, you would make an API call to Shiprocket here.
    console.log('Forwarding order to Shiprocket:', {id: orderId, ...order});
    
    await orderRef.update({
      status: 'Shipped',
      updatedAt: Timestamp.now(),
      updatedAtIST: istNow().ist,
    });
    
    revalidatePath('/admin');

    return { success: true, message: `Order ${orderId} has been forwarded to Shiprocket and status updated to 'Shipped'.` };

  } catch(error) {
    console.error("Error updating order status:", error);
    return { success: false, message: 'Failed to update order status.' };
  }
}
