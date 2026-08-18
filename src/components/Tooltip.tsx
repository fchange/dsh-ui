import type { ReactElement } from 'react'
import {
  Tooltip as UiTooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function Tooltip({
  label,
  children,
  disabled,
}: {
  label: string
  children: ReactElement
  disabled?: boolean
  className?: string
}) {
  if (disabled) return children
  return (
    <UiTooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={8}
        className="rounded-lg border-none bg-[var(--dsw-alias-tooltip-bg)] px-2 py-1 text-xs text-white shadow-lv3"
      >
        {label}
      </TooltipContent>
    </UiTooltip>
  )
}
