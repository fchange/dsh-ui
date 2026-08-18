import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'

export function Pill({
  active = false,
  className,
  children,
  onClick,
}: {
  active?: boolean
  className?: string
  children?: ReactNode
  onClick?: () => void
}) {
  const surface = cn(
    'h-6 rounded-xl border-none bg-bg-layer-2 px-2 text-xs leading-[18px] font-normal text-ink-2 shadow-none',
    active && 'bg-ghost-active text-ink shadow-[inset_0_0_0_1px_var(--dsw-alias-button-ghost-active-border)]',
    className,
  )
  if (!onClick) {
    return <Badge variant="secondary" className={surface}>{children}</Badge>
  }
  return (
    <Toggle
      pressed={active}
      onPressedChange={() => { onClick() }}
      className={cn(surface, 'hover:bg-hover')}
    >
      {children}
    </Toggle>
  )
}
