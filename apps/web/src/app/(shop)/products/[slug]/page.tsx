import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });

  if (!product) notFound();

  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
      <p className="mt-4 text-muted-foreground">{product.description}</p>
    </main>
  );
}
