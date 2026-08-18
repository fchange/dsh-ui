import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { ChevronDown, Fish, PanelRight, Plus } from 'lucide-react'
import { IconButton } from '../components/IconButton'
import { AssistantText } from '../components/AssistantText'
import { Composer } from '../components/Composer'
import { Menu, type MenuItem } from '../components/Menu'
import { StateDot } from '../components/StateDot'
import { Tabs } from '../components/Tabs'
import { ToolRow } from '../components/ToolRow'
import { UserBubble } from '../components/UserBubble'
import { WorkspaceChip } from '../components/WorkspaceChip'
import { cn } from '@/lib/utils'
import type { AccessMode, ChatBlock, Workspace } from '../data'

const VIEWS = [
  { id: 'chat', label: '对话' },
  { id: 'plan', label: '计划' },
] as const

export function Conversation({
  title,
  hero,
  workspace,
  workspaceItems,
  draft,
  onDraft,
  onSend,
  running,
  access,
  onAccess,
  model,
  models,
  onModel,
  blocks,
  view,
  onView,
  detailsOpen,
  onToggleDetails,
  onOpenDetails,
}: {
  title: string
  hero: boolean
  workspace?: Workspace
  workspaceItems: MenuItem[]
  draft: string
  onDraft: (value: string) => void
  onSend: () => void
  running: boolean
  access: AccessMode
  onAccess: (value: AccessMode) => void
  model: string
  models: readonly string[]
  onModel: (value: string) => void
  blocks: ChatBlock[]
  view: string
  onView: (value: string) => void
  detailsOpen: boolean
  onToggleDetails: () => void
  onOpenDetails: (id: string) => void
}) {
  const accessLabel = access === 'full' ? 'Full access' : access === 'workspace' ? 'Workspace' : 'Read only'
  const tools = blocks.filter((block): block is Extract<ChatBlock, { kind: 'tool' }> => block.kind === 'tool')

  return (
    <div
      className="relative flex h-full min-w-0 flex-col bg-bg-base [--dsh-chat-content-width:748px] [--dsh-composer-card-max-width:calc(var(--dsh-chat-content-width)+32px)] [--dsh-composer-side-clearance:16px]"
      data-phase={hero ? 'hero' : 'active'}
    >
      {hero && (
        <div className="pointer-events-none absolute inset-x-0 top-[42%] h-[268px] -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--dsw-alias-state-business-primary)_12%,transparent)_0%,transparent_70%)]" />
      )}

      {!hero && (
        <header className="relative shrink-0 px-7 pt-3 pr-3 pl-5">
          <div className="flex min-h-8 items-center justify-between gap-2">
            <span className="max-w-[280px] overflow-hidden px-2 py-1 text-sm font-medium text-ellipsis whitespace-nowrap text-ink">
              {title}
            </span>
            <IconButton
              label={detailsOpen ? '关闭侧栏' : '打开侧栏'}
              onClick={onToggleDetails}
              className={detailsOpen ? 'bg-hover text-ink' : undefined}
            >
              <PanelRight size={16} strokeWidth={1.75} />
            </IconButton>
          </div>
          <Tabs value={view} onValueChange={onView} items={[...VIEWS]} />
          <span className="pointer-events-none absolute right-0 bottom-px left-0 h-px bg-border-l2" />
        </header>
      )}

      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto',
          hero && 'justify-center',
        )}
        data-conversation-scroll=""
      >
        {!hero && (
          <div className="flex grow shrink-0 flex-col gap-4 px-[calc(var(--dsh-composer-side-clearance)+16px)] py-4">
            <div className="mx-auto flex w-full max-w-[var(--dsh-chat-content-width)] flex-col gap-4">
              {view === 'plan' ? (
                <PlanBody tools={tools} onOpenDetails={onOpenDetails} />
              ) : (
                <>
                  {blocks.map((block) => (
                    <FlowItem key={block.id} block={block} onOpenDetails={onOpenDetails} />
                  ))}
                  {running && (
                    <div className="inline-flex h-[26px] items-center gap-2 text-sm font-medium text-info">
                      <StateDot state="ongoing" />
                      正在思考
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        <div
          className={cn(
            'z-7 flex shrink-0 flex-col',
            hero
              ? 'relative bg-transparent'
              : 'sticky bottom-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--dsw-alias-bg-base)_0%,transparent)_0px,var(--dsw-alias-bg-base)_36px)]',
          )}
        >
          <div className={cn(
            'relative z-1 flex w-full flex-col gap-3 self-center',
            hero && 'w-[min(calc(var(--dsh-composer-card-max-width)+2*var(--dsh-composer-side-clearance)),100%)] pb-8',
          )}>
            {hero && (
              <div className="flex flex-col items-center gap-3 px-[var(--dsh-composer-side-clearance)]">
                <div className="flex items-center gap-2.5 text-[26px] leading-8 font-medium text-ink">
                  <Fish size={34} strokeWidth={1.5} />
                  探索未至之境
                  <span className="self-start mt-0.5 rounded-full border border-hover bg-info-soft px-[7px] font-mono text-xs leading-[18px] font-medium text-ink-blue">
                    DEMO
                  </span>
                </div>
              </div>
            )}
            {hero && (
              <div className="px-[var(--dsh-composer-side-clearance)]">
                <WorkspaceChip value={workspace?.id} items={workspaceItems} />
              </div>
            )}
            <Composer
              value={draft}
              onChange={onDraft}
              onSend={onSend}
              running={running}
              placeholder={hero ? '描述你想要构建的内容' : '给智能体发消息'}
              left={(
                <>
                  <Menu
                    items={[
                      { id: 'plan', label: '写一个计划', onSelect: () => { onDraft('帮我列一个实现计划') } },
                      { id: 'review', label: '审查刚才的改动', onSelect: () => { onDraft('审查刚才的改动') } },
                    ]}
                  >
                    <button
                      type="button"
                      aria-label="命令"
                      className="inline-flex size-7 cursor-pointer items-center justify-center rounded-full border-none bg-selector text-ink-2 hover:bg-hover-solid"
                    >
                      <Plus size={14} strokeWidth={1.75} />
                    </button>
                  </Menu>
                  <Menu
                    items={(['read', 'workspace', 'full'] as const).map((item) => ({
                      id: item,
                      label: item === 'full' ? 'Full access' : item === 'workspace' ? 'Workspace' : 'Read only',
                      selected: access === item,
                      onSelect: () => { onAccess(item) },
                    }))}
                  >
                    <ChipTrigger>{accessLabel}</ChipTrigger>
                  </Menu>
                </>
              )}
              right={(
                <Menu
                  align="end"
                  items={models.map((item) => ({
                    id: item,
                    label: item,
                    selected: item === model,
                    onSelect: () => { onModel(item) },
                  }))}
                >
                  <ChipTrigger>
                    <span className="hidden max-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap sm:inline">{model}</span>
                  </ChipTrigger>
                </Menu>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function ChipTrigger({
  children,
  className,
  ...rest
}: { children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-7 max-w-[220px] cursor-pointer items-center gap-1 rounded-3xl border-none bg-transparent px-2 text-[13px] font-medium text-ink-2 hover:bg-hover',
        className,
      )}
      {...rest}
    >
      {children}
      <ChevronDown className="shrink-0 text-ink-cap" size={12} strokeWidth={1.75} />
    </button>
  )
}

function PlanBody({
  tools,
  onOpenDetails,
}: {
  tools: Extract<ChatBlock, { kind: 'tool' }>[]
  onOpenDetails: (id: string) => void
}) {
  if (tools.length === 0) {
    return (
      <AssistantText text="还没有步骤。回到「对话」发一条消息，工具调用会出现在这里。" />
    )
  }
  return (
    <div className="flex flex-col gap-2">
      {tools.map((block, index) => (
        <ToolRow
          key={block.id}
          name={`${index + 1}`}
          title={block.title}
          detail={block.name}
          state={block.state}
          onClick={() => { onOpenDetails(block.id) }}
        />
      ))}
    </div>
  )
}

function FlowItem({
  block,
  onOpenDetails,
}: {
  block: ChatBlock
  onOpenDetails: (id: string) => void
}) {
  if (block.kind === 'user') return <UserBubble>{block.text}</UserBubble>
  if (block.kind === 'assistant') return <AssistantText text={block.text} />
  return (
    <ToolRow
      name={block.name}
      title={block.title}
      detail={block.detail}
      state={block.state}
      onClick={() => { onOpenDetails(block.id) }}
    />
  )
}
