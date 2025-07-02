"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Flame, Heart, Search, Settings, User } from "lucide-react";

import { Button } from "@/components/ui/button";


import { useSession, signOut } from "next-auth/react"
import SignInPage from "../api/auth/signin/page";
import ThemeToggle from "./ThemeToggle";

import { useContext } from "react";
import SearchBarContext from "../Context/SearchbarContext";

const routes = [
  { label: "Recommended", href: "/News", icon: <Home size={20} /> },
  { label: "Trending", href: "/Trending", icon: <Flame size={20} /> },
  { label: "Favorites", href: "/Favourites", icon: <Heart size={20} /> },
];

const Navbar = ({ children }: { children: React.ReactNode }) => {
   const { data: session } = useSession()
  
  const pathname = usePathname();
 const searchContext = useContext(SearchBarContext);
if (!searchContext) throw new Error("SearchBarContext not provided");

const { searchInput, setSearchInput } = searchContext;

  if(!session)return (
    <>
      <SignInPage/>
    </>
  );
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col justify-between">
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
             {session?.user?.email && (
  <div>
    <p className="text-sm font-semibold">
      {session.user.email.split("@")[0]}
    </p>
    <p className="text-xs text-gray-400">
      {session.user.email}
    </p>
  </div>
)}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Topbar */}
        <div className="flex items-center justify-between  px-6 py-4 shadow">
          <div className="w-full max-w-xl">
            <div className="relative">
             
              <input
      type="text"
      placeholder="Search..."
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      className="p-2 border rounded w-full"
    />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle/>
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
        active ? "bg-gray-800 font-semibold" : "hover:bg-gray-800"
      }`}
    >
      {icon}
      <span className="text-md">{label}</span>
    </Link>
  );
};

export default Navbar;
