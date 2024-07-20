import React from 'react';
import { Outlet, Link } from '@tanstack/react-router';
import { Home, Info } from "lucide-react";

export default function App() {
  return (
    <div className="flex h-screen w-full bg-muted/40 overflow-hidden">
      <aside className="flex w-14 flex-shrink-0 flex-col border-r bg-background">
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          <Link
            to="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground"
          >
            <Home className="h-4 w-4 transition-all group-hover:scale-110" />
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
