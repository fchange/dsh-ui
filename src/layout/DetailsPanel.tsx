import { useState } from 'react'
import { Inspector, InspectorBody, InspectorHeader, InspectorMeta, InspectorTabs } from '../components/Inspector'
import { StateDot } from '../components/StateDot'
import { ToolRow } from '../components/ToolRow'
import type { AccessMode, ChatBlock, Session, Workspace } from '../data'

const TOOL_TABS = [
  { id: 'output', label: '输出' },
  { id: 'info', label: '信息' },
] as const

export function DetailsPanel({
  session,
  workspace,
  block,
  model,
  access,
  onClose,
  onSelectTool,
  onBack,
}: {
  session: Session
  workspace?: Workspace
  block?: Extract<ChatBlock, { kind: 'tool' }>
  model: string
  access: AccessMode
  onClose: () => void
  onSelectTool: (id: string) => void
  onBack: () => void
}) {
  const [tab, setTab] = useState('output')
  const tools = session.blocks.filter((item): item is Extract<ChatBlock, { kind: 'tool' }> => item.kind === 'tool')
  const users = session.blocks.filter((item) => item.kind === 'user').length
  const assistants = session.blocks.filter((item) => item.kind === 'assistant').length
  const accessLabel = access === 'full' ? 'Full access' : access === 'workspace' ? 'Workspace' : 'Read only'

  return (
    <Inspector>
      <InspectorHeader
        title={block === undefined ? '会话' : block.name}
        onClose={onClose}
        onBack={block === undefined ? undefined : onBack}
      />
      {block !== undefined && (
        <InspectorTabs value={tab} onValueChange={setTab} items={[...TOOL_TABS]} />
      )}
      <InspectorBody frameKey={block?.id ?? `session-${session.id}`}>
        {block === undefined ? (
          <>
            <div className="mb-1 text-sm font-medium text-ink">{session.title}</div>
            <div className="mb-4 font-mono text-[12px] text-ink-3">{workspace?.path ?? '未绑定工作区'}</div>
            <InspectorMeta
              className="mb-5"
              items={[
                { label: '更新', value: session.updatedAt },
                { label: '模型', value: model },
                { label: '权限', value: accessLabel },
                { label: '消息', value: `${users} 用户 · ${assistants} 助手 · ${tools.length} 工具` },
              ]}
            />
            <div className="mb-2 text-[11px] tracking-wide text-ink-cap uppercase">工具</div>
            {tools.length === 0 ? (
              <div className="text-sm text-ink-3">还没有工具调用。发一条消息后会出现在这里。</div>
            ) : (
              <div className="flex flex-col gap-1">
                {tools.map((item) => (
                  <ToolRow
                    key={item.id}
                    name={item.name}
                    title={item.title}
                    detail={item.detail}
                    state={item.state}
                    onClick={() => { onSelectTool(item.id) }}
                  />
                ))}
              </div>
            )}
          </>
        ) : tab === 'info' ? (
          <InspectorMeta
            items={[
              { label: '工具', value: block.name },
              { label: '调用', value: <span className="font-mono">{block.title}</span> },
              { label: '状态', value: (
                <span className="inline-flex items-center gap-1.5">
                  <StateDot state={block.state} />
                  {block.state}
                </span>
              ) },
              { label: '上下文', value: <span className="text-ink-2">{block.detail}</span> },
            ]}
          />
        ) : block.output ? (
          <pre className="overflow-x-auto rounded-xl bg-code p-3 font-mono text-[12px] leading-[18px] whitespace-pre text-ink-2">
            {block.output}
          </pre>
        ) : (
          <div className="text-sm text-ink-3">这次调用没有输出。</div>
        )}
      </InspectorBody>
    </Inspector>
  )
}
