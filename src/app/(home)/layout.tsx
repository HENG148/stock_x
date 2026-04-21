import Footer from "@/src/components/section/Footer"
import { Navbar } from "@/src/components/section/Navbar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}