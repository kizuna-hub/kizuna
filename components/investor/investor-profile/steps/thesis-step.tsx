import * as React from "react"
import { SelectablePill } from "@/components/ui/selectable-pill"

interface ThesisStepProps {
  data: {
    sectors: string[];
    stages: string[];
    ticketSize: number;
  };
  updateData: (data: Partial<ThesisStepProps["data"]>) => void;
}

const SECTORS = ["AI & ML", "EdTech", "FinTech", "Web3", "Social Impact", "AgriTech", "HealthTech", "FoodTech", "BioTech", "CleanTech"]
const STAGES = ["Idea", "MVP", "Traction", "Seed"]

export function ThesisStep({ data, updateData }: ThesisStepProps) {
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

  // Định dạng hiển thị đơn giản cho dải 5 - 100 triệu
  const formatTicketSize = (val: number) => {
    return `${val.toLocaleString('vi-VN')} triệu VNĐ`;
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Sectors */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-kizuna-text-main">Lĩnh vực quan tâm</h3>
          <p className="text-sm text-kizuna-text-muted mt-1">Chọn tất cả các mục phù hợp.</p>
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

      {/* Preferred Stage */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-kizuna-text-main">Giai đoạn ưu tiên</h3>
          <p className="text-sm text-kizuna-text-muted mt-1">Bạn thường đầu tư vào giai đoạn nào?</p>
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

      {/* Ticket Size Slider */}
      <div className="space-y-6 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-kizuna-text-main">Quy mô đầu tư thông thường</h3>
          <span className="text-lg font-semibold text-kizuna-primary">
            {formatTicketSize(data.ticketSize)}
          </span>
        </div>
        <div className="relative pt-2">
          <input
            type="range"
            min="5"   // Quy mô tối thiểu 5 triệu
            max="100" // Quy mô tối đa 100 triệu
            step="5"  // Bước nhảy 5 triệu
            value={data.ticketSize}
            onChange={(e) => updateData({ ticketSize: parseInt(e.target.value) })}
            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-kizuna-primary"
          />
          <div className="flex justify-between text-xs text-zinc-400 mt-3 font-medium">
            <span>5 triệu</span>
            <span>50 triệu</span>
            <span>100 triệu</span>
          </div>
        </div>
      </div>

    </div>
  )
}