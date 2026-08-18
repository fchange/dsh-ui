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
  className,
}: {
  value: string
  onValueChange?: (value: string) => void
  items: TabItem[]
  className?: string
}) {
  const reduce = useReducedMotion()
  const underlineId = `tabs-underline-${useId()}`

  return (
    <UiTabs value={value} onValueChange={onValueChange} className={cn('gap-0', className)}>
      <TabsList variant="line" className="h-[35px] items-end gap-9 rounded-none bg-transparent p-0 pl-2 group-data-horizontal/tabs:h-[35px]">
        {items.map((item) => (
          <TabsTrigger
            key={item.id}
            value={item.id}
            className="relative h-auto flex-none rounded-none px-0 pb-[11px] text-[13px] leading-4 font-medium text-ink-3 shadow-none after:hidden group-data-horizontal/tabs:h-auto data-active:bg-transparent data-active:text-info data-active:shadow-none"
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
