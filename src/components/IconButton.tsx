import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Button as UiButton } from '@/components/ui/button'
import { Tooltip } from './Tooltip'
import { cn } from '@/lib/utils'

export function IconButton({
  label,
  size = 'sm',
  className,
  children,
  disabled,
  ...rest
}: {
  label: string
  size?: 'sm' | 'md'
  children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Tooltip label={label} disabled={disabled}>
      <UiButton
        type="button"
        variant="ghost"
        size={size === 'md' ? 'icon' : 'icon-sm'}
        aria-label={label}
        disabled={disabled}
        className={cn(
          'rounded-lg text-ink-2 hover:bg-hover hover:text-ink',
          size === 'sm' && 'size-7',
          size === 'md' && 'size-9',
          className,
        )}
        {...rest}
      >
        {children}
      </UiButton>
    </Tooltip>
  )
}
