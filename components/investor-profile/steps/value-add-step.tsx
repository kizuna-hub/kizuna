import * as React from "react"
import { SelectablePill } from "@/components/ui/selectable-pill"
import { Users, Briefcase, BarChart3 } from "lucide-react"

interface ValueAddStepProps {
  data: {
    expertise: string[];
    involvement: string;
  };
  updateData: (data: Partial<ValueAddStepProps["data"]>) => void;
}

const EXPERTISE_TAGS = ["Marketing", "Technical", "Legal", "Fundraising", "GTM Strategy"]

export function ValueAddStep({ data, updateData }: ValueAddStepProps) {
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
          <h3 className="text-sm font-medium text-kizuna-text-main">Expertise & Value Add</h3>
          <p className="text-sm text-kizuna-text-muted mt-1">
            How do you support your portfolio companies beyond capital?
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
          <h3 className="text-sm font-medium text-kizuna-text-main">Preferred Involvement Level</h3>
          <p className="text-sm text-kizuna-text-muted mt-1">
            Choose the dynamic that best fits your schedule and style.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 pt-2">
          {/* Option A */}
          <label className={`relative flex cursor-pointer rounded-2xl border p-6 transition-all ${
            data.involvement === 'active' 
              ? 'border-kizuna-primary ring-1 ring-kizuna-primary bg-green-50/30' 
              : 'border-kizuna-border hover:border-zinc-300 bg-white'
          }`}>
            <input 
              type="radio" 
              name="involvement" 
              value="active" 
              className="sr-only"
              checked={data.involvement === 'active'}
              onChange={() => updateData({ involvement: 'active' })}
            />
            <div className="flex w-full items-start">
              <div className="flex-shrink-0 mr-4 mt-1">
                <Users className={`w-6 h-6 ${data.involvement === 'active' ? 'text-kizuna-primary' : 'text-zinc-400'}`} />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-kizuna-text-main">Active Mentor</h4>
                <p className="mt-1 text-sm text-kizuna-text-muted">
                  I'm willing to do regular 1-on-1 sessions and actively advise on operations.
                </p>
              </div>
              <div className={`mt-1 h-5 w-5 rounded-full border flex items-center justify-center ${
                data.involvement === 'active' ? 'border-kizuna-primary bg-kizuna-primary' : 'border-zinc-300'
              }`}>
                {data.involvement === 'active' && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
            </div>
          </label>

          {/* Option B */}
          <label className={`relative flex cursor-pointer rounded-2xl border p-6 transition-all ${
            data.involvement === 'board' 
              ? 'border-kizuna-primary ring-1 ring-kizuna-primary bg-green-50/30' 
              : 'border-kizuna-border hover:border-zinc-300 bg-white'
          }`}>
            <input 
              type="radio" 
              name="involvement" 
              value="board" 
              className="sr-only"
              checked={data.involvement === 'board'}
              onChange={() => updateData({ involvement: 'board' })}
            />
            <div className="flex w-full items-start">
              <div className="flex-shrink-0 mr-4 mt-1">
                <Briefcase className={`w-6 h-6 ${data.involvement === 'board' ? 'text-kizuna-primary' : 'text-zinc-400'}`} />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-kizuna-text-main">Board Member</h4>
                <p className="mt-1 text-sm text-kizuna-text-muted">
                  Strategic guidance only. I want to assist with high-level decisions and governance.
                </p>
              </div>
              <div className={`mt-1 h-5 w-5 rounded-full border flex items-center justify-center ${
                data.involvement === 'board' ? 'border-kizuna-primary bg-kizuna-primary' : 'border-zinc-300'
              }`}>
                {data.involvement === 'board' && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
            </div>
          </label>

          {/* Option C */}
          <label className={`relative flex cursor-pointer rounded-2xl border p-6 transition-all ${
            data.involvement === 'silent' 
              ? 'border-kizuna-primary ring-1 ring-kizuna-primary bg-green-50/30' 
              : 'border-kizuna-border hover:border-zinc-300 bg-white'
          }`}>
            <input 
              type="radio" 
              name="involvement" 
              value="silent" 
              className="sr-only"
              checked={data.involvement === 'silent'}
              onChange={() => updateData({ involvement: 'silent' })}
            />
            <div className="flex w-full items-start">
              <div className="flex-shrink-0 mr-4 mt-1">
                <BarChart3 className={`w-6 h-6 ${data.involvement === 'silent' ? 'text-kizuna-primary' : 'text-zinc-400'}`} />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-kizuna-text-main">Silent Capital</h4>
                <p className="mt-1 text-sm text-kizuna-text-muted">
                  I prefer to provide capital and track progress passively via the dashboard.
                </p>
              </div>
              <div className={`mt-1 h-5 w-5 rounded-full border flex items-center justify-center ${
                data.involvement === 'silent' ? 'border-kizuna-primary bg-kizuna-primary' : 'border-zinc-300'
              }`}>
                {data.involvement === 'silent' && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
            </div>
          </label>
        </div>
      </div>

    </div>
  )
}
