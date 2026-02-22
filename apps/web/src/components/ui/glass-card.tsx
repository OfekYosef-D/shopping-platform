import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl",
        "dark:border-white/10 dark:bg-white/5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
