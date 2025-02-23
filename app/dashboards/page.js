"use client";
import { useState } from "react";
import { useApiKeys } from "../hooks/useApiKeys";
import { ApiKeyTable } from "../components/dashboard/ApiKeyTable";
import { CreateKeyModal } from "../components/dashboard/CreateKeyModal";
import { ThemeToggle } from "../components/ThemeToggle";
import { Toast } from "../components/Toast";
import { InfoIcon } from "../components/dashboard/Icons";
import { supabase } from "@/lib/supabase";

// Modern SVG icons as components
const EyeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CopyIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const EditIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DeleteIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export default function DashboardPage() {
  const { apiKeys, setApiKeys, isLoading, error } = useApiKeys();
  const [newKeyName, setNewKeyName] = useState("");
  const [keyType, setKeyType] = useState("development");
  const [monthlyLimit, setMonthlyLimit] = useState("1000");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  const [visibleKeys, setVisibleKeys] = useState(new Set());
  const [editingKey, setEditingKey] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      showToast("Please enter a key name", "error");
      return;
    }

    try {
      setIsCreating(true);

      const newKey = {
        name: newKeyName,
        key: generateApiKey(),
        type: keyType,
        usage: 0,
        monthly_limit: parseInt(monthlyLimit),
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("api_keys")
        .insert(newKey)
        .select()
        .single();

      if (error) throw error;

      setApiKeys((prevKeys) => [data, ...prevKeys]);
      setNewKeyName("");
      setKeyType("development");
      setMonthlyLimit("1000");
      setIsModalOpen(false);
      showToast("API key created successfully", "positive");
    } catch (error) {
      console.error("Error creating API key:", error);
      showToast(`Failed to create API key: ${error.message}`, "negative");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditKey = (key) => {
    setEditingKey({
      ...key,
      newName: key.name,
    });
  };

  const saveEdit = async () => {
    if (!editingKey.newName.trim()) {
      showToast("Key name cannot be empty", "error");
      return;
    }

    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from("api_keys")
        .update({ name: editingKey.newName })
        .eq("id", editingKey.id);

      if (error) throw error;

      setApiKeys(
        apiKeys.map((key) =>
          key.id === editingKey.id ? { ...key, name: editingKey.newName } : key
        )
      );
      showToast("API key updated successfully", "positive");
    } catch (error) {
      console.error("Error updating API key:", error);
      showToast(`Failed to update API key: ${error.message}`, "negative");
    } finally {
      setIsUpdating(false);
      setEditingKey(null);
    }
  };

  const handleDeleteKey = async (keyId) => {
    if (confirm("Are you sure you want to delete this API key?")) {
      try {
        setIsDeleting(true);
        const { error } = await supabase
          .from("api_keys")
          .delete()
          .eq("id", keyId);

        if (error) throw error;

        setApiKeys(apiKeys.filter((key) => key.id !== keyId));
        showToast("API key deleted successfully", "negative");
      } catch (error) {
        console.error("Error deleting API key:", error);
        showToast(`Failed to delete API key: ${error.message}`, "negative");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("API key copied to clipboard", "positive");

      // Announce to screen readers
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", "polite");
      announcement.textContent = "API key copied to clipboard";
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 3000);
    } catch (err) {
      console.error("Copy failed:", err);
      showToast("Failed to copy API key", "negative");
    }
  };

  const generateApiKey = () => {
    const prefix = "dandi-";
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const randomPart = Array(32)
      .fill(0)
      .map(() => chars[Math.floor(Math.random() * chars.length)])
      .join("");
    return (
      prefix + (keyType === "production" ? "prod" : "dev") + "-" + randomPart
    );
  };

  return (
    <div className="p-8 dark:bg-black">
      <ThemeToggle />
      {/* Current Plan Section */}
      <div className="mb-12 bg-gradient-to-r from-rose-100/90 via-purple-200/90 to-purple-300/90 dark:from-rose-900/20 dark:via-purple-800/20 dark:to-purple-700/20 rounded-3xl p-8 backdrop-blur-sm">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          CURRENT PLAN
        </div>
        <h1 className="text-4xl font-bold mb-6 dark:text-white">Researcher</h1>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2 dark:text-white">
            <span>API Usage</span>
            <InfoIcon />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            0/1,000 Credits
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white dark:bg-gray-800 rounded-full"></div>
          <span className="text-sm dark:text-white">Pay as you go</span>
          <InfoIcon />
        </div>
      </div>

      {/* API Keys Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold dark:text-white">API Keys</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-sm border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white transition-colors"
          >
            <span>+</span> Create API Key
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
          The key is used to authenticate your requests to the Dandi AI Research
          API. To learn more, see the documentation page.
        </p>

        <ApiKeyTable
          isLoading={isLoading}
          apiKeys={apiKeys}
          visibleKeys={visibleKeys}
          toggleKeyVisibility={toggleKeyVisibility}
          copyToClipboard={copyToClipboard}
          editingKey={editingKey}
          setEditingKey={setEditingKey}
          saveEdit={saveEdit}
          handleEditKey={handleEditKey}
          handleDeleteKey={handleDeleteKey}
        />
      </div>

      {/* Contact Section */}
      <div className="flex justify-between items-center text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          Have any questions, feedback or need support? We'd love to hear from
          you!
        </p>
        <button className="border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 rounded-full px-6 py-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors">
          Contact us
        </button>
      </div>

      <CreateKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newKeyName={newKeyName}
        setNewKeyName={setNewKeyName}
        keyType={keyType}
        setKeyType={setKeyType}
        monthlyLimit={monthlyLimit}
        setMonthlyLimit={setMonthlyLimit}
        handleCreateKey={handleCreateKey}
        isCreating={isCreating}
      />

      {toast.message && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
