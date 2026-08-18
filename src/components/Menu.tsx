import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export type MenuItem = {
  id: string
  label: string
  icon?: ReactNode
  danger?: boolean
  selected?: boolean
  disabled?: boolean
  onSelect?: () => void
}

export function Menu({
  open,
  onClose,
  items,
  className,
  align = 'start',
  children,
}: {
  open?: boolean
  onClose?: () => void
  items: MenuItem[]
  className?: string
  align?: 'start' | 'end'
  children?: ReactNode
}) {
  return (
    <DropdownMenu
      open={open}
      onOpenChange={(next) => { if (!next) onClose?.() }}
    >
      {children != null && (
        <DropdownMenuTrigger asChild>
          {children}
        </DropdownMenuTrigger>
      )}
      <DropdownMenuContent
        align={align}
        sideOffset={4}
        className={cn('w-auto min-w-[218px] max-w-[360px] rounded-xl border-border-inverted bg-menu p-1 shadow-lv3', className)}
      >
        {items.map((item) => (
          <DropdownMenuItem
            key={item.id}
            disabled={item.disabled}
            variant={item.danger ? 'destructive' : 'default'}
            className={cn(
              'min-h-10 cursor-pointer gap-2 rounded-[10px] px-2.5 py-2 text-sm leading-[22px]',
              item.danger && 'bg-[rgb(236_19_19_/_10%)] text-err focus:bg-[rgb(236_19_19_/_16%)] focus:text-err dark:bg-[rgb(242_90_90_/_18%)] dark:focus:bg-[rgb(242_90_90_/_26%)]',
            )}
            onSelect={() => {
              item.onSelect?.()
              onClose?.()
            }}
          >
            {item.icon != null && (
              <span className={cn('inline-flex size-4 shrink-0 items-center justify-center text-ink-3', item.danger && 'text-err')}>
                {item.icon}
              </span>
            )}
            <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{item.label}</span>
            {item.selected && <Check size={14} strokeWidth={1.75} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
