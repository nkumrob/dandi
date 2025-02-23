"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NavItem = ({ href, icon, children, isNested = false }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
      } ${isNested ? "ml-6" : ""}`}
    >
      {icon}
      <span className="text-sm">{children}</span>
    </Link>
  );
};

// Add a MenuToggle component
const MenuToggle = ({ isOpen, onClick }) => (
  <button
    onClick={onClick}
    className={`fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 ${
      isOpen ? "left-[248px]" : "left-4"
    }`}
    aria-label={isOpen ? "Close menu" : "Open menu"}
  >
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="text-gray-600 dark:text-gray-400"
    >
      {isOpen ? (
        <path d="M18 6L6 18M6 6l12 12" />
      ) : (
        <path d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  </button>
);

// Update the Sidebar component
export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <MenuToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      <div
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out ${
          isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col p-4">
          {/* Logo */}
          <div className="mb-8 px-4">
            <Link href="/">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Dandi AI
                </h1>
              </div>
            </Link>
          </div>

          {/* Account Selector */}
          <div className="mb-6 px-4">
            <select className="w-full bg-transparent border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white">
              <option>Personal</option>
              <option>Team</option>
            </select>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            <NavItem href="/overview" icon={<HomeIcon />}>
              Overview
            </NavItem>

            <div className="pt-4">
              <div className="px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                Account
              </div>
              <NavItem href="/account" icon={<UserIcon />}>
                My Account
              </NavItem>
            </div>

            <div className="pt-4">
              <div className="px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                Tools
              </div>
              <NavItem href="/assistant" icon={<AssistantIcon />}>
                Research Assistant
              </NavItem>
              <NavItem href="/reports" icon={<ReportIcon />}>
                Research Reports
              </NavItem>
              <NavItem href="/playground" icon={<PlaygroundIcon />}>
                API Playground
              </NavItem>
              <NavItem href="/docs" icon={<DocsIcon />}>
                Documentation
              </NavItem>
            </div>
          </nav>

          {/* Footer - Move it above the user section */}
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-auto mb-20 px-4">
            © {new Date().getFullYear()} Dandi AI. All rights reserved.
          </div>

          {/* User Section */}
          <div className="absolute bottom-4 left-4 right-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-sm font-medium">
                N
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Nana
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Personal
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Icons
const HomeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const AssistantIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const ReportIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const PlaygroundIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const DocsIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);
