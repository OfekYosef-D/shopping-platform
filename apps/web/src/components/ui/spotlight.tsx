"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface SpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Spotlight({ children, className, ...props }: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    positionRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    if (frameRef.current !== null) return;

    frameRef.current = requestAnimationFrame(() => {
      if (!ref.current) return;
      ref.current.style.setProperty(
        "--spotlight-x",
        `${positionRef.current.x}px`,
      );
      ref.current.style.setProperty(
        "--spotlight-y",
        `${positionRef.current.y}px`,
      );
      frameRef.current = null;
    });
  }

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("relative overflow-hidden rounded-2xl", className)}
      style={
        {
          "--spotlight-x": "50%",
          "--spotlight-y": "50%",
        } as React.CSSProperties
      }
      {...props}
    >
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background:
              "radial-gradient(600px circle at var(--spotlight-x) var(--spotlight-y), rgba(255,255,255,0.06), transparent 40%)",
          }}
        />
      )}
      {children}
    </div>
  );
}
