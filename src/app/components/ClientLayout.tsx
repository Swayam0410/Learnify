"use client";

import Navbar from "./Navbar";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      <Navbar>
      <main className="flex-1 flex flex-col overflow-y-auto">
        {children}
      </main>
      </Navbar>
    </div>
  );
};

export default ClientLayout;
