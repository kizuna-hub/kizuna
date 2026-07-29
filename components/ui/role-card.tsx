import * as React from "react"
import { cn } from "@/lib/utils"

interface RoleCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

export function RoleCard({ title, description, selected, onClick, icon }: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn("w-full cursor-pointer rounded-2xl border p-6 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        selected
          ? "border-primary-border bg-primary-muted ring-1 ring-primary-border"
          : "border-border bg-card hover:bg-muted"
      )}
    >
      <div className="flex items-start">
        {icon && (
          <div className={cn("mr-4 mt-1 flex-shrink-0", selected ? "text-primary-text" : "text-muted-foreground")}>
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className={`mt-1 flex h-6 w-6 items-center justify-center rounded-sm border shrink-0 ${
          selected ? "border-primary-action bg-primary-action" : "border-border bg-background"
        }`}>
          {selected && (
            <svg className="h-4 w-4 text-[var(--color-on-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </button>
  )
}
