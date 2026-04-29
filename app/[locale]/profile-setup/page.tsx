"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { WizardLayout } from "@/components/profile-setup/wizard-layout"
import { RoleStep } from "@/components/profile-setup/steps/role-step"
import { ThesisStep } from "@/components/profile-setup/steps/thesis-step"
import { ExpertiseStep } from "@/components/profile-setup/steps/expertise-step"

export default function ProfileSetupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  
  const [formData, setFormData] = React.useState({
    // Step 1
    roles: [] as string[],
    // Step 2
    sectors: [] as string[],
    stages: [] as string[],
    ticketSize: 50,
    // Step 3
    expertise: [] as string[],
    involvementLevel: ""
  })

  const updateFormData = (newData: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...newData }))
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1)
    } else {
      // Final Submit
      console.log("Submitting VIP Profile:", formData)
      router.push("/investor-dashboard") // Route to dashboard after completion
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
      return formData.roles.length === 0
    }
    if (currentStep === 2) {
      return formData.sectors.length === 0 || formData.stages.length === 0
    }
    if (currentStep === 3) {
      return !formData.involvementLevel || formData.expertise.length === 0
    }
    return false
  }

  // Dynamic headings per step
  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return {
          title: "Select Your Roles",
          subtitle: "You can be an investor, a mentor, or a corporate partner. Choose all that apply.",
          component: <RoleStep data={formData} updateData={updateFormData} />
        }
      case 2:
        return {
          title: "Focus & Thesis",
          subtitle: "Define where you want to make an impact.",
          component: <ThesisStep data={formData} updateData={updateFormData} />
        }
      case 3:
        return {
          title: "Expertise & Value-Add",
          subtitle: "How will you contribute to the ecosystem?",
          component: <ExpertiseStep data={formData} updateData={updateFormData} />
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
