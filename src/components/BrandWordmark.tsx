import type { ReactNode } from 'react'
import { Fish } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BrandWordmark({
  mark,
  name = 'deepseek',
  badge = 'HARNESS',
  size = 24,
  className,
}: {
  mark?: ReactNode
  name?: string
  badge?: string | null
  size?: number
  className?: string
}) {
  return (
    <span
      className={cn('inline-flex items-center gap-2 text-ink', className)}
      style={{ height: size }}
    >
      <span className="inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
        {mark ?? <Fish size={size} strokeWidth={1.75} />}
      </span>
      <span className="text-[15px] leading-none font-medium tracking-tight">{name}</span>
      {badge != null && badge !== '' && (
        <span
          className="rounded-[2px] bg-ink px-1.5 py-0.5 font-mono text-[10px] leading-none font-medium tracking-wide text-ink-inv"
        >
          {badge}
        </span>
      )}
    </span>
  )
}
