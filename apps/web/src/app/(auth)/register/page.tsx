"use client";

import { useActionState } from "react";
import { register } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { Spotlight } from "@/components/ui/spotlight";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, null);

  return (
    <Spotlight className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-dot-grid px-4 rounded-none">
      {/* Background fade */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-background/80 via-background/50 to-background/80" />

      <GlassCard className="relative z-10 w-full max-w-sm space-y-6">
        {/* Brand */}
        <div className="space-y-1 text-center">
          <p className="font-display text-3xl tracking-tight">Mizronim</p>
          <p className="text-sm text-muted-foreground">Create your account</p>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Jane Doe"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              placeholder="••••••••"
            />
          </div>

          {state && !state.success && (
            <p className="text-destructive text-sm">{state.message}</p>
          )}

          <Button type="submit" className="w-full rounded-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account…
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground underline-offset-4 hover:underline">
            Sign In
          </Link>
        </p>
      </GlassCard>
    </Spotlight>
  );
}
