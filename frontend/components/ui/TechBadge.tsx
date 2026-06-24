interface TechBadgeProps {
  name: string
  size?: 'sm' | 'md'
}

const SIZES = {
  sm: 'text-xs px-3 py-1',
  md: 'text-sm px-4 py-1.5',
} as const

export default function TechBadge({ name, size = 'sm' }: TechBadgeProps) {
  return (
    <span
      className={`inline-block font-mono ${SIZES[size]} bg-stone-100 border border-stone-200 text-stone-700 rounded-full`}
    >
      {name}
    </span>
  )
}
