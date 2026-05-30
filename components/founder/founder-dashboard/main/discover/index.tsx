"use client";

import React from "react";
import { DiscoverHeader } from "./discover-header";
import { DiscoverFeed } from "./discover-feed";

// Gộp lại thành 1 component chính để xuất ra cho page.tsx xài
export function DiscoverMain() {
    return (
        <div className="mx-auto flex flex-col max-w-5xl h-full bg-[#fafafa]">
            <DiscoverHeader />
            <DiscoverFeed />
        </div>
    );
}

// Nếu mày muốn export từng mảnh nhỏ ra ngoài luôn để tái sử dụng ở chỗ khác:
export * from "./discover-header";
export * from "./discover-feed";
export * from "./discover-card";