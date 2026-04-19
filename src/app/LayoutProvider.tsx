'use client'

import { usePathname } from "next/navigation";
import { Navbar } from "../components/section/Navbar";

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noHeaderFooterRoutes = [
    '/login',
    '/register'
  ];
  const HideHeaderFooter = noHeaderFooterRoutes.some(route => pathname?.endsWith(route))
  return (
    <>
      {!HideHeaderFooter && <Navbar />}
      <main>{children}</main>
    </>
  )
}