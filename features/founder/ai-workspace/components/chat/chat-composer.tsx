"use client";

import React from "react";
import { ArrowUp, Mic, Paperclip } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import type { AiWorkspaceCopy } from "../../copy/types";
import type {
  AiModelId,
  MockAttachment,
} from "../../types/ai-workspace.types";
import { AiModelSelector } from "./ai-model-selector";
import { AttachmentPicker } from "./attachment-picker";
import { SuggestedPrompts } from "./suggested-prompts";

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionResultListLike {
  length: number;
  [index: number]: SpeechRecognitionResultLike;
}

interface SpeechRecognitionEventLike extends Event {
  results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult:
    | ((event: SpeechRecognitionEventLike) => void)
    | null;
  onerror:
    | ((event: SpeechRecognitionErrorEventLike) => void)
    | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor =
  new () => SpeechRecognitionLike;

export function ChatComposer({
  prompts,
  attachments,
  disabled,
  copy,
  onSend,
  onSelectSample,
  onSelectFiles,
  onRemoveAttachment,
  value: controlledValue,
  onValueChange,
  selectedModel,
  onModelChange,
  idPrefix = "founder-ai",
  focusRequestKey,
  placeholder,
}: {
  prompts: string[];
  attachments: MockAttachment[];
  disabled: boolean;
  copy: AiWorkspaceCopy;
  onSend: (message: string) => void;
  onSelectSample: (sampleId: string) => void;
  onSelectFiles: (files: FileList | null) => void;
  onRemoveAttachment: (attachmentId: string) => void;
  value?: string;
  onValueChange?: (value: string) => void;
  selectedModel: AiModelId;
  onModelChange: (modelId: AiModelId) => void;
  idPrefix?: string;
  focusRequestKey?: number;
  placeholder?: string;
}) {
  const [internalValue, setInternalValue] = React.useState("");
  const [listening, setListening] = React.useState(false);
  const [voiceNotice, setVoiceNotice] = React.useState("");
  const recognitionRef =
    React.useRef<SpeechRecognitionLike | null>(null);
  const textareaRef =
    React.useRef<HTMLTextAreaElement | null>(null);
  const value = controlledValue ?? internalValue;
  const setValue = (nextValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(nextValue);
    }
    onValueChange?.(nextValue);
  };
  const [attachmentsOpen, setAttachmentsOpen] =
    React.useState(false);
  const displayedPrompts = attachments.some(
    (attachment) => attachment.status === "ready",
  )
    ? [
        copy.chat.analyzeSelected,
        ...prompts.filter(
          (prompt) => prompt !== copy.chat.analyzeSelected,
        ),
      ].slice(0, 3)
    : prompts;

  const submit = () => {
    const message = value.trim();
    if (!message || disabled) return;
    setValue("");
    onSend(message);
  };

  const toggleVoiceInput = () => {
    if (disabled) return;
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognition =
      speechWindow.SpeechRecognition ??
      speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice(copy.chat.voiceUnsupported);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "vi-VN";
    let voiceFailed = false;
    recognition.onresult = (event) => {
      const transcriptParts: string[] = [];
      for (let index = 0; index < event.results.length; index += 1) {
        const transcript =
          event.results[index]?.[0]?.transcript.trim();
        if (transcript) transcriptParts.push(transcript);
      }
      const transcript = transcriptParts.join(" ").trim();
      if (transcript) {
        setValue(
          [value.trim(), transcript].filter(Boolean).join(" "),
        );
        setVoiceNotice("");
        window.requestAnimationFrame(() =>
          textareaRef.current?.focus(),
        );
      }
    };
    recognition.onerror = (event) => {
      voiceFailed = true;
      setVoiceNotice(
        event.error === "no-speech"
          ? copy.chat.voiceNoSpeech
          : copy.chat.voiceError,
      );
      setListening(false);
    };
    recognition.onend = () => {
      if (!voiceFailed) setVoiceNotice("");
      setListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    setVoiceNotice(copy.chat.voiceListening);
    setListening(true);
    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setListening(false);
      setVoiceNotice(copy.chat.voiceError);
    }
  };

  React.useEffect(
    () => () => recognitionRef.current?.abort(),
    [],
  );

  React.useEffect(() => {
    if (focusRequestKey === undefined) return;
    window.requestAnimationFrame(() =>
      textareaRef.current?.focus(),
    );
  }, [focusRequestKey]);

  const messageInputId = `${idPrefix}-message`;
  const voiceStatusId = `${idPrefix}-voice-status`;

  return (
    <div className="space-y-2.5">
      <SuggestedPrompts
        prompts={displayedPrompts}
        onSelect={onSend}
        disabled={disabled}
        label={copy.chat.suggestedPromptsLabel}
      />
      <AttachmentPicker
        open={attachmentsOpen}
        attachments={attachments}
        copy={copy.chat}
        onSelectSample={onSelectSample}
        onSelectFiles={onSelectFiles}
        onRemove={onRemoveAttachment}
      />
      <div className="flex items-end gap-1 rounded-2xl border border-workspace-border bg-workspace-panel p-2 transition-colors focus-within:border-primary-border">
        <label htmlFor={messageInputId} className="sr-only">
          {copy.chat.composerLabel}
        </label>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="mb-0.5 shrink-0"
          aria-label={copy.chat.attach}
          aria-expanded={attachmentsOpen}
          onClick={() =>
            setAttachmentsOpen((current) => !current)
          }
        >
          <Paperclip className="size-4" />
        </Button>
        <Textarea
          ref={textareaRef}
          id={messageInputId}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
          placeholder={placeholder ?? copy.chat.composerPlaceholder}
          disabled={disabled}
          rows={1}
          className="max-h-36 min-h-10 resize-none border-0 bg-transparent px-2 py-2.5 workspace-input-text shadow-none focus-visible:ring-0"
        />
        <AiModelSelector
          value={selectedModel}
          disabled={disabled}
          onValueChange={onModelChange}
        />
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className={cn(
            "mb-0.5 shrink-0",
            listening &&
              "bg-primary-soft text-primary hover:bg-primary-soft",
          )}
          onClick={toggleVoiceInput}
          disabled={disabled}
          aria-label={copy.chat.voiceInput}
          aria-pressed={listening}
          aria-describedby={
            voiceNotice ? voiceStatusId : undefined
          }
        >
          <Mic className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          className="mb-0.5 shrink-0"
          onClick={submit}
          disabled={disabled || !value.trim()}
          aria-label={
            disabled ? copy.chat.sending : copy.chat.send
          }
        >
          <ArrowUp className="size-4" />
        </Button>
      </div>
      {voiceNotice ? (
        <p
          id={voiceStatusId}
          role="status"
          className="px-2 workspace-meta text-workspace-muted-text"
        >
          {voiceNotice}
        </p>
      ) : null}
    </div>
  );
}
