
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { AdminDashboard } from "./components/admin-dashboard";
import { logout } from "@/lib/session";
import { getUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { adminDb } from '@/firebase/admin';
import type { Order } from '@/lib/data';


async function getOrders(): Promise<Order[]> {
  try {
    const snapshot = await adminDb
      .collection('orders')
      .orderBy('timestamp', 'desc')
      .get();
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      const timestamp = data.timestamp;
      return {
        id: doc.id,
        ...data,
        timestamp: timestamp?.toDate ? timestamp.toDate() : new Date(),
      } as Order;
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
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
