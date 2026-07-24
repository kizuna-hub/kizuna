"use client";

import React from "react";
import { DiscoverCard } from "./discover-card";
import { DISCOVER_FEED } from "./data";

export function DiscoverFeed() {
    return (
        <div className="py-6">
            <div className="columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
                {DISCOVER_FEED.map((post) => (
                    <DiscoverCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}