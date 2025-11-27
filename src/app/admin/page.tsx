
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { AdminDashboard } from "./components/admin-dashboard";
import { logout } from "@/lib/session";
import { getUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { initializeFirebase } from '@/firebase';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import type { Order } from '@/lib/data';


async function getOrders(): Promise<Order[]> {
  const { firestore } = initializeFirebase();
  const ordersRef = collection(firestore, 'orders');
  const q = query(ordersRef, orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    // The timestamp from the client SDK is already a Date object when used on the server.
    // No need for .toDate()
    return {
      id: doc.id,
      ...data,
      timestamp: data.timestamp,
    } as Order;
  });
}


export default async function AdminPage() {
  const user = await getUser();
  if (!user) {
    redirect('/admin/login');
  }

  const orders = await getOrders();

  return (
    <div className="flex flex-col min-h-dvh bg-background font-body">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl md:text-5xl font-headline">Admin Dashboard</h1>
                <form action={logout}>
                    <Button type="submit" variant="outline">Logout</Button>
                </form>
            </div>
            <AdminDashboard initialOrders={orders} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
