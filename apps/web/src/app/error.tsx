"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight">משהו השתבש</h1>
      <p className="mt-4 text-muted-foreground">
        {error.message || "אירעה תקלה לא צפויה. אפשר לנסות שוב."}
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        ניסיון חוזר
      </button>
    </main>
  );
}
