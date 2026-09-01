import { useState } from 'react';
import AdminSidebar, { AdminMobileDrawer } from './AdminSidebar';

export default function AdminLayout({ title, children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex bg-parchment min-h-screen">
      <AdminSidebar />
      <AdminMobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <main className="flex-1 min-w-0">
        <div className="sticky top-0 z-10 bg-ivory border-b border-line/10 px-4 md:px-10 h-16 flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="md:hidden flex flex-col gap-1.5 w-6 shrink-0"
          >
            <span className="h-px w-full bg-ink" />
            <span className="h-px w-4 bg-ink" />
          </button>
          <h1 className="font-display text-lg md:text-xl text-ink truncate">{title}</h1>
        </div>
        <div className="p-4 md:p-10">{children}</div>
      </main>
    </div>
  );
}
