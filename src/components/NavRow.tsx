import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type NavRowVariant = 'workspace' | 'session' | 'action'

export function NavRow({
  variant = 'action',
  selected = false,
  indent = false,
  leading,
  hoverLeading,
  title,
  meta,
  menu,
  onSelect,
  className,
}: {
  variant?: NavRowVariant
  selected?: boolean
  indent?: boolean
  leading?: ReactNode
  /** Workspace rows can replace their folder glyph with a chevron on hover. */
  hoverLeading?: ReactNode
  title: string
  meta?: ReactNode
  menu?: ReactNode
  onSelect?: () => void
  className?: string
}) {
  const session = variant === 'session'
  const workspace = variant === 'workspace'

  return (
    <div
      role="treeitem"
      aria-selected={session ? selected : undefined}
      className={cn(
        'group/navrow flex w-full cursor-pointer select-none items-center rounded-lg px-2 text-sm text-ink hover:bg-hover has-[[data-state=open]]:bg-hover',
        workspace ? 'h-[34px] gap-1.5' : 'h-8',
        session && 'animate-[nav-row-in_150ms_ease-out] gap-0',
        selected && 'bg-hover',
        indent && 'pl-[30px]',
        className,
      )}
      onClick={onSelect}
    >
      {(session || leading != null || hoverLeading != null) && (
        <span
          className={cn(
            'inline-flex h-5 w-4 shrink-0 items-center justify-center text-ink-3 [&_svg]:pointer-events-none',
            workspace && 'group-hover/navrow:hidden group-has-[[data-state=open]]/navrow:hidden',
          )}
        >
          {leading}
        </span>
      )}
      {workspace && hoverLeading != null && (
        <span className="hidden h-5 w-4 shrink-0 items-center justify-center text-ink-cap group-hover/navrow:inline-flex group-has-[[data-state=open]]/navrow:inline-flex [&_svg]:pointer-events-none">
          {hoverLeading}
        </span>
      )}
      <span
        className={cn(
          'min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap leading-5',
          session && 'ml-1 mr-1.5',
        )}
      >
        {title}
      </span>
      {meta != null && (
        <span className="shrink-0 text-xs leading-5 text-ink-3 group-hover/navrow:hidden group-has-[[data-state=open]]/navrow:hidden">
          {meta}
        </span>
      )}
      {menu != null && (
        <span className="hidden h-5 shrink-0 items-center gap-3 text-ink-3 group-hover/navrow:inline-flex group-has-[[data-state=open]]/navrow:inline-flex [&_button]:size-4 [&_button]:rounded [&_svg]:size-4">
          {menu}
        </span>
      )}
    </div>
  )
}
