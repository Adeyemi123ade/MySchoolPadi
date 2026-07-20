export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 p-8 text-center">
      <h1 className="text-h2 font-semibold text-foreground">Page not found</h1>
      <p className="text-body text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist.</p>
    </main>
  );
}
