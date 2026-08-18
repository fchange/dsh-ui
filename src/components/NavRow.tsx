import type { ReactNode } from 'react'
import { Item, ItemActions } from '@/components/ui/item'
import { cn } from '@/lib/utils'

export function NavRow({
  selected = false,
  indent = false,
  leading,
  title,
  meta,
  menu,
  onSelect,
  className,
}: {
  selected?: boolean
  indent?: boolean
  leading?: ReactNode
  title: string
  meta?: ReactNode
  menu?: ReactNode
  onSelect?: () => void
  className?: string
}) {
  return (
    <Item
      size="xs"
      className={cn(
        'group h-8 flex-nowrap rounded-lg border-transparent px-2 py-0 hover:bg-hover has-[[data-state=open]]:bg-hover',
        selected && 'bg-hover',
        indent && 'pl-7',
        className,
      )}
    >
      <button
        type="button"
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-1.5 overflow-hidden border-none bg-transparent p-0 text-left text-sm text-ink"
        onClick={onSelect}
      >
        {leading != null && (
          <span className="inline-flex shrink-0 items-center text-ink [&_svg]:pointer-events-none">
            {leading}
          </span>
        )}
        <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{title}</span>
      </button>
      {(meta != null || menu != null) && (
        <ItemActions className="relative ml-1 h-6 min-w-6 shrink-0 justify-end">
          {meta != null && (
            <span className="text-[11px] text-ink-cap group-hover:invisible group-has-[[data-state=open]]:invisible">
              {meta}
            </span>
          )}
          {menu != null && (
            <div className="absolute inset-y-0 right-0 flex items-center opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 group-has-[[data-state=open]]:pointer-events-auto group-has-[[data-state=open]]:opacity-100">
              {menu}
            </div>
          )}
        </ItemActions>
      )}
    </Item>
  )
}
