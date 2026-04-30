'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const stages = [
    { id: 1, label: 'Lên ý tưởng', completed: true },
    { id: 2, label: 'Xây dựng Đội ngũ', completed: true },
    { id: 3, label: 'MVP', current: true, completed: false },
    { id: 4, label: 'Chuẩn bị Gọi vốn', completed: false },
    { id: 5, label: 'Gọi vốn', completed: false },
];

export default function IncubationRoadmap() {
    return (
        <section className="bg-white border border-kizuna-border rounded-2xl p-6 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-kizuna-text-main mb-8">
                Lộ trình Cố vấn Trực tuyến
            </h2>

            {/* Progress Stepper */}
            <div className="flex items-center justify-between">
                {stages.map((stage, index) => (
                    <div key={stage.id} className="flex flex-col items-center flex-1">
                        {/* Stage Indicator */}
                        <div className="flex items-center gap-4 w-full">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all flex-shrink-0 ${stage.completed
                                    ? 'bg-kizuna-primary text-white'
                                    : stage.current
                                        ? 'bg-kizuna-primary text-white ring-2 ring-kizuna-primary ring-offset-2 ring-offset-white'
                                        : 'bg-zinc-200 text-zinc-400 border-2 border-zinc-200'
                                    }`}
                            >
                                {stage.completed ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                    stage.id
                                )}
                            </div>

                            {/* Connecting Line */}
                            {index < stages.length - 1 && (
                                <div
                                    className={`flex-1 h-1 mx-2 rounded-full transition-colors ${stage.completed
                                        ? 'bg-kizuna-primary'
                                        : 'bg-zinc-200'
                                        }`}
                                />
                            )}
                        </div>

                        {/* Stage Label */}
                        <p
                            className={`text-sm font-medium mt-3 text-center ${stage.current
                                ? 'text-kizuna-primary font-bold'
                                : stage.completed
                                    ? 'text-kizuna-text-main'
                                    : 'text-zinc-400'
                                }`}
                        >
                            {stage.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Current Stage Info */}
            <div className="mt-8 p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-kizuna-primary">
                <p className="text-sm">
                    <span className="font-bold">Giai đoạn Hiện tại:</span> Bạn đang xây dựng MVP. Hãy tập trung vào các tính năng cốt lõi và kiểm chứng người dùng.
                </p>
            </div>
        </section>
    );
}
