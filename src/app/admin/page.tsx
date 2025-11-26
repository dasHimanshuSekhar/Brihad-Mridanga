import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { AdminDashboard } from "./components/admin-dashboard";
import { getUser, logout } from "./actions";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { orders } from "@/lib/data";

export default async function AdminPage() {
  const user = await getUser();
  if (!user) {
    redirect('/admin/login');
  }

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
