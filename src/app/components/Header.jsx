"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const Header = () => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.pathname);
  }, []);

  const baseClass = "text-lg font-semibold cursor-pointer transition";
  const active = "text-blue-400";
  const inactive = " hover:text-blue-900";

  const navItems = [
    { label: "Home", path: "/News" },
    { label: "Movies  for you", path: "/Reccomendation" },
    { label: "Social Media", path: "/Social" },
  ];

  return (
    <div className="flex flex-row gap-8 w-full justify-center py-4 ">
      {navItems.map((item, idx) => (
        <Link key={idx} href={item.path}>
          <h3 className={`${baseClass} ${url === item.path ? active : inactive}`}>
            {item.label}
          </h3>
        </Link>
      ))}
    </div>
  );
};

export default Header;
