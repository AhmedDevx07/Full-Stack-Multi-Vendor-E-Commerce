import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "sonner";
import LayoutConditionalWrapper from "@/components/LayoutConditionalWrapper"; // 🔥 New wrapper logic file
import "./globals.css";

export const metadata = {
  title: "Multi-Vendor E-Commerce Platform",
  description: "Built with Next.js, Tailwind CSS & MongoDB Atlas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50/50 flex flex-col min-h-screen antialiased selection:bg-indigo-500 selection:text-white">
        <AuthProvider>
          <CartProvider>
            
            {/* 🔥 Custom layout conditional node wrapper */}
            <LayoutConditionalWrapper>
              {children}
            </LayoutConditionalWrapper>
            
            {/* 🌟 Toaster Layer Configuration */}
            <Toaster 
              position="top-right" 
              richColors 
              expand={false}
              toastOptions={{
                style: {
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(243, 244, 246, 1)",
                  borderRadius: "16px",
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}