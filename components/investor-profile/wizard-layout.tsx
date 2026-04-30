import * as React from "react"
import { CheckCircle2 } from "lucide-react"

interface WizardLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onNext?: () => void;
  isNextDisabled?: boolean;
  isLastStep?: boolean;
  title: string;
  subtitle: string;
}

export function WizardLayout({
  children,
  currentStep,
  totalSteps,
  onBack,
  onNext,
  isNextDisabled,
  isLastStep,
  title,
  subtitle
}: WizardLayoutProps) {
  return (
    <div className="min-h-screen bg-kizuna-surface flex pt-16">
      <div className="max-w-6xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-24">
        
        {/* Left Side: Motivational Counter & Progress */}
        <div className="lg:col-span-4 flex flex-col space-y-8 pt-8">
          <div>
            <h1 className="text-3xl font-semibold text-kizuna-text-main mb-3">
              Kizuna Hub
            </h1>
            <p className="text-kizuna-text-muted text-base">
              Set up your investment thesis to find the perfect startup matches.
            </p>
          </div>

          <div className="p-6 bg-white border border-kizuna-border rounded-2xl shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-green-50 text-kizuna-primary rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-kizuna-text-muted">Live Ecosystem</p>
                <p className="text-xl font-semibold text-kizuna-text-main">
                  15 matching startups
                </p>
              </div>
            </div>
            <p className="text-sm text-kizuna-text-muted">
              Found based on early indications. Complete your profile to see your tailored deal flow.
            </p>
          </div>
          
          {/* Progress Bar Elements */}
          <div className="space-y-3 pt-6">
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="text-kizuna-text-main">Step {currentStep} of {totalSteps}</span>
              <span className="text-kizuna-text-muted">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="flex space-x-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
                    i + 1 <= currentStep ? "bg-kizuna-primary" : "bg-zinc-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: The Form Container ("The Paper") */}
        <div className="lg:col-span-8">
          <div className="bg-kizuna-canvas border border-kizuna-border rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
            {/* Header */}
            <div className="px-10 py-8 border-b border-zinc-100">
              <h2 className="text-2xl font-semibold text-kizuna-text-main">{title}</h2>
              <p className="text-kizuna-text-muted mt-2">{subtitle}</p>
            </div>
            
            {/* Content Body */}
            <div className="flex-1 p-10">
              {children}
            </div>

            {/* Bottom Navigation */}
            <div className="px-10 py-6 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between">
              {onBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="text-zinc-500 hover:text-zinc-900 font-medium transition-colors px-4 py-2"
                >
                  Back
                </button>
              ) : <div />}
              
              <button
                type="button"
                onClick={onNext}
                disabled={isNextDisabled}
                className={`bg-kizuna-primary text-white rounded-lg px-6 py-3 font-medium transition-opacity ${
                  isNextDisabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
                }`}
              >
                {isLastStep ? "Complete Profile" : "Next Step"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
