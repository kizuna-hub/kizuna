import * as React from "react"

interface RoleCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

export function RoleCard({ title, description, selected, onClick, icon }: RoleCardProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-2xl p-6 transition-all border ${
        selected
          ? "border-kizuna-primary bg-kizuna-surface ring-1 ring-kizuna-primary"
          : "border-kizuna-border bg-white"
      }`}
    >
      <div className="flex items-start">
        {icon && (
          <div className={`mr-4 flex-shrink-0 mt-1 ${selected ? "text-kizuna-primary" : "text-zinc-400"}`}>
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-kizuna-text-main">{title}</h3>
          <p className="mt-1 text-sm text-kizuna-text-muted">{description}</p>
        </div>
        <div className={`mt-1 flex h-6 w-6 items-center justify-center rounded-sm border shrink-0 ${
          selected ? "border-kizuna-primary bg-kizuna-primary" : "border-zinc-300"
        }`}>
          {selected && (
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}
