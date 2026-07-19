"use client";

import { useState, ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isRTL } = useApp();

  return (
    <div className={cn("min-h-screen bg-gray-50 dark:bg-gray-950", isRTL && "rtl")}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        <footer className="border-t border-gray-200 dark:border-gray-700 py-4 px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500 dark:text-gray-400">
            <p>© 2024 Forex Intelligence Platform</p>
            <p className="text-xs">
              Data is for informational purposes only. Not financial advice.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
