import type { InputHTMLAttributes, ReactNode } from 'react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { cn } from '@/lib/utils'

export function Input({
  icon,
  className,
  ...rest
}: {
  icon?: ReactNode
  className?: string
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <InputGroup className={cn(
      'h-8 bg-bg-layer-1 shadow-none dark:bg-transparent',
      'has-[[data-slot=input-group-control]:focus-visible]:border-[var(--dsw-alias-brand-primary)]',
      'has-[[data-slot=input-group-control]:focus-visible]:ring-0',
      className,
    )}>
      {icon != null && (
        <InputGroupAddon className="text-ink-3">
          {icon}
        </InputGroupAddon>
      )}
      <InputGroupInput className="text-sm leading-[22px] text-ink placeholder:text-ink-dim" {...rest} />
    </InputGroup>
  )
}
