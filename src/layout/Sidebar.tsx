import { useEffect, useState } from 'react'
import { ChevronRight, Ellipsis, Fish, FolderClosed, FolderOpen, LayoutDashboard, MessageSquarePlus, PanelLeft, Pencil, Plus, Search, Settings, Trash2 } from 'lucide-react'
import { BrandWordmark } from '../components/BrandWordmark'
import { Catalog, CatalogBody, CatalogFooter, CatalogHeader, CatalogSearch } from '../components/Catalog'
import { IconButton } from '../components/IconButton'
import { Menu } from '../components/Menu'
import { NavRow } from '../components/NavRow'
import { StateDot } from '../components/StateDot'
import { Tooltip } from '../components/Tooltip'
import { cn } from '@/lib/utils'
import type { Session, Workspace } from '../data'

export function Sidebar({
  collapsed,
  width,
  workspaces,
  sessions,
  activeSessionId,
  runningSessionId,
  query,
  onQuery,
  onToggle,
  onNewSession,
  onSelectSession,
  onOpenSettings,
  onOpenGallery,
  onRenameSession,
  onDeleteSession,
  onRenameWorkspace,
  onDeleteWorkspace,
  onCreateWorkspace,
}: {
  collapsed: boolean
  width: number
  workspaces: Workspace[]
  sessions: Session[]
  activeSessionId: string
  runningSessionId?: string
  query: string
  onQuery: (value: string) => void
  onToggle: () => void
  onNewSession: (workspaceId?: string) => void
  onSelectSession: (id: string) => void
  onOpenSettings: () => void
  onOpenGallery: () => void
  onRenameSession: (id: string) => void
  onDeleteSession: (id: string) => void
  onRenameWorkspace: (id: string) => void
  onDeleteWorkspace: (id: string) => void
  onCreateWorkspace: () => void
}) {
  const [openGroups, setOpenGroups] = useState<string[]>(workspaces.map((item) => item.id))

  useEffect(() => {
    const owner = workspaces.find((item) => item.sessionIds.includes(activeSessionId))
    if (owner === undefined) return
    setOpenGroups((current) => current.includes(owner.id) ? current : [...current, owner.id])
  }, [activeSessionId, workspaces])

  const sessionById = new Map(sessions.map((item) => [item.id, item]))
  const workspaceBySession = new Map<string, Workspace>()
  for (const workspace of workspaces) {
    for (const id of workspace.sessionIds) workspaceBySession.set(id, workspace)
  }
  const filtered = query.trim() === ''
    ? null
    : sessions.filter((item) => {
      const hay = `${item.title} ${workspaceBySession.get(item.id)?.title ?? ''}`.toLowerCase()
      return hay.includes(query.trim().toLowerCase())
    })

  return (
    <Catalog collapsed={collapsed} width={width}>
      <CatalogHeader>
        <div className={cn('mb-2 flex h-[60px] shrink-0 items-center justify-end gap-2 overflow-hidden py-2 pl-1', collapsed && 'mb-3 h-9 justify-start p-0')}>
          {!collapsed && (
            <button
              type="button"
              className="flex min-w-0 flex-1 cursor-pointer items-center overflow-hidden border-none bg-transparent p-0 text-inherit"
              aria-label="新会话"
              onClick={() => { onNewSession() }}
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
            onClick={() => { onNewSession() }}
          >
            <MessageSquarePlus size={collapsed ? 18 : 14} strokeWidth={1.75} />
            {!collapsed && <span>新会话</span>}
          </button>
        </Tooltip>
      </CatalogHeader>

      <CatalogBody>
        {collapsed ? (
          <div className="flex flex-col items-center gap-3">
            <IconButton label="搜索" size="md" className="rounded-full text-ink" onClick={onToggle}>
              <Search size={18} strokeWidth={1.75} />
            </IconButton>
          </div>
        ) : (
          <>
            <CatalogSearch
              icon={<Search size={14} strokeWidth={1.75} />}
              placeholder="搜索会话或工作区"
              value={query}
              onChange={(event) => { onQuery(event.target.value) }}
            />
            {filtered ? (
              filtered.length === 0 ? (
                <div className="px-2 py-6 text-center text-xs text-ink-3">没有匹配的会话</div>
              ) : (
                <div className="flex flex-col gap-0.5">
                  {filtered.map((session) => (
                    <SessionRow
                      key={session.id}
                      session={session}
                      selected={session.id === activeSessionId}
                      running={session.id === runningSessionId}
                      meta={workspaceBySession.get(session.id)?.title ?? session.updatedAt}
                      onSelect={() => { onSelectSession(session.id) }}
                      onRename={() => { onRenameSession(session.id) }}
                      onDelete={() => { onDeleteSession(session.id) }}
                    />
                  ))}
                </div>
              )
            ) : (
              <>
                <div className="flex flex-col gap-1">
                  {workspaces.map((workspace) => {
                  const open = openGroups.includes(workspace.id)
                  const current = workspace.sessionIds.includes(activeSessionId)
                  return (
                    <div key={workspace.id} className="flex flex-col gap-0.5">
                      <NavRow
                        variant="workspace"
                        title={workspace.title}
                        onSelect={() => {
                          setOpenGroups((currentGroups) =>
                            currentGroups.includes(workspace.id)
                              ? currentGroups.filter((id) => id !== workspace.id)
                              : [...currentGroups, workspace.id],
                          )
                        }}
                        leading={open
                          ? <FolderOpen className={cn(current && 'text-info')} size={16} strokeWidth={1.75} />
                          : <FolderClosed className={cn(current && 'text-info')} size={16} strokeWidth={1.75} />}
                        hoverLeading={(
                          <ChevronRight
                            className={cn('transition-transform duration-150', open && 'rotate-90')}
                            size={12}
                            strokeWidth={1.75}
                          />
                        )}
                        menu={(
                          <span className="inline-flex items-center">
                            <IconButton
                              label="在此新建会话"
                              className="size-4 text-ink-3"
                              onPointerDown={(event) => { event.stopPropagation() }}
                              onClick={(event) => {
                                event.stopPropagation()
                                onNewSession(workspace.id)
                              }}
                            >
                              <Plus size={14} strokeWidth={1.75} />
                            </IconButton>
                            <Menu
                              align="end"
                              items={[
                                { id: 'new', label: '新建会话', icon: <Plus size={14} strokeWidth={1.75} />, onSelect: () => { onNewSession(workspace.id) } },
                                { id: 'rename', label: '重命名', icon: <Pencil size={14} strokeWidth={1.75} />, onSelect: () => { onRenameWorkspace(workspace.id) } },
                                { id: 'delete', label: '删除工作区', danger: true, icon: <Trash2 size={14} strokeWidth={1.75} />, onSelect: () => { onDeleteWorkspace(workspace.id) } },
                              ]}
                            >
                              <button
                                type="button"
                                className="inline-flex size-4 items-center justify-center rounded border-none bg-transparent text-ink-3 hover:text-ink"
                                onPointerDown={(event) => { event.stopPropagation() }}
                                onClick={(event) => { event.stopPropagation() }}
                              >
                                <Ellipsis size={14} strokeWidth={1.75} />
                              </button>
                            </Menu>
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
                            running={session.id === runningSessionId}
                            indent
                            onSelect={() => { onSelectSession(session.id) }}
                            onRename={() => { onRenameSession(session.id) }}
                            onDelete={() => { onDeleteSession(session.id) }}
                          />
                        )
                      })}
                    </div>
                  )
                })}
                </div>
                <NavRow
                  title="新工作区"
                  leading={<Plus size={16} strokeWidth={1.75} />}
                  onSelect={onCreateWorkspace}
                  className="mt-1.5 text-ink-2"
                />
              </>
            )}
          </>
        )}
      </CatalogBody>

      <CatalogFooter className={cn(collapsed && 'items-center')}>
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
      </CatalogFooter>
    </Catalog>
  )
}

function SessionRow({
  session,
  selected,
  running,
  indent,
  meta,
  onSelect,
  onRename,
  onDelete,
}: {
  session: Session
  selected: boolean
  running?: boolean
  indent?: boolean
  meta?: string
  onSelect: () => void
  onRename: () => void
  onDelete: () => void
}) {
  return (
    <NavRow
      variant="session"
      selected={selected}
      indent={indent}
      title={session.title}
      onSelect={onSelect}
      leading={running ? <StateDot state="ongoing" /> : undefined}
      meta={meta ?? session.updatedAt}
      menu={(
        <Menu
          align="end"
          items={[
            { id: 'rename', label: '重命名', icon: <Pencil size={14} strokeWidth={1.75} />, onSelect: onRename },
            { id: 'delete', label: '删除', danger: true, icon: <Trash2 size={14} strokeWidth={1.75} />, onSelect: onDelete },
          ]}
        >
          <button
            type="button"
            className="inline-flex size-4 items-center justify-center rounded border-none bg-transparent text-ink-3 hover:text-ink"
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
