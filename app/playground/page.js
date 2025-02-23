"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toast } from "../components/Toast";

export default function PlaygroundPage() {
  // State management for form, loading state, and toast notifications
  const [apiKey, setApiKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "positive" });
  const router = useRouter();

  // Helper function to show toast messages
  const showToast = (message, type) => {
    setToast({ message, type });
    // Auto-hide toast after 3 seconds
    setTimeout(() => setToast({ message: "", type: "positive" }), 3000);
  };

  // Handle form submission and API key validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate empty input
    if (!apiKey.trim()) {
      showToast("Please enter an API key", "negative");
      return;
    }

    setIsSubmitting(true);
    try {
      // Send API key to validation endpoint
      const response = await fetch("/api/validate-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      });

      if (!response.ok) {
        throw new Error("Invalid API key");
      }

      // On success, store API key and redirect
      showToast("API key is valid", "positive");
      sessionStorage.setItem("apiKey", apiKey);
      setTimeout(() => router.push("/protected"), 1000);
    } catch (error) {
      showToast(error.message, "negative");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-8 dark:bg-black">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">
          API Playground
        </h1>
        {/* API Key input form */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                API Key
                <span className="text-gray-500 dark:text-gray-400 ml-2">
                  — Enter your API key to access the playground
                </span>
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="dandi-dev-..."
                className="w-full p-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Validating..." : "Access Playground"}
            </button>
          </form>
        </div>
      </div>
      {/* Toast notification */}
      {toast.message && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
