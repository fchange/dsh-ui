import type { ReactNode } from 'react'
import { ArrowUp, Square } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button as UiButton } from '@/components/ui/button'
import { Tooltip } from './Tooltip'
import { cn } from '@/lib/utils'

export function Composer({
  value,
  onChange,
  onSend,
  placeholder = '给智能体发消息',
  running = false,
  left,
  right,
  className,
}: {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  placeholder?: string
  running?: boolean
  left?: ReactNode
  right?: ReactNode
  className?: string
}) {
  const empty = value.trim() === ''
  return (
    <div className={cn('flex flex-col items-center px-[var(--dsh-composer-side-clearance,16px)] pb-2', className)}>
      <Card className="relative w-full max-w-[var(--dsh-composer-card-max-width,780px)] gap-3 rounded-[22px] border-border-l2-thin bg-input py-0 pt-2.5 shadow-lv2">
        <Textarea
          className="max-h-[336px] min-h-[48px] resize-none border-none bg-transparent px-4 py-1 text-base leading-6 text-ink shadow-none caret-[var(--dsw-alias-state-business-primary)] placeholder:text-ink-cap focus-visible:ring-0 dark:bg-transparent"
          placeholder={placeholder}
          value={value}
          onChange={(event) => { onChange(event.target.value) }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              if (!empty && !running) onSend()
            }
          }}
        />
        <div className="flex min-w-0 items-center justify-between gap-3 px-2 pt-0.5 pb-1.5">
          <div className="flex min-w-0 items-center gap-3">{left}</div>
          <div className="flex shrink-0 items-center gap-3">
            {right}
            <Tooltip label={running ? '停止生成' : '发送消息'}>
              <UiButton
                type="button"
                size="icon"
                aria-label={running ? '停止生成' : '发送消息'}
                disabled={!running && empty}
                className="size-[34px] rounded-full bg-[var(--dsw-alias-button-info-fill)] text-white hover:bg-[var(--dsw-alias-button-info-hover)]"
                onClick={onSend}
              >
                {running ? <Square size={14} fill="currentColor" /> : <ArrowUp size={16} strokeWidth={1.75} />}
              </UiButton>
            </Tooltip>
          </div>
        </div>
      </Card>
    </div>
  )
}
