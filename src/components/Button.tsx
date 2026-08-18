import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Button as UiButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'ghost' | 'outline' | 'toolbar'

export function Button({
  variant = 'ghost',
  size = 'md',
  icon,
  className,
  children,
  ...rest
}: {
  variant?: ButtonVariant
  size?: 'md' | 'sm'
  icon?: ReactNode
  className?: string
  children?: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const mapped = variant === 'primary' ? 'default' : variant === 'toolbar' ? 'secondary' : variant
  return (
    <UiButton
      type="button"
      variant={mapped}
      size={size === 'md' ? 'lg' : 'sm'}
      className={cn(
        'gap-1',
        size === 'md' && 'h-9 rounded-[18px] px-3.5 text-sm leading-[22px]',
        size === 'sm' && 'h-7 rounded-[14px] px-2.5 text-xs leading-[18px]',
        variant === 'primary' && 'bg-[var(--dsw-alias-button-primary-fill)] text-[var(--dsw-alias-label-primary-foreground)] hover:bg-[var(--dsw-alias-button-primary-hover)]',
        variant === 'ghost' && 'text-[var(--dsw-alias-label-primary)] hover:bg-[var(--dsw-alias-interactive-bg-hover)]',
        variant === 'outline' && 'border-[var(--dsw-alias-border-l2)] bg-transparent text-[var(--dsw-alias-label-primary)]',
        variant === 'toolbar' && 'bg-[var(--dsw-alias-button-tool-bar-fill)] text-[var(--dsw-alias-label-primary)] hover:bg-[var(--dsw-alias-button-tool-bar-hover)]',
        className,
      )}
      {...rest}
    >
      {icon != null && <span className="inline-flex size-4 items-center justify-center">{icon}</span>}
      {children}
    </UiButton>
  )
}
