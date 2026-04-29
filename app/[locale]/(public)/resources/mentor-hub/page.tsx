"use client";

import { useState, useMemo } from "react";
import { MentorCard } from "@/components/mentor-hub/mentor-card";
import { MentorFilters } from "@/components/mentor-hub/mentor-filters";
import { motion } from "framer-motion";

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
        bio: "Passionate about helping early-stage startups navigate product-market fit, particularly in AI and SaaS. Let's talk about MVP development and your go-to-market strategy.",
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
        bio: "Specializing in zero-to-one growth marketing. I help founders build scalable acquisition channels and craft compelling brand narratives to attract users.",
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
        bio: "Former VC turned founder. I can help you prepare your pitch deck, understand term sheets, and navigate the fundraising process from pre-seed to Series A.",
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
        bio: "Deep technical expertise in machine learning and data architecture. I advise founders on building scalable tech stacks and practical AI integration.",
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
        bio: "10+ years in EdTech. I help founders design engaging learning experiences and navigate the complex B2B education sales cycle.",
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
        bio: "Product leader with expertise in fintech compliance and cross-border payments. Ready to help you streamline your core financial user experience.",
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
        bio: "Award-winning strategist. Let's refine your brand positioning, optimize your performance marketing spend, and define your core messaging.",
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
        bio: "Active angel investor. I provide actionable feedback on your financial model, pitch delivery, and overall business strategy to secure investment.",
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
        bio: "Obsessed with pixel-perfect design and intuitive UX. I can review your product interface, wireframes, and guide your overall design system.",
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
                searchQuery={searchQuery}
                onSearch={setSearchQuery}
                industry={selectedIndustry}
                onIndustryChange={setSelectedIndustry}
                expertise={selectedExpertise}
                onExpertiseChange={setSelectedExpertise}
                availability={selectedAvailability}
                onAvailabilityChange={setSelectedAvailability}
            />

            {/* Results Info & Grid */}
            <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                    Showing {filteredMentors.length} of {MENTORS.length} mentors
                </p>

                {filteredMentors.length > 0 ? (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                        {filteredMentors.map((mentor) => (
                            <motion.div
                                key={mentor.id}
                                layout
                                className="flex w-full h-full"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                                }}
                            >
                                <MentorCard
                                    id={mentor.id}
                                    name={mentor.name}
                                    role={mentor.role}
                                    company={mentor.company}
                                    avatar={mentor.avatar}
                                    rating={mentor.rating}
                                    bio={mentor.bio}
                                    sessions={mentor.sessions}
                                    expertise={mentor.expertise}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">No mentors found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
