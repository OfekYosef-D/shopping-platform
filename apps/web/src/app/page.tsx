import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Spotlight } from "@/components/ui/spotlight";
import { Truck, Star, RotateCcw, ChevronDown } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <Spotlight className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-dot-grid rounded-none px-4 text-center">
        {/* Radial fade over dot grid */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-background via-background/60 to-background" />

        <div className="relative z-10 flex flex-col items-center gap-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Premium Collection
          </p>

          <h1 className="font-display text-7xl font-normal tracking-tight sm:text-8xl md:text-[10rem] leading-none">
            Mizronim
          </h1>

          <p className="max-w-md text-base text-muted-foreground sm:text-lg">
            Refined shopping for a refined taste. Curated products delivered to your door.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link href="/products">
              <Button size="lg" className="min-w-40 rounded-full text-sm tracking-wide">
                Shop Now
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="min-w-40 rounded-full text-sm tracking-wide"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground/50">
          <ChevronDown className="h-5 w-5" />
        </div>
      </Spotlight>

      {/* Feature strip */}
      <section id="features" className="bg-background px-4 py-24">
        <div className="container mx-auto max-w-5xl">
          <p className="mb-12 text-center text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Why Mizronim
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <GlassCard className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/40 bg-muted">
                <Truck className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold tracking-tight">Free Shipping</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  On all orders over $50. Fast, reliable delivery worldwide.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/40 bg-muted">
                <Star className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold tracking-tight">Premium Quality</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Every product is handpicked and quality-verified before listing.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/40 bg-muted">
                <RotateCcw className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold tracking-tight">Easy Returns</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  30-day hassle-free returns. No questions asked.
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>
    </div>
  );
}
