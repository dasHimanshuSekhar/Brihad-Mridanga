'use server';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { orders } from '@/lib/data';
import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET_KEY || 'a-very-secret-key-that-is-long-enough';
const key = new TextEncoder().encode(secretKey);

const loginSchema = z.object({
    userId: z.string(),
    password: z.string(),
});

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (e) {
    return null;
  }
}

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

export async function logout() {
    cookies().set('session', '', { expires: new Date(0) });
    redirect('/admin/login');
}

export async function getUser() {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) return null;
    const session = await decrypt(sessionCookie);
    return session?.user;
}


// --- Shiprocket Action ---
export async function forwardToShiprocket(orderId: string) {
  // Find the order
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return { success: false, message: 'Order not found.' };
  }

  if (order.status !== 'New') {
    return { success: false, message: `Order status is already '${order.status}'.` };
  }

  // In a real app, you would make an API call to Shiprocket here
  // with the order details.
  console.log('Forwarding order to Shiprocket:', order);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Update the order status in our "database"
  order.status = 'Shipped';
  
  revalidatePath('/admin');

  return { success: true, message: `Order ${orderId} has been forwarded to Shiprocket and status updated to 'Shipped'.` };
}
