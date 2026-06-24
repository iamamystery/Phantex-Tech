import Link from 'next/link'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
  onClick?: () => void
  href?: string
  type?: 'button' | 'submit' | 'reset'
  className?: string
  disabled?: boolean
}

const VARIANTS = {
  primary:
    'bg-amber-500 text-black font-medium px-6 py-3 rounded-lg hover:bg-amber-600 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
  secondary:
    'border border-stone-300 text-stone-800 px-6 py-3 rounded-lg hover:border-amber-500 hover:text-amber-600 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
} as const

export default function Button({
  variant = 'primary',
  children,
  onClick,
  href,
  type = 'button',
  className = '',
  disabled = false,
}: ButtonProps) {
  const classes = `${VARIANTS[variant]} ${className}`

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  )
}
