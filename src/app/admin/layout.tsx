import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdmin();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="relative border-b border-[var(--border)] bg-[var(--accent)] text-white">
        <div className="container-x flex items-center justify-between h-14">
          <Link href="/admin" className="font-bold tracking-tight">
            <span className="hidden sm:inline">EA Promo · Admin</span>
            <span className="sm:hidden">Admin</span>
          </Link>
          {authed && <AdminNav />}
        </div>
      </header>
      <main className="flex-1 container-x py-6 md:py-8">{children}</main>
    </div>
  );
}
