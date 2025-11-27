import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { LoginForm } from "../components/login-form";
import { getUser } from "@/lib/session";
import { redirect } from "next/navigation";


export default async function LoginPage() {
    const user = await getUser();
    if(user) {
        redirect('/admin');
    }

    return (
        <div className="flex flex-col min-h-dvh bg-background font-body">
            <Header />
            <main className="flex-1 flex items-center justify-center">
                <LoginForm />
            </main>
            <Footer />
        </div>
    )
}
