"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { Spotlight } from "@/components/ui/spotlight";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <Spotlight className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-dot-grid rounded-none px-4">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-background/80 via-background/50 to-background/80" />

      <GlassCard className="relative z-10 w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <p className="font-display text-3xl tracking-tight">שינה ישירה</p>
          <p className="text-sm text-muted-foreground">ברוכים הבאים חזרה</p>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              אימייל
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              סיסמה
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="********"
            />
          </div>

          {state && !state.success && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <Button
            type="submit"
            className="w-full rounded-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                מתחבר...
              </>
            ) : (
              "התחברות"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          עדיין אין לכם חשבון?{" "}
          <Link
            href="/register"
            className="text-foreground underline-offset-4 hover:underline"
          >
            הרשמה
          </Link>
        </p>
      </GlassCard>
    </Spotlight>
  );
}
