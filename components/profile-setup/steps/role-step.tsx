import * as React from "react"
import { RoleCard } from "@/components/ui/role-card"
import { Briefcase, Lightbulb, Building2 } from "lucide-react"

interface RoleStepProps {
  data: {
    roles: string[];
  };
  updateData: (data: Partial<RoleStepProps["data"]>) => void;
}

export function RoleStep({ data, updateData }: RoleStepProps) {
  const toggleRole = (role: string) => {
    const newRoles = data.roles.includes(role)
      ? data.roles.filter(r => r !== role)
      : [...data.roles, role]
    updateData({ roles: newRoles })
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <RoleCard
          title="Investor / VC"
          description="I want to fund startups"
          selected={data.roles.includes("investor")}
          onClick={() => toggleRole("investor")}
          icon={<Briefcase className="w-6 h-6" />}
        />
        
        <RoleCard
          title="Mentor / Advisor"
          description="I want to guide founders"
          selected={data.roles.includes("mentor")}
          onClick={() => toggleRole("mentor")}
          icon={<Lightbulb className="w-6 h-6" />}
        />
        
        <RoleCard
          title="Corporate Partner"
          description="I am looking for talent or M&A"
          selected={data.roles.includes("corporate")}
          onClick={() => toggleRole("corporate")}
          icon={<Building2 className="w-6 h-6" />}
        />
      </div>
    </div>
  )
}
