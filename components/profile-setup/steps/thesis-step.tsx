import * as React from "react"
import { SelectablePill } from "@/components/ui/selectable-pill"

interface ThesisStepProps {
  data: {
    roles: string[];
    sectors: string[];
    stages: string[];
    ticketSize: number;
  };
  updateData: (data: Partial<ThesisStepProps["data"]>) => void;
}

const SECTORS = ["AI & ML", "EdTech", "FinTech", "Web3", "Social Impact", "Hardware"]
const STAGES = ["Idea", "MVP", "Traction", "Seed", "Series A"]

export function ThesisStep({ data, updateData }: ThesisStepProps) {
  const isInvestor = data.roles.includes("investor")

  const toggleSector = (sector: string) => {
    const newSectors = data.sectors.includes(sector)
      ? data.sectors.filter(s => s !== sector)
      : [...data.sectors, sector]
    updateData({ sectors: newSectors })
  }

  const toggleStage = (stage: string) => {
    const newStages = data.stages.includes(stage)
      ? data.stages.filter(s => s !== stage)
      : [...data.stages, stage]
    updateData({ stages: newStages })
  }

  // Slider formatter
  const formatTicketSize = (val: number) => {
    if (val >= 500) return "$500K+"
    return `$${val}K`
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Sectors */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-kizuna-text-main">Sectors of Interest</h3>
          <p className="text-sm text-kizuna-text-muted mt-1">Select all that apply.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {SECTORS.map(sector => (
            <SelectablePill
              key={sector}
              selected={data.sectors.includes(sector)}
              onClick={() => toggleSector(sector)}
            >
              {sector}
            </SelectablePill>
          ))}
        </div>
      </div>

      {/* Target Stage */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-kizuna-text-main">Target Stage</h3>
          <p className="text-sm text-kizuna-text-muted mt-1">At which stage do you typically engage?</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {STAGES.map(stage => (
            <SelectablePill
              key={stage}
              selected={data.stages.includes(stage)}
              onClick={() => toggleStage(stage)}
            >
              {stage}
            </SelectablePill>
          ))}
        </div>
      </div>

      {/* Ticket Size Slider (Conditional) */}
      {isInvestor && (
        <div className="space-y-6 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-kizuna-text-main">Typical Ticket Size</h3>
            <span className="text-lg font-semibold text-kizuna-primary">
              {formatTicketSize(data.ticketSize)}
            </span>
          </div>
          <div className="relative pt-2">
            <input
              type="range"
              min="5"
              max="500"
              step="5"
              value={data.ticketSize}
              onChange={(e) => updateData({ ticketSize: parseInt(e.target.value) })}
              className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-kizuna-primary outline-none"
            />
            <div className="flex justify-between text-xs text-zinc-400 mt-3 font-medium">
              <span>$5K</span>
              <span>$250K</span>
              <span>$500K+</span>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
