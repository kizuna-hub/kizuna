import * as React from "react"
import { cn } from "@/lib/utils"

export interface SelectablePillProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

const SelectablePill = React.forwardRef<HTMLButtonElement, SelectablePillProps>(
  ({ className, selected = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
          selected
            ? "bg-primary-action text-[var(--color-on-primary)] hover:bg-primary-action-hover"
            : "bg-muted text-muted-foreground hover:bg-workspace-row-hover hover:text-foreground",
          className
        )}
        {...props}
      />
    )
  }
)
SelectablePill.displayName = "SelectablePill"

export { SelectablePill }
