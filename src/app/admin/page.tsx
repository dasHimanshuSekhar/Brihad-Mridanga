import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { AdminDashboard } from "./components/admin-dashboard";

export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background font-body">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-headline text-center mb-12">Admin Dashboard</h1>
            <AdminDashboard />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
