// components/ui/badge.tsx
import React from "react";

export function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full bg-green-200 text-green-800 ${className}`}>
      {children}
    </span>
  )
}
