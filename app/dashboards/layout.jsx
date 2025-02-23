"use client";
import { Sidebar } from "../components/Sidebar";
import { useState } from "react";
import { ThemeProvider } from "../providers/ThemeProvider";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <ThemeProvider>
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
