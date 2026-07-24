"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Database, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SlidePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData?: Record<string, string>;
  sections?: Array<{ id: string; title: string }>;
  generatedSlides?: Array<{
    id: string;
    title: string;
    subtitle: string;
    bullets: string[];
    speakerNote: string;
  }>;
  onExportPdf?: () => Promise<void> | void;
  onSendToDataRoom?: () => Promise<void> | void;
  sentToDataRoom?: boolean;
}

type PreviewSlide = {
  type: "intro" | "content" | "generated";
  title: string;
  content: string;
  bullets?: string[];
  speakerNote?: string;
};

export function SlidePreviewModal({
  isOpen,
  onClose,
  projectData = { name: "Kizuna Hub" },
  sections = [],
  generatedSlides,
  onExportPdf,
  onSendToDataRoom,
  sentToDataRoom = false,
}: SlidePreviewModalProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [exportQueued, setExportQueued] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0);
      setExportQueued(false);
      setIsExporting(false);
      setIsSending(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const slides: PreviewSlide[] = generatedSlides?.length
    ? generatedSlides.map((slide) => ({
        type: "generated" as const,
        title: slide.title,
        content: slide.subtitle,
        bullets: slide.bullets,
        speakerNote: slide.speakerNote,
      }))
    : [
        { type: "intro" as const, title: projectData.name, content: projectData.tagline || "Breakthrough idea prepared in Kizuna Hub" },
        ...sections.map((section) => ({
          type: "content" as const,
          title: section.title,
          content: projectData[section.id] || "No content has been added for this section yet.",
        })),
      ];

  const nextSlide = () => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(prev - 1, 0));
  const handleExportPdf = async () => {
    if (isExporting) return;
    setIsExporting(true);
    await onExportPdf?.();
    setExportQueued(true);
    setIsExporting(false);
  };
  const handleSendToDataRoom = async () => {
    if (isSending || sentToDataRoom) return;
    setIsSending(true);
    await onSendToDataRoom?.();
    setIsSending(false);
  };

  return (
    <div className="fixed inset-0 z-modal flex flex-col bg-canvas text-ink">
      <header className="flex min-h-16 items-center justify-between gap-4 border-b border-hairline bg-surface-1 px-4 md:px-6">
        <div className="min-w-0">
          <p className="text-caption font-bold uppercase tracking-[0.14em] text-accent-blue">AI pitch deck generated</p>
          <h3 className="truncate text-body-framer-sm font-bold text-ink">{projectData.name} pitch deck presentation</h3>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportPdf}
            disabled={isExporting}
          >
            <Download className="size-3.5" />
            {isExporting ? "Preparing mock PDF..." : exportQueued ? "PDF prepared" : "Export PDF"}
          </Button>
          {onSendToDataRoom ? (
            <Button variant="secondary" size="sm" onClick={handleSendToDataRoom} disabled={sentToDataRoom || isSending}>
              <Database className="size-3.5" />
              {isSending ? "Sending deck to Data Room..." : sentToDataRoom ? "Sent" : "Send to Data Room"}
            </Button>
          ) : null}
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close slide preview">
            <X className="size-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center p-4 md:p-8">
        <div className="relative flex aspect-video w-full max-w-5xl flex-col justify-between overflow-hidden rounded-xl border border-hairline bg-surface-1 p-6 shadow-2xl md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_34%)]" />
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">Kizuna presentation style</span>
            <span className="font-mono text-caption font-bold text-ink-muted">{currentSlide + 1} / {slides.length}</span>
          </div>

          <div className="relative z-10 my-auto max-w-3xl">
            {slides[currentSlide].type === "intro" ? (
              <div>
                <h1 className="font-display text-display-lg text-ink md:text-display-xl">{slides[currentSlide].title}</h1>
                <div className="my-5 h-1 w-24 rounded-full bg-ink" />
                <p className="text-subhead text-ink-muted">{slides[currentSlide].content}</p>
              </div>
            ) : slides[currentSlide].type === "generated" ? (
              <div>
                <h2 className="font-display text-display-md text-ink md:text-display-lg">{slides[currentSlide].title}</h2>
                <p className="mt-3 text-subhead text-ink-muted">{slides[currentSlide].content}</p>
                <ul className="mt-6 space-y-3 rounded-xl border border-hairline bg-surface-2 p-5">
                  {slides[currentSlide].bullets?.map((bullet: string) => (
                    <li key={bullet} className="text-body-framer text-ink-muted">{bullet}</li>
                  ))}
                </ul>
                <p className="mt-4 text-caption text-ink-muted">{slides[currentSlide].speakerNote}</p>
              </div>
            ) : (
              <div>
                <h2 className="font-display text-display-md text-ink md:text-display-lg">{slides[currentSlide].title}</h2>
                <p className="mt-5 whitespace-pre-line rounded-xl border border-hairline bg-surface-2 p-5 text-body-framer text-ink-muted">
                  {slides[currentSlide].content}
                </p>
              </div>
            )}
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-hairline pt-4">
            <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">{projectData.name} 2026</p>
            <p className="text-caption font-bold uppercase tracking-[0.14em] text-ink-muted">
              {exportQueued ? "PDF export queued" : "Confidential"}
            </p>
          </div>
        </div>
      </div>

      <footer className="flex min-h-20 items-center justify-center gap-5 border-t border-hairline bg-surface-1 px-4">
        <Button variant="secondary" size="icon" onClick={prevSlide} disabled={currentSlide === 0} aria-label="Previous slide">
          <ChevronLeft className="size-5" />
        </Button>
        <div className="h-2 w-44 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-ink transition-all" style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }} />
        </div>
        <Button variant="secondary" size="icon" onClick={nextSlide} disabled={currentSlide === slides.length - 1} aria-label="Next slide">
          <ChevronRight className="size-5" />
        </Button>
      </footer>
    </div>
  );
}
