"use client";

import { useState, useMemo } from "react";
import { MentorCard } from "@/components/feed/mentor-hub/mentor-card";
import { MentorFilters } from "@/components/feed/mentor-hub/mentor-filters";

// Mock mentor data
const MENTORS = [
    {
        id: "1",
        name: "Dr. Alex Chen",
        role: "Product Strategy Director",
        company: "DNES",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        rating: 4.9,
        sessions: 120,
        expertise: ["AI", "MVP", "Product"],
        industry: "ai",
        expertiseArea: "product",
        availability: "available",
    },
    {
        id: "2",
        name: "Sarah Johnson",
        role: "Growth & Marketing Lead",
        company: "Youth Co:Lab",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        rating: 4.8,
        sessions: 98,
        expertise: ["Growth", "Marketing", "Strategy"],
        industry: "edtech",
        expertiseArea: "marketing",
        availability: "week",
    },
    {
        id: "3",
        name: "Marcus Lee",
        role: "Fundraising & Business Dev",
        company: "Tech Ventures",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
        rating: 4.7,
        sessions: 156,
        expertise: ["Fundraising", "Business Dev", "Pitch"],
        industry: "fintech",
        expertiseArea: "fundraising",
        availability: "available",
    },
    {
        id: "4",
        name: "Emma Rodriguez",
        role: "AI/ML Specialist",
        company: "AI Research Hub",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
        rating: 4.9,
        sessions: 87,
        expertise: ["AI", "Machine Learning", "Tech"],
        industry: "ai",
        expertiseArea: "product",
        availability: "month",
    },
    {
        id: "5",
        name: "David Patel",
        role: "EdTech Innovation Lead",
        company: "Education First",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        rating: 4.6,
        sessions: 112,
        expertise: ["EdTech", "Product", "UX"],
        industry: "edtech",
        expertiseArea: "product",
        availability: "available",
    },
    {
        id: "6",
        name: "Jessica Wang",
        role: "Fintech Product Manager",
        company: "Payment Systems Inc",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
        rating: 4.8,
        sessions: 134,
        expertise: ["FinTech", "Payments", "Product"],
        industry: "fintech",
        expertiseArea: "product",
        availability: "week",
    },
    {
        id: "7",
        name: "Thomas Chen",
        role: "Marketing & Brand Strategist",
        company: "Growth Agency",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas",
        rating: 4.7,
        sessions: 105,
        expertise: ["Marketing", "Branding", "Strategy"],
        industry: "ai",
        expertiseArea: "marketing",
        availability: "available",
    },
    {
        id: "8",
        name: "Rachel Kim",
        role: "Venture Capital Advisor",
        company: "VC Partners",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel",
        rating: 4.9,
        sessions: 178,
        expertise: ["Fundraising", "Strategy", "Pitch"],
        industry: "fintech",
        expertiseArea: "fundraising",
        availability: "available",
    },
    {
        id: "9",
        name: "Michael Torres",
        role: "Product Design Lead",
        company: "Design Studios",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        rating: 4.6,
        sessions: 92,
        expertise: ["UX/UI", "Product", "Design"],
        industry: "edtech",
        expertiseArea: "product",
        availability: "month",
    },
];

export default function MentorHubPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIndustry, setSelectedIndustry] = useState("");
    const [selectedExpertise, setSelectedExpertise] = useState("");
    const [selectedAvailability, setSelectedAvailability] = useState("");

    const filteredMentors = useMemo(() => {
        return MENTORS.filter((mentor) => {
            const matchesSearch =
                searchQuery === "" ||
                mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                mentor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                mentor.company.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesIndustry = selectedIndustry === "" || mentor.industry === selectedIndustry;
            const matchesExpertise = selectedExpertise === "" || mentor.expertiseArea === selectedExpertise;
            const matchesAvailability = selectedAvailability === "" || mentor.availability === selectedAvailability;

            return matchesSearch && matchesIndustry && matchesExpertise && matchesAvailability;
        });
    }, [searchQuery, selectedIndustry, selectedExpertise, selectedAvailability]);

    return (
        <div className="flex flex-col gap-8 w-full">
            {/* Header */}
            <div className="border-b border-border pb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">Mentor Hub</h1>
                <p className="text-muted-foreground">
                    Connect with industry experts from DNES, Youth Co:Lab, and leading tech firms.
                </p>
            </div>

            {/* Filters */}
            <MentorFilters
                onSearch={setSearchQuery}
                onIndustryChange={setSelectedIndustry}
                onExpertiseChange={setSelectedExpertise}
                onAvailabilityChange={setSelectedAvailability}
            />

            {/* Results Info & Grid */}
            <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                    Showing {filteredMentors.length} of {MENTORS.length} mentors
                </p>

                {filteredMentors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredMentors.map((mentor) => (
                            <MentorCard
                                key={mentor.id}
                                id={mentor.id}
                                name={mentor.name}
                                role={mentor.role}
                                company={mentor.company}
                                avatar={mentor.avatar}
                                rating={mentor.rating}
                                sessions={mentor.sessions}
                                expertise={mentor.expertise}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">No mentors found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
