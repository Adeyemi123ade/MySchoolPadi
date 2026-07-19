// Auth Layout — full screen, no sidebar/header (per Frontend Architecture: Layout Architecture)
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center p-4">{children}</div>;
}
