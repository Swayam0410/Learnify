"use client";
import React, { useState, useContext } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Flame, Heart, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import SignInPage from "../api/auth/signin/page";
import ThemeToggle from "./ThemeToggle";
import SearchBarContext from "../Context/SearchbarContext";

const routes = [
  { label: "Recommended", href: "/News", icon: <Home size={20} /> },
  { label: "Trending", href: "/Trending", icon: <Flame size={20} /> },
  { label: "Favorites", href: "/Favourites", icon: <Heart size={20} /> },
];

const Navbar = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const searchContext = useContext(SearchBarContext);
  if (!searchContext) throw new Error("SearchBarContext not provided");

  const { searchInput, setSearchInput } = searchContext;

  if (!session) return <SignInPage />;

  const username = session.user?.email?.split("@")[0] || "User";
  const userEmail = session.user?.email || "";

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-20 top-0 left-0 h-full bg-white dark:bg-zinc-900 w-64 transform 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300 ease-in-out 
        md:relative md:translate-x-0 md:flex md:flex-col md:justify-between`}
      >
        <div>
          <h2 className="text-2xl font-bold px-6 py-4">📚 Learnify</h2>
          <nav className="px-4 space-y-2 mt-4">
            {routes.map((route) => (
              <NavItem
                key={route.href}
                icon={route.icon}
                label={route.label}
                href={route.href}
                active={pathname === route.href}
              />
            ))}
          </nav>
        </div>
        <div className="px-4 py-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <User className="w-6 h-6" />
            <div>
              <p className="text-sm font-semibold">{username}</p>
              <p className="text-xs text-gray-400">{userEmail}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto ml-0 md:ml-64">
        {/* Topbar */}
        <div className="flex items-center justify-between px-4 py-4 shadow">
          {/* Hamburger (Mobile only) */}
          <button
            className="md:hidden p-2 mr-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700 dark:text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Search Bar */}
          <div className="w-full max-w-xl flex-1">
            <input
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4 ml-4">
            <ThemeToggle />
            <Button variant="ghost">
              <Settings className="w-6 h-6 text-gray-700" />
            </Button>
            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="w-10 h-10 rounded-full border"
            />
          </div>
        </div>

        {/* Page-specific content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

const NavItem = ({
  icon,
  label,
  href,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 w-full px-4 py-2 rounded-md transition ${
        active ? "bg-gray-800 text-white font-semibold" : "hover:bg-gray-800"
      }`}
    >
      {icon}
      <span className="text-md">{label}</span>
    </Link>
  );
};

export default Navbar;
