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
          "inline-flex items-center justify-center whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kizuna-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          selected
            ? "bg-kizuna-primary text-white"
            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900",
          className
        )}
        {...props}
      />
    )
  }
)
SelectablePill.displayName = "SelectablePill"

export { SelectablePill }
