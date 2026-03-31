"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface MentorFiltersProps {
    onSearch: (query: string) => void;
    onIndustryChange: (industry: string) => void;
    onExpertiseChange: (expertise: string) => void;
    onAvailabilityChange: (availability: string) => void;
}

export function MentorFilters({
    onSearch,
    onIndustryChange,
    onExpertiseChange,
    onAvailabilityChange,
}: MentorFiltersProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        onSearch(value);
    };

    return (
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, role, or company..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-10 bg-background border-border"
                    />
                </div>

                <Select onValueChange={onIndustryChange}>
                    <SelectTrigger className="bg-background border-border w-full md:w-[180px]">
                        <SelectValue placeholder="Industry" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Industries</SelectItem>
                        <SelectItem value="ai">AI</SelectItem>
                        <SelectItem value="fintech">FinTech</SelectItem>
                        <SelectItem value="edtech">EdTech</SelectItem>
                    </SelectContent>
                </Select>

                <Select onValueChange={onExpertiseChange}>
                    <SelectTrigger className="bg-background border-border w-full md:w-[180px]">
                        <SelectValue placeholder="Expertise" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Expertise</SelectItem>
                        <SelectItem value="fundraising">Fundraising</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                </Select>

                <Select onValueChange={onAvailabilityChange}>
                    <SelectTrigger className="bg-background border-border w-full md:w-[180px]">
                        <SelectValue placeholder="Availability" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Times</SelectItem>
                        <SelectItem value="available">Available Now</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
