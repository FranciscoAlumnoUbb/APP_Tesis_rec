// components/ui/card.tsx
import React from "react"

export function Card({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`rounded-xl shadow-md p-4 bg-white ${className}`}>
      {children}
    </div>
  )
}

export function CardContent({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`mt-2 ${className}`}>
      {children}
    </div>
  )
}
