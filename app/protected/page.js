"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toast } from "../components/Toast";

export default function ProtectedPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "positive" });

  // Check for API key on component mount
  useEffect(() => {
    const apiKey = sessionStorage.getItem("apiKey");
    // Redirect to playground if no API key is found
    if (!apiKey) {
      router.replace("/playground");
      return;
    }
    setIsLoading(false);
  }, [router]);

  // Show loading spinner while checking API key
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 dark:bg-black">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">
          Protected Playground
        </h1>
        {/* Protected content will be added here */}
      </div>
      {/* Toast notification */}
      {toast.message && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
