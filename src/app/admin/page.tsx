import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { AdminDashboard } from "./components/admin-dashboard";
import { getUser, logout } from "./actions";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { initializeAdmin } from '@/firebase/admin';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import type { Order } from '@/lib/data';
import { Timestamp } from "firebase/firestore";

async function getOrders(): Promise<Order[]> {
  const { firestore } = await initializeAdmin();
  const ordersRef = collection(firestore, 'orders');
  const q = query(ordersRef, orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    const timestamp = data.timestamp as Timestamp;
    return {
      id: doc.id,
      name: data.name,
      address: data.address,
      mobile: data.mobile,
      email: data.email,
      referralCode: data.referralCode,
      items: data.items,
      totalAmount: data.totalAmount,
      status: data.status,
      timestamp: timestamp.toDate(),
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
