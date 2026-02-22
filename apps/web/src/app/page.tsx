import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center px-4 py-24">
      <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
        Premium Shopping
      </h1>
      <p className="mt-6 max-w-lg text-center text-lg text-muted-foreground">
        A curated e-commerce experience built with precision.
      </p>
      <div className="mt-10 flex gap-4">
        <Link
          href="/products"
          className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Browse Products
        </Link>
      </div>
    </main>
  );
}
