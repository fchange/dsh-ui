import { X } from 'lucide-react'
import { IconButton } from '../components/IconButton'
import { StateDot } from '../components/StateDot'
import type { ChatBlock } from '../data'

export function DetailsPanel({
  block,
  onClose,
}: {
  block?: Extract<ChatBlock, { kind: 'tool' }>
  onClose: () => void
}) {
  return (
    <div className="flex h-full min-w-[300px] flex-col bg-bg-base">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border-l2 px-4">
        <span className="text-sm font-medium text-ink">详情</span>
        <IconButton label="关闭详情" onClick={onClose}>
          <X size={14} strokeWidth={1.75} />
        </IconButton>
      </div>
      {block === undefined ? (
        <div className="px-5 py-8 text-sm text-ink-3">点击消息流中的工具行查看详情</div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <div className="mb-3 flex items-center gap-2">
            <StateDot state={block.state} />
            <span className="text-sm font-medium text-ink">{block.name}</span>
          </div>
          <div className="mb-4 font-mono text-[13px] leading-[22px] text-ink">{block.title}</div>
          <div className="mb-2 text-xs text-ink-3">{block.detail}</div>
          {block.output && (
            <pre className="overflow-x-auto rounded-xl bg-code p-3 font-mono text-[12px] leading-[18px] whitespace-pre text-ink-2">
              {block.output}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
