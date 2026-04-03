"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface MentorFiltersProps {
    searchQuery: string;
    onSearch: (query: string) => void;
    industry: string;
    onIndustryChange: (industry: string) => void;
    expertise: string;
    onExpertiseChange: (expertise: string) => void;
    availability: string;
    onAvailabilityChange: (availability: string) => void;
}

export function MentorFilters({
    searchQuery,
    onSearch,
    industry,
    onIndustryChange,
    expertise,
    onExpertiseChange,
    availability,
    onAvailabilityChange,
}: MentorFiltersProps) {
    const hasActiveFilters =
        searchQuery !== "" ||
        (industry !== "" && industry !== "all") ||
        (expertise !== "" && expertise !== "all") ||
        (availability !== "" && availability !== "all");

    const handleReset = () => {
        onSearch("");
        onIndustryChange("all");
        onExpertiseChange("all");
        onAvailabilityChange("all");
    };

    return (
        <div className="backdrop-blur-md bg-zinc-900/60 sticky top-16 z-30 border border-white/5 p-4 sm:p-5 mb-8 rounded-lg shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="flex-1 w-full relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search mentors..."
                        value={searchQuery}
                        onChange={(e) => onSearch(e.target.value)}
                        className="pl-10 bg-background border-border w-full transition-all duration-300"
                    />
                </div>

                <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                    <Select value={industry} onValueChange={onIndustryChange}>
                        <SelectTrigger className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 transition-colors shrink-0 w-[140px]">
                            <SelectValue placeholder="Industry" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Industries</SelectItem>
                            <SelectItem value="ai">AI</SelectItem>
                            <SelectItem value="fintech">FinTech</SelectItem>
                            <SelectItem value="edtech">EdTech</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={expertise} onValueChange={onExpertiseChange}>
                        <SelectTrigger className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 transition-colors shrink-0 w-[140px]">
                            <SelectValue placeholder="Expertise" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Expertise</SelectItem>
                            <SelectItem value="fundraising">Fundraising</SelectItem>
                            <SelectItem value="product">Product</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={availability} onValueChange={onAvailabilityChange}>
                        <SelectTrigger className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 transition-colors shrink-0 w-[140px]">
                            <SelectValue placeholder="Availability" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Times</SelectItem>
                            <SelectItem value="available">Available Now</SelectItem>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                        </SelectContent>
                    </Select>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            onClick={handleReset}
                            className="shrink-0 text-muted-foreground hover:text-primary transition-colors duration-300 px-3"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Reset
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
