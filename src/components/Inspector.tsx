import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, X } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { IconButton } from './IconButton'
import { Tabs, type TabItem } from './Tabs'
import { cn } from '@/lib/utils'

export function Inspector({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex h-full min-w-[300px] flex-col bg-bg-base', className)}>
      {children}
    </div>
  )
}

export function InspectorHeader({
  title,
  onClose,
  onBack,
  className,
}: {
  title: string
  onClose?: () => void
  onBack?: () => void
  className?: string
}) {
  return (
    <div className={cn('flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border-l2 px-3', className)}>
      <div className="flex min-w-0 items-center gap-1">
        {onBack != null && (
          <IconButton label="返回" onClick={onBack}>
            <ChevronLeft size={14} strokeWidth={1.75} />
          </IconButton>
        )}
        <span className="min-w-0 overflow-hidden text-sm font-medium text-ellipsis whitespace-nowrap text-ink">
          {title}
        </span>
      </div>
      {onClose != null && (
        <IconButton label="关闭侧栏" onClick={onClose}>
          <X size={14} strokeWidth={1.75} />
        </IconButton>
      )}
    </div>
  )
}

export function InspectorTabs({
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
  return (
    <div className={cn('shrink-0 px-4', className)}>
      <Tabs compact value={value} onValueChange={onValueChange} items={items} />
    </div>
  )
}

export function InspectorBody({
  children,
  frameKey,
  className,
}: {
  children: ReactNode
  frameKey?: string
  className?: string
}) {
  return (
    <ScrollArea className="min-h-0 flex-1">
      <AnimatePresence mode="wait">
        <motion.div
          key={frameKey}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          className={cn('px-4 py-4', className)}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </ScrollArea>
  )
}

export function InspectorMeta({
  items,
  className,
}: {
  items: { label: string; value: ReactNode }[]
  className?: string
}) {
  return (
    <dl className={cn('grid grid-cols-[72px_minmax(0,1fr)] gap-y-2 text-[13px]', className)}>
      {items.map((item) => (
        <div key={item.label} className="contents">
          <dt className="text-ink-3">{item.label}</dt>
          <dd className="m-0 text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
