"use client";
import { useState } from "react";

export function CreateKeyModal({
  isOpen,
  onClose,
  newKeyName,
  setNewKeyName,
  keyType,
  setKeyType,
  monthlyLimit,
  setMonthlyLimit,
  handleCreateKey,
  isCreating,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white dark:bg-[#1a1b1e] p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 dark:text-white">
          Create a new API key
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Enter a name and limit for the new API key.
        </p>

        <KeyNameInput value={newKeyName} onChange={setNewKeyName} />
        <KeyTypeSelection value={keyType} onChange={setKeyType} />
        <MonthlyLimitInput value={monthlyLimit} onChange={setMonthlyLimit} />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateKey}
            disabled={isCreating}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Sub-components for the modal
function KeyNameInput({ value, onChange }) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2 dark:text-gray-200">
        Key Name{" "}
        <span className="text-gray-500 dark:text-gray-400">
          — A unique name to identify this key
        </span>
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Key Name"
        className="w-full p-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
      />
    </div>
  );
}

function KeyTypeSelection({ value, onChange }) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2 dark:text-gray-200">
        Key Type{" "}
        <span className="text-gray-500 dark:text-gray-400">
          — Choose the environment for this key
        </span>
      </label>
      <div className="space-y-3">
        <label className="flex items-center gap-3 p-3 border dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
          <input
            type="radio"
            name="keyType"
            value="production"
            checked={value === "production"}
            onChange={(e) => onChange(e.target.value)}
            className="text-purple-600 focus:ring-purple-500"
          />
          <div>
            <div className="font-medium dark:text-white">Production</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Rate limited to 1,000 requests/minute
            </div>
          </div>
        </label>
        <label className="flex items-center gap-3 p-3 border dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50">
          <input
            type="radio"
            name="keyType"
            value="development"
            checked={value === "development"}
            onChange={(e) => onChange(e.target.value)}
            className="text-purple-600 focus:ring-purple-500"
          />
          <div>
            <div className="font-medium dark:text-white">Development</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Rate limited to 100 requests/minute
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}

function MonthlyLimitInput({ value, onChange }) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2 dark:text-gray-200">
        Monthly Limit{" "}
        <span className="text-gray-500 dark:text-gray-400">
          — Maximum number of requests per month
        </span>
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        *If the combined usage of all your keys exceeds your plan's limit, all
        requests will be rejected.
      </p>
    </div>
  );
}
