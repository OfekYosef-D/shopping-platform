import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold tracking-tight">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">Page not found.</p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Go home
      </Link>
    </main>
  );
}
