import { useId } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Tabs as UiTabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export type TabItem = {
  id: string
  label: string
}

export function Tabs({
  value,
  onValueChange,
  items,
  compact = false,
  className,
}: {
  value: string
  onValueChange?: (value: string) => void
  items: TabItem[]
  compact?: boolean
  className?: string
}) {
  const reduce = useReducedMotion()
  const underlineId = `tabs-underline-${useId()}`

  return (
    <UiTabs value={value} onValueChange={onValueChange} className={cn('gap-0', className)}>
      <TabsList
        variant="line"
        className={cn(
          'items-end rounded-none bg-transparent p-0 group-data-horizontal/tabs:h-[35px]',
          compact ? 'h-8 gap-4 pl-0' : 'h-[35px] gap-9 pl-2',
        )}
      >
        {items.map((item) => (
          <TabsTrigger
            key={item.id}
            value={item.id}
            className={cn(
              'relative h-auto flex-none rounded-none px-0 text-[13px] leading-4 font-medium text-ink-3 shadow-none after:hidden group-data-horizontal/tabs:h-auto data-active:bg-transparent data-active:text-info data-active:shadow-none',
              compact ? 'pb-2' : 'pb-[11px]',
            )}
          >
            {item.label}
            {item.id === value && (
              <motion.span
                layoutId={reduce ? undefined : underlineId}
                className="absolute inset-x-0 bottom-px h-0.5 rounded-sm bg-info"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </UiTabs>
  )
}
