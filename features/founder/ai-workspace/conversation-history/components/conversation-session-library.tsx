"use client";

import React from "react";
import { MessageSquarePlus, Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { ConversationSession } from "../../types/long-run-workspace.types";
import {
  conversationSessionTypeLabels,
  type ConversationSessionFilter,
  type FounderConversationSessionType,
} from "../types/conversation-session.types";
import { filterMentorConversationSessions } from "../services/conversation-session-selector";
import { ConversationSessionRow } from "./conversation-session-row";

const sessionTypes = Object.keys(
  conversationSessionTypeLabels,
) as FounderConversationSessionType[];

export function ConversationSessionLibrary({
  sessions,
  selectedSessionId,
  query,
  filter,
  scrollTop,
  onQueryChange,
  onFilterChange,
  onScrollPositionChange,
  onOpenSession,
  onTogglePin,
  onCreateSession,
}: {
  sessions: ConversationSession[];
  selectedSessionId?: string;
  query: string;
  filter: ConversationSessionFilter;
  scrollTop: number;
  onQueryChange: (query: string) => void;
  onFilterChange: (filter: ConversationSessionFilter) => void;
  onScrollPositionChange: (scrollTop: number) => void;
  onOpenSession: (sessionId: string) => void;
  onTogglePin: (sessionId: string) => void;
  onCreateSession: (type: FounderConversationSessionType) => void;
}) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const visibleSessions = React.useMemo(
    () => filterMentorConversationSessions(sessions, query, filter),
    [filter, query, sessions],
  );

  React.useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);

  const hasSessions = sessions.some(
    (session) => !session.isArchived && session.historyType,
  );

  return (
    <section
      ref={scrollRef}
      aria-labelledby="conversation-history-heading"
      onScroll={(event) =>
        onScrollPositionChange(event.currentTarget.scrollTop)
      }
      className="no-scrollbar min-h-0 flex-1 overflow-y-auto"
    >
      <div className="mx-auto w-full max-w-4xl px-4 pb-10 pt-3 sm:px-6 sm:pt-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 max-w-2xl">
            <p className="workspace-eyebrow text-primary">
              Hỗ trợ founder
            </p>
            <h1
              id="conversation-history-heading"
              className="mt-1 workspace-page-title text-ink"
            >
              Lịch sử trao đổi
            </h1>
            <p className="mt-2 workspace-supporting text-workspace-muted-text">
              Xem lại những nội dung bạn đã trao đổi với Kizuna về
              mentor, kết nối và chuẩn bị phiên làm việc.
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="shrink-0"
              >
                <MessageSquarePlus className="size-4" />
                Cuộc trao đổi mới
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {sessionTypes.map((type) => (
                <DropdownMenuItem
                  key={type}
                  onSelect={() => onCreateSession(type)}
                >
                  {conversationSessionTypeLabels[type]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-[minmax(0,1fr)_12rem]">
          <label className="relative block">
            <span className="sr-only">Tìm trong lịch sử</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-workspace-muted-text"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Tìm trong lịch sử…"
              className="pl-9"
            />
          </label>

          <Select
            value={filter}
            onValueChange={(value) =>
              onFilterChange(value as ConversationSessionFilter)
            }
          >
            <SelectTrigger aria-label="Lọc theo loại trao đổi">
              <SelectValue placeholder="Loại trao đổi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {sessionTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {conversationSessionTypeLabels[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {visibleSessions.length > 0 ? (
          <ul className="mt-4 space-y-2" aria-label="Các cuộc trao đổi">
            {visibleSessions.map((session) => (
              <ConversationSessionRow
                key={session.id}
                session={session}
                selected={session.id === selectedSessionId}
                onOpen={() => onOpenSession(session.id)}
                onTogglePin={() => onTogglePin(session.id)}
              />
            ))}
          </ul>
        ) : (
          <div
            role="status"
            className="mt-5 rounded-xl border border-workspace-border bg-workspace-panel px-5 py-12 text-center"
          >
            <Sparkles className="mx-auto size-5 text-primary" />
            <h2 className="mt-3 workspace-section-title text-ink">
              {hasSessions
                ? "Không tìm thấy cuộc trao đổi phù hợp."
                : "Chưa có cuộc trao đổi nào."}
            </h2>
            <p className="mx-auto mt-2 max-w-md workspace-supporting text-workspace-muted-text">
              {hasSessions
                ? "Thử từ khóa khác hoặc thay đổi bộ lọc."
                : "Các nội dung bạn hỏi Kizuna về mentor và chuẩn bị phiên làm việc sẽ xuất hiện tại đây."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
