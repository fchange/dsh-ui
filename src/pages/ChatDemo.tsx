import { useCallback, useMemo, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Modal } from '../components/Modal'
import { Pill } from '../components/Pill'
import { notify } from '../components/Toast'
import {
  seedSessions,
  workspaces as seedWorkspaces,
  type AccessMode,
  type ChatBlock,
  type Session,
  type ThemeMode,
  type Workspace,
} from '../data'
import { AppFrame } from '../layout/AppFrame'
import { Conversation } from '../layout/Conversation'
import { DetailsPanel } from '../layout/DetailsPanel'
import { Sidebar } from '../layout/Sidebar'

const MODELS = ['deepseek-chat', 'deepseek-reasoner'] as const

export function ChatDemo({
  theme,
  onTheme,
}: {
  theme: ThemeMode
  onTheme: (theme: ThemeMode) => void
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => seedWorkspaces.map((item) => ({
    ...item,
    sessionIds: [...item.sessionIds],
  })))
  const [sessions, setSessions] = useState<Session[]>(() => seedSessions.map((item) => ({
    ...item,
    blocks: [...item.blocks],
  })))
  const [activeId, setActiveId] = useState(seedSessions[0].id)
  const [query, setQuery] = useState('')
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [running, setRunning] = useState(false)
  const [access, setAccess] = useState<AccessMode>('workspace')
  const [model, setModel] = useState<(typeof MODELS)[number]>('deepseek-chat')
  const [view, setView] = useState('chat')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [detailsId, setDetailsId] = useState<string | undefined>(undefined)
  const [sidebarWidth, setSidebarWidth] = useState(280)
  const [renameId, setRenameId] = useState<string | undefined>(undefined)
  const [renameValue, setRenameValue] = useState('')

  const session = sessions.find((item) => item.id === activeId) ?? sessions[0]
  const workspace = workspaces.find((item) => item.sessionIds.includes(session.id))
  const hero = session.blocks.length === 0
  const detailsBlock = session.blocks.find((block): block is Extract<ChatBlock, { kind: 'tool' }> =>
    block.kind === 'tool' && block.id === detailsId,
  )
  const detailsOpen = detailsId !== undefined
  const draft = drafts[session.id] ?? ''

  const onSidebarWidth = useCallback((px: number) => { setSidebarWidth(px) }, [])
  const onDetailsWidth = useCallback(() => {}, [])

  const setDraft = (value: string) => {
    const id = session.id
    setDrafts((current) => ({ ...current, [id]: value }))
  }

  const selectSession = (id: string) => {
    setActiveId(id)
    setDetailsId(undefined)
    setView('chat')
  }

  const startSession = (workspaceId = workspace?.id ?? workspaces[0]?.id) => {
    if (workspaceId === undefined) return
    const id = `s-${Date.now()}`
    const next: Session = { id, title: '新会话', updatedAt: '刚刚', blocks: [] }
    setSessions((current) => [next, ...current])
    setWorkspaces((current) => current.map((item) => (
      item.id === workspaceId
        ? { ...item, sessionIds: [id, ...item.sessionIds] }
        : item
    )))
    selectSession(id)
  }

  const renameSession = () => {
    if (renameId === undefined) return
    const title = renameValue.trim()
    if (title === '') return
    setSessions((current) => current.map((item) => (
      item.id === renameId ? { ...item, title, updatedAt: '刚刚' } : item
    )))
    setRenameId(undefined)
    notify('已重命名', 'success')
  }

  const deleteSession = (id: string) => {
    const owner = workspaces.find((item) => item.sessionIds.includes(id))
    const remaining = sessions.filter((item) => item.id !== id)
    const nextActive = owner?.sessionIds.find((item) => item !== id)
      ?? remaining[0]?.id
    setSessions(remaining)
    setWorkspaces((current) => current.map((item) => ({
      ...item,
      sessionIds: item.sessionIds.filter((sessionId) => sessionId !== id),
    })))
    setDrafts((current) => {
      const { [id]: _removed, ...rest } = current
      return rest
    })
    if (detailsId !== undefined && sessions.find((item) => item.id === id)?.blocks.some((block) => block.id === detailsId)) {
      setDetailsId(undefined)
    }
    if (remaining.length === 0) {
      startSession(owner?.id)
      notify('已删除会话', 'info')
      return
    }
    if (activeId === id && nextActive !== undefined) selectSession(nextActive)
    notify('已删除会话', 'info')
  }

  const send = () => {
    if (running) {
      setRunning(false)
      notify('已停止生成', 'warning')
      return
    }
    const text = draft.trim()
    if (text === '') return
    const sessionId = session.id
    const user: ChatBlock = { kind: 'user', id: `u-${Date.now()}`, text }
    setSessions((current) => current.map((item) =>
      item.id === sessionId
        ? {
            ...item,
            title: item.blocks.length === 0 ? text.slice(0, 18) : item.title,
            updatedAt: '刚刚',
            blocks: [...item.blocks, user],
          }
        : item,
    ))
    setDrafts((current) => ({ ...current, [sessionId]: '' }))
    setView('chat')
    setRunning(true)
    window.setTimeout(() => {
      const reply: ChatBlock[] = [
        {
          kind: 'tool',
          id: `t-${Date.now()}`,
          name: 'bash',
          title: text.length > 42 ? `${text.slice(0, 42)}…` : text,
          state: 'done',
          detail: `${access} · ${model}`,
          output: `cwd ${workspace?.path ?? '~'}\naccess ${access}\nmodel ${model}`,
        },
        {
          kind: 'assistant',
          id: `a-${Date.now()}`,
          text: `收到：「${text}」\n\n这是本地回显，没有接真实模型。工作区、权限和模型都只改这一页的状态。`,
        },
      ]
      setSessions((current) => current.map((item) =>
        item.id === sessionId ? { ...item, blocks: [...item.blocks, ...reply] } : item,
      ))
      setRunning(false)
    }, 900)
  }

  const workspaceItems = useMemo(() => workspaces.map((item) => ({
    id: item.id,
    label: item.title,
    selected: item.id === workspace?.id,
    onSelect: () => {
      const first = item.sessionIds[0]
      if (first !== undefined) {
        selectSession(first)
        return
      }
      startSession(item.id)
    },
  })), [workspaces, workspace?.id])

  return (
    <>
      <AppFrame
        sidebarCollapsed={sidebarCollapsed}
        detailsOpen={detailsOpen}
        onSidebarWidth={onSidebarWidth}
        onDetailsWidth={onDetailsWidth}
        sidebar={(
          <Sidebar
            collapsed={sidebarCollapsed}
            width={sidebarWidth}
            workspaces={workspaces}
            sessions={sessions}
            activeSessionId={session.id}
            query={query}
            onQuery={setQuery}
            onToggle={() => { setSidebarCollapsed((value) => !value) }}
            onNewSession={() => { startSession() }}
            onSelectSession={selectSession}
            onRenameSession={(id) => {
              const target = sessions.find((item) => item.id === id)
              setRenameId(id)
              setRenameValue(target?.title ?? '')
            }}
            onDeleteSession={deleteSession}
            onOpenSettings={() => { setSettingsOpen(true) }}
            onOpenGallery={() => { window.location.hash = '#/gallery' }}
          />
        )}
        center={(
          <Conversation
            title={session.title}
            hero={hero}
            workspace={workspace}
            workspaceItems={workspaceItems}
            draft={draft}
            onDraft={setDraft}
            onSend={send}
            running={running}
            access={access}
            onAccess={setAccess}
            model={model}
            models={MODELS}
            onModel={(value) => { setModel(value as (typeof MODELS)[number]) }}
            blocks={session.blocks}
            view={view}
            onView={setView}
            onOpenDetails={(id) => { setDetailsId(id) }}
          />
        )}
        details={<DetailsPanel block={detailsBlock} onClose={() => { setDetailsId(undefined) }} />}
      />

      <Modal
        open={settingsOpen}
        onClose={() => { setSettingsOpen(false) }}
        title="设置"
        description="只改这一页的外观。模型在输入卡右侧切换。"
        footer={(
          <>
            <Button variant="outline" onClick={() => { setSettingsOpen(false) }}>取消</Button>
            <Button variant="primary" onClick={() => { setSettingsOpen(false) }}>完成</Button>
          </>
        )}
      >
        <div>
          <div className="mb-2 text-xs text-ink-3">外观</div>
          <div className="flex gap-2">
            <Pill active={theme === 'light'} onClick={() => { onTheme('light') }}>
              <span className="inline-flex items-center gap-1">
                <Sun size={14} strokeWidth={1.75} /> 浅色
              </span>
            </Pill>
            <Pill active={theme === 'dark'} onClick={() => { onTheme('dark') }}>
              <span className="inline-flex items-center gap-1">
                <Moon size={14} strokeWidth={1.75} /> 深色
              </span>
            </Pill>
          </div>
        </div>
      </Modal>

      <Modal
        open={renameId !== undefined}
        onClose={() => { setRenameId(undefined) }}
        title="重命名会话"
        footer={(
          <>
            <Button variant="outline" onClick={() => { setRenameId(undefined) }}>取消</Button>
            <Button variant="primary" onClick={renameSession}>保存</Button>
          </>
        )}
      >
        <Input
          className="w-full"
          value={renameValue}
          placeholder="会话标题"
          onChange={(event) => { setRenameValue(event.target.value) }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              renameSession()
            }
          }}
        />
      </Modal>
    </>
  )
}
