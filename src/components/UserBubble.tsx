import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function UserBubble({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-end gap-1.5', className)}>
      <div className="max-w-[min(525px,82%)] rounded-[22px] bg-bubble px-4 py-2.5 text-base leading-6 text-ink whitespace-pre-wrap">
        {children}
      </div>
    </div>
  )
}
