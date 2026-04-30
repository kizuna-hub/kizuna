"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { WizardLayout } from "@/components/investor-profile/wizard-layout"
import { VerificationStep } from "@/components/investor-profile/steps/verification-step"
import { ThesisStep } from "@/components/investor-profile/steps/thesis-step"
import { ValueAddStep } from "@/components/investor-profile/steps/value-add-step"

export default function InvestorProfileSetupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  
  const [formData, setFormData] = React.useState({
    // Step 1
    investorType: "",
    linkedInUrl: "",
    // Step 2
    sectors: [] as string[],
    stages: [] as string[],
    ticketSize: 50,
    // Step 3
    expertise: [] as string[],
    involvement: ""
  })

  const updateFormData = (newData: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...newData }))
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1)
    } else {
      // Final Submit -> Redirect to dashboard
      console.log("Submitting Profile:", formData)
      router.push("/investor-dashboard")
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  // Validation logic
  const isNextDisabled = () => {
    if (currentStep === 1) {
      return !formData.investorType || !formData.linkedInUrl
    }
    if (currentStep === 2) {
      return formData.sectors.length === 0 || formData.stages.length === 0
    }
    if (currentStep === 3) {
      return !formData.involvement || formData.expertise.length === 0
    }
    return false
  }

  // Dynamic headings per step
  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return {
          title: "Verify Your Identity",
          subtitle: "Tell us a bit about who you are as an investor.",
          component: <VerificationStep data={formData} updateData={updateFormData} />
        }
      case 2:
        return {
          title: "Your Investment Thesis",
          subtitle: "What kind of startups get you excited?",
          component: <ThesisStep data={formData} updateData={updateFormData} />
        }
      case 3:
        return {
          title: "Value & Involvement",
          subtitle: "How hands-on are you after signing the term sheet?",
          component: <ValueAddStep data={formData} updateData={updateFormData} />
        }
      default:
        return { title: "", subtitle: "", component: null }
    }
  }

  const stepContent = getStepContent()

  return (
    <WizardLayout
      currentStep={currentStep}
      totalSteps={3}
      onBack={currentStep > 1 ? handleBack : undefined}
      onNext={handleNext}
      isNextDisabled={isNextDisabled()}
      isLastStep={currentStep === 3}
      title={stepContent.title}
      subtitle={stepContent.subtitle}
    >
      {stepContent.component}
    </WizardLayout>
  )
}
