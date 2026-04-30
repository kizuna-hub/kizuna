import * as React from "react"
import { SelectablePill } from "@/components/ui/selectable-pill"

interface ExpertiseStepProps {
  data: {
    expertise: string[];
    involvementLevel: string;
  };
  updateData: (data: Partial<ExpertiseStepProps["data"]>) => void;
}

const EXPERTISE_TAGS = [
  "Marketing", 
  "Technical/Engineering", 
  "Legal & IP", 
  "Fundraising", 
  "GTM Strategy", 
  "Product Design"
]

export function ExpertiseStep({ data, updateData }: ExpertiseStepProps) {
  const toggleExpertise = (tag: string) => {
    const newExpertise = data.expertise.includes(tag)
      ? data.expertise.filter(t => t !== tag)
      : [...data.expertise, tag]
    updateData({ expertise: newExpertise })
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Expertise */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-kizuna-text-main">Expertise Tags</h3>
          <p className="text-sm text-kizuna-text-muted mt-1">
            Where can you provide the most value?
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {EXPERTISE_TAGS.map(tag => (
            <SelectablePill
              key={tag}
              selected={data.expertise.includes(tag)}
              onClick={() => toggleExpertise(tag)}
            >
              {tag}
            </SelectablePill>
          ))}
        </div>
      </div>

      {/* Involvement Level */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-kizuna-text-main">Involvement Level</h3>
          <p className="text-sm text-kizuna-text-muted mt-1">
            What style of involvement suits you best?
          </p>
        </div>
        
        <div className="space-y-3 pt-2">
          {/* Hands-on */}
          <label className={`relative flex cursor-pointer rounded-xl border p-4 transition-all ${
            data.involvementLevel === 'hands-on' 
              ? 'border-kizuna-primary bg-kizuna-surface ring-1 ring-kizuna-primary' 
              : 'border-kizuna-border bg-white hover:border-zinc-300'
          }`}>
            <input 
              type="radio" 
              name="involvementLevel" 
              value="hands-on" 
              className="sr-only"
              checked={data.involvementLevel === 'hands-on'}
              onChange={() => updateData({ involvementLevel: 'hands-on' })}
            />
            <div className="flex w-full items-center justify-between">
              <span className="text-sm font-medium text-kizuna-text-main">
                Hands-on (1-on-1 Mentorship)
              </span>
              <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                data.involvementLevel === 'hands-on' ? 'border-kizuna-primary bg-kizuna-primary' : 'border-zinc-300'
              }`}>
                {data.involvementLevel === 'hands-on' && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
            </div>
          </label>

          {/* Strategic */}
          <label className={`relative flex cursor-pointer rounded-xl border p-4 transition-all ${
            data.involvementLevel === 'strategic' 
              ? 'border-kizuna-primary bg-kizuna-surface ring-1 ring-kizuna-primary' 
              : 'border-kizuna-border bg-white hover:border-zinc-300'
          }`}>
            <input 
              type="radio" 
              name="involvementLevel" 
              value="strategic" 
              className="sr-only"
              checked={data.involvementLevel === 'strategic'}
              onChange={() => updateData({ involvementLevel: 'strategic' })}
            />
            <div className="flex w-full items-center justify-between">
              <span className="text-sm font-medium text-kizuna-text-main">
                Strategic (Board level / Monthly checks)
              </span>
              <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                data.involvementLevel === 'strategic' ? 'border-kizuna-primary bg-kizuna-primary' : 'border-zinc-300'
              }`}>
                {data.involvementLevel === 'strategic' && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
            </div>
          </label>

          {/* Passive */}
          <label className={`relative flex cursor-pointer rounded-xl border p-4 transition-all ${
            data.involvementLevel === 'passive' 
              ? 'border-kizuna-primary bg-kizuna-surface ring-1 ring-kizuna-primary' 
              : 'border-kizuna-border bg-white hover:border-zinc-300'
          }`}>
            <input 
              type="radio" 
              name="involvementLevel" 
              value="passive" 
              className="sr-only"
              checked={data.involvementLevel === 'passive'}
              onChange={() => updateData({ involvementLevel: 'passive' })}
            />
            <div className="flex w-full items-center justify-between">
              <span className="text-sm font-medium text-kizuna-text-main">
                Passive (Capital & Dashboard monitoring only)
              </span>
              <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                data.involvementLevel === 'passive' ? 'border-kizuna-primary bg-kizuna-primary' : 'border-zinc-300'
              }`}>
                {data.involvementLevel === 'passive' && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
            </div>
          </label>
        </div>
      </div>

    </div>
  )
}
