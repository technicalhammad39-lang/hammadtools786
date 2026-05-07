'use client';

import React, { useRef, useState } from 'react';
import { Bold, Italic, Link as LinkIcon, Type, Underline } from 'lucide-react';
import { normalizeRichTextValue } from '@/lib/rich-text';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
  placeholder?: string;
  className?: string;
  rows?: number;
  maxLength?: number;
};

const colorOptions = [
  { label: 'White', value: 'white', className: 'bg-white' },
  { label: 'Yellow', value: 'yellow', className: 'bg-primary' },
  { label: 'Grey', value: 'grey', className: 'bg-[#8E8E8E]' },
] as const;

const sizeOptions = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
] as const;

function getSelectionBounds(element: HTMLTextAreaElement, fallbackLength: number) {
  return {
    start: element.selectionStart ?? fallbackLength,
    end: element.selectionEnd ?? fallbackLength,
  };
}

export default function RichTextEditor({
  value,
  onChange,
  textareaRef,
  placeholder,
  className = '',
  rows = 8,
  maxLength,
}: RichTextEditorProps) {
  const internalRef = useRef<HTMLTextAreaElement | null>(null);
  const ref = textareaRef || internalRef;
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');

  function updateValue(nextValue: string, cursorPosition?: number) {
    onChange(nextValue);
    if (typeof cursorPosition === 'number') {
      window.requestAnimationFrame(() => {
        const element = ref.current;
        if (!element) {
          return;
        }
        element.focus();
        element.setSelectionRange(cursorPosition, cursorPosition);
      });
    }
  }

  function wrapSelection(before: string, after = before, fallback = 'text') {
    const element = ref.current;
    if (!element) {
      updateValue(`${value}${before}${fallback}${after}`);
      return;
    }

    const { start, end } = getSelectionBounds(element, value.length);
    const selectedText = value.slice(start, end) || fallback;
    const next = `${value.slice(0, start)}${before}${selectedText}${after}${value.slice(end)}`;
    updateValue(next, start + before.length + selectedText.length + after.length);
  }

  function insertLink() {
    const element = ref.current;
    const { start, end } = element ? getSelectionBounds(element, value.length) : { start: value.length, end: value.length };
    const selectedText = value.slice(start, end).trim() || 'link text';
    const url = window.prompt('Enter URL', 'https://');
    if (!url || !url.trim()) {
      return;
    }
    const normalizedUrl = /^https?:\/\//i.test(url.trim()) || url.trim().startsWith('/') ? url.trim() : `https://${url.trim()}`;
    const markup = `[${selectedText}](${normalizedUrl})`;
    const next = `${value.slice(0, start)}${markup}${value.slice(end)}`;
    updateValue(next, start + markup.length);
  }

  function handlePaste(event: React.ClipboardEvent<HTMLTextAreaElement>) {
    const text = event.clipboardData.getData('text');
    if (!text || !/(https?:\/\/|www\.)/i.test(text)) {
      return;
    }

    event.preventDefault();
    const element = event.currentTarget;
    const { start, end } = getSelectionBounds(element, value.length);
    const linked = normalizeRichTextValue(text);
    const next = `${value.slice(0, start)}${linked}${value.slice(end)}`;
    updateValue(next, start + linked.length);
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-white/10 bg-black/25 px-2.5 py-2">
        <button
          type="button"
          onClick={() => wrapSelection('**', '**', 'bold text')}
          className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.03] text-brand-text/70 hover:text-primary hover:border-primary/35 grid place-items-center"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => wrapSelection('*', '*', 'italic text')}
          className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.03] text-brand-text/70 hover:text-primary hover:border-primary/35 grid place-items-center"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => wrapSelection('<u>', '</u>', 'underlined text')}
          className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.03] text-brand-text/70 hover:text-primary hover:border-primary/35 grid place-items-center"
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={insertLink}
          className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.03] text-brand-text/70 hover:text-primary hover:border-primary/35 grid place-items-center"
          title="Insert link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <div className="mx-1 h-6 w-px bg-white/10" />

        <div className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1">
          <Type className="w-3.5 h-3.5 text-brand-text/45" />
          <select
            value={selectedSize}
            onChange={(event) => {
              const nextSize = event.target.value as 'small' | 'medium' | 'large';
              setSelectedSize(nextSize);
              wrapSelection(`<span data-rich-size="${nextSize}">`, '</span>', 'sized text');
            }}
            className="bg-transparent text-[10px] font-black uppercase tracking-widest text-brand-text focus:outline-none"
            title="Font size"
          >
            {sizeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="inline-flex items-center gap-1">
          {colorOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => wrapSelection(`<span data-rich-color="${option.value}">`, '</span>', `${option.label} text`)}
              className="h-8 w-8 rounded-lg border border-white/10 bg-white/[0.03] grid place-items-center hover:border-primary/35"
              title={`${option.label} text`}
            >
              <span className={`h-3.5 w-3.5 rounded-full border border-black/25 ${option.className}`} />
            </button>
          ))}
        </div>
      </div>

      <textarea
        ref={ref}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={() => onChange(normalizeRichTextValue(value))}
        onPaste={handlePaste}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`w-full bg-transparent px-4 py-3 text-sm leading-7 text-brand-text focus:outline-none ${className}`}
      />
    </div>
  );
}
