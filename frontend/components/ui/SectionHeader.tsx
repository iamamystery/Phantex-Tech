interface SectionHeaderProps {
  label?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  as?: 'h2' | 'h3'
  dark?: boolean
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  align = 'left',
  as: Tag = 'h2',
  dark = false,
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start'
  const titleColor = dark ? 'text-white' : 'text-[var(--text-primary)]'
  const subtitleColor = dark ? 'text-stone-400' : 'text-[var(--text-muted)]'

  return (
    <div className={`flex flex-col ${alignClass}`}>
      {label && (
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-amber-500 mb-4">
          {label}
        </span>
      )}
      <Tag
        className={`font-display font-semibold ${titleColor} text-4xl leading-tight${
          align === 'center' ? ' mx-auto' : ''
        }`}
      >
        {title}
      </Tag>
      {subtitle && (
        <p
          className={`font-body text-base ${subtitleColor} mt-4 max-w-2xl leading-relaxed${
            align === 'center' ? ' mx-auto' : ''
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
