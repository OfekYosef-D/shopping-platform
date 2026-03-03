import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Spotlight } from "@/components/ui/spotlight";
import { Truck, Star, RotateCcw, ChevronDown } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Spotlight className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden rounded-none bg-dot-grid px-4 text-center">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-background via-background/60 to-background" />

        <div className="relative z-10 flex flex-col items-center gap-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            קולקציית שינה מובחרת
          </p>

          <h1 className="font-display text-7xl font-normal leading-none tracking-tight sm:text-8xl md:text-[10rem]">
            {SITE_NAME}
          </h1>

          <p className="max-w-md text-base text-muted-foreground sm:text-lg">
            מזרונים, כריות ומוצרי שינה שנבחרו בקפידה. נוחות אמיתית, משלוח מהיר ושירות אישי.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link href="/products">
              <Button size="lg" className="min-w-40 rounded-full text-sm tracking-wide">
                מעבר לחנות
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="min-w-40 rounded-full text-sm tracking-wide"
              >
                למה לבחור בנו
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground/50">
          <ChevronDown className="h-5 w-5" />
        </div>
      </Spotlight>

      <section id="features" className="bg-background px-4 py-24">
        <div className="container mx-auto max-w-5xl">
          <p className="mb-12 text-center text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            למה {SITE_NAME}
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <GlassCard className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/40 bg-muted">
                <Truck className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold tracking-tight">משלוח מהיר לכל הארץ</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  אספקה מהירה עד הבית עם תיאום נוח מראש.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/40 bg-muted">
                <Star className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold tracking-tight">איכות ללא פשרות</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  מזרונים וכריות מחומרים איכותיים עם תמיכה אופטימלית לגוף.
                </p>
              </div>
            </GlassCard>

            <GlassCard className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/40 bg-muted">
                <RotateCcw className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold tracking-tight">החלפה והחזרה פשוטה</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  מדיניות הוגנת ושירות לקוחות זמין לכל שאלה.
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>
    </div>
  );
}
