import { Item, ItemMedia } from '@/components/ui/item'
import { StateDot, type StateDotState } from './StateDot'
import { cn } from '@/lib/utils'

export function ToolRow({
  name,
  title,
  detail,
  state,
  onClick,
  className,
}: {
  name: string
  title: string
  detail?: string
  state: StateDotState
  onClick?: () => void
  className?: string
}) {
  return (
    <Item
      asChild
      size="xs"
      className={cn(
        'h-auto flex-nowrap rounded-md border-transparent px-1 py-1 hover:bg-hover',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      <button type="button" onClick={onClick}>
        <ItemMedia className="size-2.5 aspect-square overflow-hidden">
          <StateDot state={state} />
        </ItemMedia>
        <span className="text-[13px] font-medium text-ink-2">{name}</span>
        <span className="min-w-0 flex-1 overflow-hidden font-mono text-[13px] text-ellipsis whitespace-nowrap text-ink">
          {title}
        </span>
        {detail !== undefined && detail !== '' && (
          <span className="text-xs text-ink-3">{detail}</span>
        )}
      </button>
    </Item>
  )
}
