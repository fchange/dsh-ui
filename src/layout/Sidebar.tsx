import { useState } from 'react'
import { ChevronRight, Ellipsis, Fish, FolderClosed, FolderOpen, LayoutDashboard, MessageSquarePlus, PanelLeft, Search, Settings } from 'lucide-react'
import { BrandWordmark } from '../components/BrandWordmark'
import { IconButton } from '../components/IconButton'
import { Input } from '../components/Input'
import { Menu } from '../components/Menu'
import { NavRow } from '../components/NavRow'
import { Tooltip } from '../components/Tooltip'
import { cn } from '@/lib/utils'
import type { Session, Workspace } from '../data'

export function Sidebar({
  collapsed,
  width,
  workspaces,
  sessions,
  activeSessionId,
  query,
  onQuery,
  onToggle,
  onNewSession,
  onSelectSession,
  onOpenSettings,
  onOpenGallery,
  onRenameSession,
  onDeleteSession,
}: {
  collapsed: boolean
  width: number
  workspaces: Workspace[]
  sessions: Session[]
  activeSessionId: string
  query: string
  onQuery: (value: string) => void
  onToggle: () => void
  onNewSession: () => void
  onSelectSession: (id: string) => void
  onOpenSettings: () => void
  onOpenGallery: () => void
  onRenameSession: (id: string) => void
  onDeleteSession: (id: string) => void
}) {
  const [openGroups, setOpenGroups] = useState<string[]>(workspaces.map((item) => item.id))

  const sessionById = new Map(sessions.map((item) => [item.id, item]))
  const filtered = query.trim() === ''
    ? null
    : sessions.filter((item) => item.title.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <div
      className={cn(
        'flex h-full flex-col bg-sidebar px-3 py-1.5 text-sm text-ink',
        collapsed && 'items-center px-2.5 pt-[18px]',
      )}
      style={collapsed ? undefined : { width }}
    >
      <div className={cn('mb-2 flex h-[60px] shrink-0 items-center justify-end gap-2 overflow-hidden py-2 pl-1', collapsed && 'mb-3 h-9 justify-start p-0')}>
        {!collapsed && (
          <button
            type="button"
            className="flex min-w-0 flex-1 cursor-pointer items-center overflow-hidden border-none bg-transparent p-0 text-inherit"
            aria-label="新会话"
            onClick={onNewSession}
          >
            <BrandWordmark />
          </button>
        )}
        <IconButton
          label={collapsed ? '展开侧栏' : '收起侧栏'}
          size={collapsed ? 'md' : 'sm'}
          className={cn('group rounded-full', collapsed && 'text-ink')}
          onClick={onToggle}
        >
          {collapsed && <Fish className="group-hover:hidden" size={22} strokeWidth={1.75} />}
          <PanelLeft className={cn(collapsed && 'hidden group-hover:inline')} size={collapsed ? 18 : 16} strokeWidth={1.75} />
        </IconButton>
      </div>

      <Tooltip label="新会话" disabled={!collapsed}>
        <button
          type="button"
          className={cn(
            'mb-2 flex h-[38px] shrink-0 cursor-pointer items-center justify-center gap-1.5 overflow-hidden rounded-xl border border-border-l2 bg-btn-elevated px-4 text-sm font-medium leading-[22px] text-ink hover:bg-btn-float-hover',
            collapsed && 'mb-3 size-9 rounded-full border-transparent bg-transparent p-0 hover:bg-hover',
          )}
          aria-label="新会话"
          onClick={onNewSession}
        >
          <MessageSquarePlus size={collapsed ? 18 : 14} strokeWidth={1.75} />
          {!collapsed && <span>新会话</span>}
        </button>
      </Tooltip>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {collapsed ? (
          <div className="flex flex-col items-center gap-3">
            <IconButton label="搜索" size="md" className="rounded-full text-ink" onClick={onToggle}>
              <Search size={18} strokeWidth={1.75} />
            </IconButton>
          </div>
        ) : (
          <>
            <Input
              className="mb-2 w-full"
              icon={<Search size={14} strokeWidth={1.75} />}
              placeholder="搜索会话"
              value={query}
              onChange={(event) => { onQuery(event.target.value) }}
            />
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              {filtered ? (
                filtered.length === 0 ? (
                  <div className="px-2 py-6 text-center text-xs text-ink-3">没有匹配的会话</div>
                ) : (
                  filtered.map((session) => (
                    <SessionRow
                      key={session.id}
                      session={session}
                      selected={session.id === activeSessionId}
                      onSelect={() => { onSelectSession(session.id) }}
                      onRename={() => { onRenameSession(session.id) }}
                      onDelete={() => { onDeleteSession(session.id) }}
                    />
                  ))
                )
              ) : (
                workspaces.map((workspace) => {
                  const open = openGroups.includes(workspace.id)
                  return (
                    <div key={workspace.id} className="mb-1">
                      <NavRow
                        title={workspace.title}
                        onSelect={() => {
                          setOpenGroups((current) =>
                            current.includes(workspace.id)
                              ? current.filter((id) => id !== workspace.id)
                              : [...current, workspace.id],
                          )
                        }}
                        leading={(
                          <span className="inline-flex items-center gap-1.5">
                            <ChevronRight
                              className={cn('text-ink-3 transition-transform duration-150', open && 'rotate-90')}
                              size={12}
                              strokeWidth={1.75}
                            />
                            {open
                              ? <FolderOpen size={16} strokeWidth={1.75} />
                              : <FolderClosed size={16} strokeWidth={1.75} />}
                          </span>
                        )}
                      />
                      {open && workspace.sessionIds.map((id) => {
                        const session = sessionById.get(id)
                        if (!session) return null
                        return (
                          <SessionRow
                            key={session.id}
                            session={session}
                            selected={session.id === activeSessionId}
                            indent
                            onSelect={() => { onSelectSession(session.id) }}
                            onRename={() => { onRenameSession(session.id) }}
                            onDelete={() => { onDeleteSession(session.id) }}
                          />
                        )
                      })}
                    </div>
                  )
                })
              )}
            </div>
          </>
        )}
      </div>

      <div className={cn('mt-1 flex shrink-0 flex-col', collapsed && 'items-center')}>
        {collapsed ? (
          <>
            <IconButton label="组件库" size="md" className="rounded-full" onClick={onOpenGallery}>
              <LayoutDashboard size={18} strokeWidth={1.75} />
            </IconButton>
            <IconButton label="设置" size="md" className="rounded-full" onClick={onOpenSettings}>
              <Settings size={18} strokeWidth={1.75} />
            </IconButton>
          </>
        ) : (
          <>
            <NavRow
              title="组件库"
              leading={<LayoutDashboard size={16} strokeWidth={1.75} />}
              onSelect={onOpenGallery}
            />
            <NavRow
              title="设置"
              leading={<Settings size={16} strokeWidth={1.75} />}
              onSelect={onOpenSettings}
            />
          </>
        )}
      </div>
    </div>
  )
}

function SessionRow({
  session,
  selected,
  indent,
  onSelect,
  onRename,
  onDelete,
}: {
  session: Session
  selected: boolean
  indent?: boolean
  onSelect: () => void
  onRename: () => void
  onDelete: () => void
}) {
  return (
    <NavRow
      selected={selected}
      indent={indent}
      title={session.title}
      onSelect={onSelect}
      meta={session.updatedAt}
      menu={(
        <Menu
          align="end"
          items={[
            { id: 'rename', label: '重命名', onSelect: onRename },
            { id: 'delete', label: '删除', danger: true, onSelect: onDelete },
          ]}
        >
          <button
            type="button"
            className="inline-flex size-6 items-center justify-center rounded-md border-none bg-transparent text-ink-3 hover:bg-hover-solid"
            onPointerDown={(event) => { event.stopPropagation() }}
            onClick={(event) => { event.stopPropagation() }}
          >
            <Ellipsis size={14} strokeWidth={1.75} />
          </button>
        </Menu>
      )}
    />
  )
}
