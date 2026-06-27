"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar"; 
import Footer from "@/components/Footer"; 

export default function LayoutConditionalWrapper({ children }) {
  const pathname = usePathname();

  // 🛡️ Isolated application paths jahan store layout bilkul render nahi hona chahiye
  const isolatedRoutes = ["/login", "/auth", "/vendor", "/admin"];

  // Check karein agar current path inme se kisi se start hota hai
  const isIsolated = isolatedRoutes.some((route) => pathname.startsWith(route));

  // 🔥 FIX: Isolated portal layout nodes par direct bina kisi extra wrappers ke children render karein
  // Is se React context ki nested states break nahi hongi
  if (isIsolated) {
    return <>{children}</>;
  }

  // Public buyer view layers with standard navigation parameters
  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}