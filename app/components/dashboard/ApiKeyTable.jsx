"use client";
import { EyeIcon, CopyIcon, EditIcon, DeleteIcon } from "./Icons";

export function ApiKeyTable({
  isLoading,
  apiKeys,
  visibleKeys,
  toggleKeyVisibility,
  copyToClipboard,
  editingKey,
  setEditingKey,
  saveEdit,
  handleEditKey,
  handleDeleteKey,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Usage
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Key
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-800">
          {isLoading ? (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center">
                <div className="flex justify-center items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent" />
                  <span>Loading...</span>
                </div>
              </td>
            </tr>
          ) : apiKeys.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
              >
                No API keys found. Create one to get started.
              </td>
            </tr>
          ) : (
            apiKeys.map((key) => (
              <tr
                key={key.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td className="px-6 py-4 dark:text-white">
                  {editingKey?.id === key.id ? (
                    <input
                      type="text"
                      value={editingKey.newName}
                      onChange={(e) =>
                        setEditingKey({
                          ...editingKey,
                          newName: e.target.value,
                        })
                      }
                      className="border rounded p-1 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  ) : (
                    key.name
                  )}
                </td>
                <td className="px-6 py-4 dark:text-white">{key.type}</td>
                <td className="px-6 py-4 dark:text-white">{key.usage}</td>
                <td className="px-6 py-4 font-mono dark:text-white">
                  {visibleKeys.has(key.id)
                    ? key.key
                    : `dandi-${
                        key.type === "production" ? "prod" : "dev"
                      }-${"•".repeat(32)}`}
                </td>
                <td className="px-6 py-4">
                  <ActionButtons
                    apiKey={key}
                    visibleKeys={visibleKeys}
                    toggleKeyVisibility={toggleKeyVisibility}
                    copyToClipboard={copyToClipboard}
                    editingKey={editingKey}
                    saveEdit={saveEdit}
                    setEditingKey={setEditingKey}
                    handleEditKey={handleEditKey}
                    handleDeleteKey={handleDeleteKey}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function ActionButtons({
  apiKey,
  visibleKeys,
  toggleKeyVisibility,
  copyToClipboard,
  editingKey,
  saveEdit,
  setEditingKey,
  handleEditKey,
  handleDeleteKey,
}) {
  return (
    <div className="flex justify-end gap-3">
      <button
        onClick={() => toggleKeyVisibility(apiKey.id)}
        className="text-gray-500 hover:text-gray-700 transition-colors"
        title={visibleKeys.has(apiKey.id) ? "Hide" : "Show"}
      >
        <EyeIcon />
      </button>
      <button
        className="text-gray-500 hover:text-gray-700 transition-colors"
        title="Copy"
        onClick={() => copyToClipboard(apiKey.key)}
      >
        <CopyIcon />
      </button>
      {editingKey?.id === apiKey.id ? (
        <>
          <button
            onClick={saveEdit}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Save"
          >
            Save
          </button>
          <button
            onClick={() => setEditingKey(null)}
            className="text-gray-600 hover:text-gray-800 transition-colors"
            title="Cancel"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => handleEditKey(apiKey)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title="Edit"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => handleDeleteKey(apiKey.id)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title="Delete"
          >
            <DeleteIcon />
          </button>
        </>
      )}
    </div>
  );
}
