import * as React from "react"

interface VerificationStepProps {
  data: {
    investorType: string;
    linkedInUrl: string;
  };
  updateData: (data: Partial<VerificationStepProps["data"]>) => void;
}

export function VerificationStep({ data, updateData }: VerificationStepProps) {
  const investorTypes = ["Angel", "VC", "Syndicate", "Corporate"]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-kizuna-text-main">
          Investor Type
        </label>
        <div className="relative">
          <select
            value={data.investorType}
            onChange={(e) => updateData({ investorType: e.target.value })}
            className="w-full appearance-none bg-white border border-kizuna-border rounded-xl px-4 py-3.5 text-kizuna-text-main focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all"
          >
            <option value="" disabled>Select your investor type</option>
            {investorTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-zinc-400">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-kizuna-text-main">
          LinkedIn URL or Portfolio Link
        </label>
        <input
          type="url"
          value={data.linkedInUrl}
          onChange={(e) => updateData({ linkedInUrl: e.target.value })}
          placeholder="https://linkedin.com/in/..."
          className="w-full bg-white border border-kizuna-border rounded-xl px-4 py-3.5 text-kizuna-text-main placeholder:text-zinc-400 focus:outline-none focus:border-kizuna-primary focus:ring-1 focus:ring-kizuna-primary transition-all"
        />
        <p className="text-sm text-kizuna-text-muted">
          Required for verification to maintain ecosystem quality.
        </p>
      </div>
    </div>
  )
}
