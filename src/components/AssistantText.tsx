import { Copy } from 'lucide-react'
import { IconButton } from './IconButton'
import { notify } from './Toast'
import { cn } from '@/lib/utils'

export function AssistantText({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return (
    <div className={cn('group min-w-0 text-base leading-7 text-ink whitespace-pre-wrap', className)}>
      {renderInline(text)}
      <div className="mt-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        <IconButton
          label="复制"
          onClick={() => {
            void navigator.clipboard.writeText(text).then(
              () => { notify('已复制到剪贴板', 'success') },
              () => { notify('复制失败', 'error') },
            )
          }}
        >
          <Copy size={14} strokeWidth={1.75} />
        </IconButton>
      </div>
    </div>
  )
}

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`)/g)
  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="rounded-md bg-inline-code px-1.5 py-0.5 font-mono text-[13px] leading-[22px]">
          {part.slice(1, -1)}
        </code>
      )
    }
    return <span key={index}>{part}</span>
  })
}
