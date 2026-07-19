// Dashboard Layout — Header + Sidebar + Main Content + Footer regions
// (per Frontend Architecture: Layout Architecture). Structural shell only;
// nav content, header, and sidebar components are built in a follow-up pass.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border" />
      <div className="flex flex-1">
        <aside className="hidden w-64 shrink-0 border-r border-border md:block" />
        <main className="flex-1 p-6">{children}</main>
      </div>
      <footer className="border-t border-border" />
    </div>
  );
}
