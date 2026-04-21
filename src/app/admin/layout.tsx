import { auth, signOut } from "@/src/auth";
import { NAV_ITEMS } from "@/src/types/type";
import Link from "next/link";
import { redirect } from "next/navigation";

async function handleSignOut() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen bg-[#f5f5f0]">
      <aside className="w-56 shrink-0 bg-[#111] h-screen sticky top-0 flex flex-col overflow-hidden">
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/admin" className="text-white font-black text-lg tracking-tight no-underline">
            StockX
          </Link>
          <p className="text-white/30 text-[11px] font-medium mt-0.5 uppercase tracking-widest">
            Admin
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 text-[13px] font-medium no-underline hover:bg-white/10 hover:text-white transition-all"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <div className="px-3 py-2 mb-2">
            <p className="text-white/80 text-[13px] font-medium truncate">
              {session.user.name}
            </p>
            <p className="text-white/30 text-[11px] truncate">
              {session.user.email}
            </p>
          </div>

          <form action={handleSignOut}>
            <button 
              type="submit"
              className="w-full text-left px-3 py-2 rounded-lg text-red-400 text-[13px] font-medium hover:bg-white/10 transition-all bg-transparent border-none cursor-pointer font-[inherit]"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}