import { CircleCheck, Info, OctagonX, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { toast as sonnerToast, Toaster as SonnerToaster, type ToasterProps } from 'sonner'

export type NotifyLevel = 'info' | 'success' | 'warning' | 'error'

const LEVEL_ICONS: Record<NotifyLevel, ReactNode> = {
  info: <Info size={16} strokeWidth={1.75} className="text-[var(--dsw-alias-state-business-primary)]" />,
  success: <CircleCheck size={16} strokeWidth={1.75} className="text-[var(--dsw-alias-state-success-primary)]" />,
  warning: <TriangleAlert size={16} strokeWidth={1.75} className="text-[var(--dsw-alias-state-warn-primary)]" />,
  error: <OctagonX size={16} strokeWidth={1.75} className="text-[var(--dsw-alias-state-error-primary)]" />,
}

export function notify(text: string, level: NotifyLevel = 'info') {
  const icon = LEVEL_ICONS[level]
  if (level === 'success') sonnerToast.success(text, { icon, duration: 4000 })
  else if (level === 'warning') sonnerToast.warning(text, { icon, duration: 4000 })
  else if (level === 'error') sonnerToast.error(text, { icon, duration: 4000 })
  else sonnerToast(text, { icon, duration: 4000 })
}

export function Toaster({ theme = 'system' }: { theme?: ToasterProps['theme'] }) {
  return (
    <SonnerToaster
      theme={theme}
      position="top-center"
      offset={120}
      toastOptions={{
        classNames: {
          toast: 'rounded-[14px] border-none bg-[var(--dsw-alias-button-contrast-fill)] text-[var(--dsw-alias-label-primary-inverted)] shadow-[var(--dsw-shadow-lv3)]',
        },
      }}
    />
  )
}
