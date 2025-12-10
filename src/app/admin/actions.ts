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

type LoginPrevState = { error?: string };

export async function login(prevState: LoginPrevState, formData: FormData) {
  // validate form data
  const validatedFields = loginSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    return { error: 'Invalid fields provided.' };
  }

  const { userId, password } = validatedFields.data;

  // Hardcoded credentials (as requested)
  if (userId === 'admin' && password === 'password') {
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    const session = await encrypt({ user: { id: userId, name: 'Admin' }, expires });

    // Workaround TS complaining about cookies() returned type:
    // cast to any so we can call set() without TS error
    const cookieStore: any = cookies();
    cookieStore.set('session', session, {
      expires,
      httpOnly: true,
      path: '/', // recommended for session cookies
      sameSite: 'lax',
    });

    // redirect to admin page
    redirect('/admin');

    // Note: redirect will terminate request, but this return is here for type-safety.
    return { error: undefined };
  } else {
    return { error: 'Invalid User ID or Password.' };
  }
}

// --- Shiprocket Action ---
export async function forwardToShiprocket(orderId: string) {
  const orderRef = adminDb.collection('orders').doc(orderId);

  try {
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return { success: false, message: 'Order not found.' };
    }

    // orderSnap.data() may be undefined, guard against that
    const order = orderSnap.data() as Record<string, any> | undefined;
    if (!order) {
      return { success: false, message: 'Order data is empty.' };
    }

    // check status safely
    const status = order.status as string | undefined;
    if (!status) {
      return { success: false, message: 'Order status is missing.' };
    }

    if (status !== 'New') {
      return { success: false, message: `Order status is already '${status}'.` };
    }

    // (Placeholder) — call Shiprocket API here in real app
    console.log('Forwarding order to Shiprocket:', { id: orderId, ...order });

    // update Firestore doc
    await orderRef.update({
      status: 'Shipped',
      updatedAt: Timestamp.now(),
      updatedAtIST: istNow().ist,
    });

    // revalidate admin path
    try {
      revalidatePath('/admin');
    } catch (e) {
      // revalidatePath can throw in certain contexts; ignore safely
      console.warn('revalidatePath failed:', e);
    }

    return { success: true, message: `Order ${orderId} has been forwarded to Shiprocket and status updated to 'Shipped'.` };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, message: 'Failed to update order status.' };
  }
}
