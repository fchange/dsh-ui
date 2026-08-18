import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: {
  open: boolean
  onClose: () => void
  title: string
  closeLabel?: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
  className?: string
}) {
  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose() }}>
      <DialogContent
        showCloseButton
        className={cn(
          'w-[min(380px,100%)] gap-5 rounded-3xl border-border-inverted bg-bg-layer-2 p-0 pb-6 shadow-lv3 sm:max-w-[380px]',
          className,
        )}
      >
        <DialogHeader className="gap-0 px-6 pt-[22px] pr-12">
          <DialogTitle className="text-base leading-6 font-medium text-ink">{title}</DialogTitle>
          {description ? (
            <DialogDescription className="pt-2 text-sm leading-[22px] text-ink">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>
        {children !== undefined && <div className="flex min-w-0 flex-col px-6">{children}</div>}
        {footer !== undefined && (
          <DialogFooter className="mx-0 mb-0 rounded-none border-0 bg-transparent p-0 px-6 sm:justify-end">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
