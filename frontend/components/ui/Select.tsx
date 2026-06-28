'use client'

import * as RSelect from '@radix-ui/react-select'

// ─────────────────────────────────────────────────────────────────────────────
// Phantex Select — a custom dropdown built on Radix UI Select (accessible,
// keyboard-navigable, headless). The closed trigger matches the form inputs;
// the open panel is a floating white card with a soft shadow, amber hover /
// selected states, and a 180ms fade+scale. Styling lives in globals.css under
// `.phantex-select-*`. No native chrome, no blue, no default focus ring.
// ─────────────────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  id?: string
  value: string
  onValueChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  ariaLabel?: string
}

export function Select({ id, value, onValueChange, options, placeholder, ariaLabel }: SelectProps) {
  return (
    <RSelect.Root value={value || undefined} onValueChange={onValueChange}>
      <RSelect.Trigger
        id={id}
        aria-label={ariaLabel}
        className="phantex-select-trigger flex w-full items-center justify-between gap-2 rounded-xl px-4 py-3.5 font-body text-sm outline-none"
      >
        <RSelect.Value placeholder={placeholder} />
        <RSelect.Icon asChild>
          <svg
            className="phantex-select-chevron h-2.5 w-2.5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </RSelect.Icon>
      </RSelect.Trigger>

      <RSelect.Portal>
        <RSelect.Content
          position="popper"
          sideOffset={8}
          className="phantex-select-content z-[120] max-h-[var(--radix-select-content-available-height)] w-[var(--radix-select-trigger-width)] overflow-hidden"
        >
          <RSelect.Viewport className="p-1.5">
            {options.map((opt) => (
              <RSelect.Item
                key={opt.value}
                value={opt.value}
                className="relative flex cursor-pointer select-none items-center justify-between gap-2 rounded-lg px-3 py-2.5 font-body text-sm font-medium text-[#111111] outline-none transition-colors data-[highlighted]:bg-amber-500/10 data-[state=checked]:bg-amber-500/15"
              >
                <RSelect.ItemText>{opt.label}</RSelect.ItemText>
                <RSelect.ItemIndicator>
                  <svg
                    className="h-3.5 w-3.5 text-amber-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </RSelect.ItemIndicator>
              </RSelect.Item>
            ))}
          </RSelect.Viewport>
        </RSelect.Content>
      </RSelect.Portal>
    </RSelect.Root>
  )
}
