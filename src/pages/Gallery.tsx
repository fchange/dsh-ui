import { useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  AlertTriangle,
  ArrowUp,
  Check,
  ChevronDown,
  Copy,
  Ellipsis,
  FolderClosed,
  FolderOpen,
  LayoutDashboard,
  MessageSquarePlus,
  Moon,
  PanelLeft,
  Plus,
  Search,
  Settings,
  Square,
  Sun,
  Triangle,
  X,
} from 'lucide-react'
import { AssistantText } from '../components/AssistantText'
import { BrandWordmark } from '../components/BrandWordmark'
import { Button, type ButtonVariant } from '../components/Button'
import { Composer } from '../components/Composer'
import { IconButton } from '../components/IconButton'
import { Input } from '../components/Input'
import { NavRow } from '../components/NavRow'
import { Tabs } from '../components/Tabs'
import { ToolRow } from '../components/ToolRow'
import { UserBubble } from '../components/UserBubble'
import { WorkspaceChip } from '../components/WorkspaceChip'
import { Catalog, CatalogBody, CatalogFooter, CatalogHeader } from '../components/Catalog'
import { Inspector, InspectorBody, InspectorHeader, InspectorMeta, InspectorTabs } from '../components/Inspector'
import { Menu } from '../components/Menu'
import { Modal } from '../components/Modal'
import { Pill } from '../components/Pill'
import { StateDot, type StateDotState } from '../components/StateDot'
import { notify, type NotifyLevel } from '../components/Toast'
import { Tooltip } from '../components/Tooltip'
import { cn } from '@/lib/utils'
import type { ThemeMode } from '../data'

type SectionId =
  | 'brand'
  | 'color'
  | 'type'
  | 'icon'
  | 'button'
  | 'input'
  | 'pill'
  | 'statedot'
  | 'tooltip'
  | 'menu'
  | 'modal'
  | 'toast'
  | 'iconbutton'
  | 'tabs'
  | 'composer'
  | 'userbubble'
  | 'assistant'
  | 'toolrow'
  | 'navrow'
  | 'workspacechip'
  | 'catalog'
  | 'inspector'

type SectionMeta = {
  id: SectionId
  label: string
  group: string
  source: string
  note: string
  usage: string
}

const SECTIONS: SectionMeta[] = [
  { id: 'brand', label: '品牌', group: '基础', source: 'BrandWordmark', note: '默认 Lucide Fish + name + badge。调用方传入 mark / name / badge 换成自己的品牌。', usage: '<BrandWordmark name="acme" badge="LAB" mark={<YourMark />} />' },
  { id: 'color', label: '颜色', group: '基础', source: 'ui-theme --dsw-alias-*', note: '语义 alias。浅色 / 深色共用同一组名字，不要抄静态色阶。', usage: 'background: var(--dsw-alias-bg-base)\ncolor: var(--dsw-alias-label-primary)' },
  { id: 'type', label: '字体', group: '基础', source: '--dsw-font-family', note: '系统栈 + SF Mono / JetBrains。角色来自 --dsw-font-*。', usage: 'font-family: var(--dsw-font-family)\nfont: 16px/24px var(--dsw-font-family)' },
  { id: 'icon', label: '图标', group: '基础', source: 'lucide-react', note: '开源 Lucide。currentColor，默认 16。组件库自用，不再手绘路径。', usage: 'import { Search } from \'lucide-react\'\n<Search size={16} strokeWidth={1.75} />' },
  { id: 'button', label: 'Button', group: '控件', source: 'ui-primitives/Button', note: '胶囊。primary 走墨色主色，发送钮另用 info-fill 蓝。', usage: '<Button variant="primary">新建</Button>\n<Button variant="outline" size="sm">取消</Button>' },
  { id: 'input', label: 'Input', group: '控件', source: 'ui-primitives/Input', note: '32 高、8 圆角。焦点边框走 brand（这套 token 里是墨色）。', usage: '<Input icon={<Search size={14} />} placeholder="搜索会话" />' },
  { id: 'pill', label: 'Pill', group: '控件', source: 'ui-primitives/Pill', note: '24 高芯片。有 onClick 才是按钮。', usage: '<Pill active onClick={...}>对话</Pill>\n<Pill>静态</Pill>' },
  { id: 'statedot', label: 'StateDot', group: '控件', source: 'ui-primitives/StateDot', note: '完成 / 注意 / 错误是 10px 光晕点。进行中是 3×3 像素追逐。横向一行、纵向一列；左边指示器强制正方形。', usage: '<StateDot state="done" />\n<StateDot state="ongoing" />' },
  { id: 'iconbutton', label: 'IconButton', group: '控件', source: 'Button icon + Tooltip', note: '图标按钮。带 label 的 Tooltip 和 aria-label。', usage: '<IconButton label="复制"><Copy size={14} /></IconButton>' },
  { id: 'tabs', label: 'Tabs', group: '控件', source: 'ui/tabs line', note: '下划线页签。选中走业务蓝，不是 ink。', usage: '<Tabs value="chat" items={[{ id: \'chat\', label: \'对话\' }]} />' },
  { id: 'tooltip', label: 'Tooltip', group: '浮层', source: 'ui-primitives/Tooltip', note: '锚点下方居中。悬停看文案。', usage: '<Tooltip label="收起侧栏">\n  <Button variant="outline">悬停</Button>\n</Tooltip>' },
  { id: 'menu', label: 'Menu', group: '浮层', source: 'ui-primitives/Menu', note: '218 起宽、r12、shadow-lv3。危险行用 error + danger hover。', usage: '<Menu open={open} onClose={...} items={[\n  { id: \'rename\', label: \'重命名\' },\n]} />' },
  { id: 'modal', label: 'Modal', group: '浮层', source: 'ui-primitives/Modal', note: '居中 r24 卡片 + 24% 遮罩 blur(2px)。Esc / 点遮罩关闭。', usage: '<Modal open title="创建工作区" onClose={...} footer={...}>\n  <Input />\n</Modal>' },
  { id: 'toast', label: 'Toast', group: '浮层', source: 'sonner', note: 'notify(text, level)。info / success / warning / error 各带默认图标。', usage: "notify('已复制到剪贴板', 'success')\nnotify('发送失败', 'error')" },
  { id: 'composer', label: 'Composer', group: '组合', source: 'Card + Textarea + Button', note: '输入卡。shadcn Card / Textarea / Button，外层仍是 22 圆角悬浮卡。', usage: '<Composer value={draft} onChange={setDraft} onSend={send} />' },
  { id: 'userbubble', label: 'UserBubble', group: '组合', source: 'UserBubble', note: '右对齐用户气泡。r22，bubble token。', usage: '<UserBubble>把侧栏折叠做成 slide + crossfade</UserBubble>' },
  { id: 'assistant', label: 'AssistantText', group: '组合', source: 'AssistantText', note: '助手正文。hover 出现复制。', usage: '<AssistantText text="收到。用 `--dsw-alias-*`。" />' },
  { id: 'toolrow', label: 'ToolRow', group: '组合', source: 'Item + StateDot', note: '工具调用行。点开详情。', usage: '<ToolRow name="read" title="SidebarRoot.tsx" state="done" />' },
  { id: 'navrow', label: 'NavRow', group: '组合', source: 'Item', note: '侧栏行。选中、缩进、hover 露出菜单。', usage: '<NavRow title="侧栏折叠动画" meta="今天" selected />' },
  { id: 'workspacechip', label: 'WorkspaceChip', group: '组合', source: 'Button + Menu', note: '工作区芯片。点选一项会改 label 和文件夹开合。', usage: '<WorkspaceChip value={id} onValueChange={setId} items={items} />' },
  { id: 'catalog', label: 'Catalog', group: '组合', source: 'Sidebar + ScrollArea', note: '左边目录壳。Header / Body / Footer，行用 NavRow。', usage: '<Catalog>\n  <CatalogHeader />\n  <CatalogBody><NavRow /></CatalogBody>\n</Catalog>' },
  { id: 'inspector', label: 'Inspector', group: '组合', source: 'ScrollArea + Tabs', note: '右边动态侧栏。Header / Tabs / Body / Meta，内容由调用方填。', usage: '<Inspector>\n  <InspectorHeader title="会话" onClose={...} />\n  <InspectorBody>...</InspectorBody>\n</Inspector>' },
]

const GROUPS = ['基础', '控件', '浮层', '组合'] as const

const LUCIDE_ICONS = [
  { name: 'Search', Icon: Search },
  { name: 'Plus', Icon: Plus },
  { name: 'Settings', Icon: Settings },
  { name: 'PanelLeft', Icon: PanelLeft },
  { name: 'MessagePlus', Icon: MessageSquarePlus },
  { name: 'Check', Icon: Check },
  { name: 'ChevronDown', Icon: ChevronDown },
  { name: 'X', Icon: X },
  { name: 'Copy', Icon: Copy },
  { name: 'FolderOpen', Icon: FolderOpen },
  { name: 'FolderClosed', Icon: FolderClosed },
  { name: 'ArrowUp', Icon: ArrowUp },
  { name: 'Square', Icon: Square },
  { name: 'Triangle', Icon: Triangle },
  { name: 'Sun', Icon: Sun },
  { name: 'Moon', Icon: Moon },
  { name: 'Alert', Icon: AlertTriangle },
  { name: 'Layout', Icon: LayoutDashboard },
] as const

const COLOR_SWATCHES: { name: string; varName: string; note: string }[] = [
  { name: 'bg-base', varName: '--dsw-alias-bg-base', note: '页面底' },
  { name: 'sidebar', varName: '--dsw-specific-sidebar-fill', note: '侧栏' },
  { name: 'bubble', varName: '--dsw-specific-bubble', note: '用户气泡' },
  { name: 'input', varName: '--dsw-specific-input-major', note: '输入卡' },
  { name: 'ink', varName: '--dsw-alias-label-primary', note: '主文字' },
  { name: 'ink-2', varName: '--dsw-alias-label-secondary', note: '次文字' },
  { name: 'info', varName: '--dsw-alias-state-business-primary', note: '业务蓝' },
  { name: 'info-fill', varName: '--dsw-alias-button-info-fill', note: '发送钮' },
  { name: 'ok', varName: '--dsw-alias-state-success-primary', note: '完成' },
  { name: 'warn', varName: '--dsw-alias-state-warn-primary', note: '注意' },
  { name: 'err', varName: '--dsw-alias-state-error-primary', note: '错误' },
  { name: 'code', varName: '--dsw-alias-markdown-code-block', note: '代码块' },
]

export function Gallery({
  theme,
  onTheme,
}: {
  theme: ThemeMode
  onTheme: (theme: ThemeMode) => void
}) {
  const reduce = useReducedMotion()
  const [active, setActive] = useState<SectionId>('button')
  const [query, setQuery] = useState('')
  const [pill, setPill] = useState('chat')
  const [modalOpen, setModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [inspectorPane, setInspectorPane] = useState('note')

  const section = SECTIONS.find((item) => item.id === active) ?? SECTIONS[0]
  const grouped = useMemo(() => GROUPS.map((group) => ({
    group,
    items: SECTIONS.filter((item) => item.group === group),
  })), [])

  const copyUsage = async () => {
    try {
      await navigator.clipboard.writeText(section.usage)
      setCopied(true)
      window.setTimeout(() => { setCopied(false) }, 1200)
    } catch {
      notify('剪贴板不可用')
    }
  }

  const select = (id: SectionId) => {
    setActive(id)
    setInspectorPane('note')
  }

  const preview = (
    <StageBody
      id={active}
      query={query}
      onQuery={setQuery}
      pill={pill}
      onPill={setPill}
      modalOpen={modalOpen}
      onModal={setModalOpen}
      onToast={notify}
    />
  )

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg-base text-ink">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border-l2 px-5">
        <div className="flex items-center gap-3">
          <BrandWordmark size={20} />
          <span className="rounded-full border border-hover bg-info-soft px-2 py-px font-mono text-[11px] leading-[18px] text-ink-blue">
            组件库
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Pill active={theme === 'light'} onClick={() => { onTheme('light') }}>
            <span className="inline-flex items-center gap-1"><Sun size={14} strokeWidth={1.75} /> 浅色</span>
          </Pill>
          <Pill active={theme === 'dark'} onClick={() => { onTheme('dark') }}>
            <span className="inline-flex items-center gap-1"><Moon size={14} strokeWidth={1.75} /> 深色</span>
          </Pill>
          <Button variant="outline" size="sm" onClick={() => { window.location.hash = '#/' }}>
            回到 Demo
          </Button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_320px]">
        <Catalog className="min-h-[220px] border-b border-border-l1 lg:min-h-0 lg:border-r lg:border-b-0">
          <CatalogHeader>
            <div className="px-1 py-2 text-[11px] tracking-wide text-ink-cap uppercase">目录</div>
          </CatalogHeader>
          <CatalogBody>
            {grouped.map((bucket) => (
              <div key={bucket.group} className="mb-3">
                <div className="px-2 pb-1 text-[11px] tracking-wide text-ink-cap uppercase">
                  {bucket.group}
                </div>
                {bucket.items.map((item) => (
                  <NavRow
                    key={item.id}
                    title={item.label}
                    selected={item.id === active}
                    onSelect={() => { select(item.id) }}
                  />
                ))}
              </div>
            ))}
          </CatalogBody>
          <CatalogFooter>
            <NavRow title="回到 Demo" onSelect={() => { window.location.hash = '#/' }} />
          </CatalogFooter>
        </Catalog>

        <section className="gallery-stage relative min-h-0 overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,var(--dsw-alias-bg-base),transparent)]" />
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex shrink-0 items-end justify-between px-6 pt-5 pb-3">
              <div>
                <div className="text-[11px] tracking-wide text-ink-cap uppercase">{section.group}</div>
                <h1 className="m-0 text-[22px] leading-8 font-medium">{section.label}</h1>
              </div>
              <span className="font-mono text-[11px] text-ink-3">{section.source}</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={reduce ? false : { opacity: 0, y: 12, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8, scale: 0.99 }}
                  transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                  className="flex min-h-[calc(100%-8px)] items-center justify-center rounded-2xl border border-border-l2 bg-[color-mix(in_srgb,var(--dsw-alias-bg-base)_86%,transparent)] p-8 shadow-lv2 backdrop-blur-[2px]"
                >
                  {preview}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        <Inspector className="min-w-0 border-t border-border-l2 lg:border-t-0 lg:border-l">
          <InspectorHeader title={section.label} />
          <InspectorTabs
            value={inspectorPane}
            onValueChange={setInspectorPane}
            items={[
              { id: 'note', label: '说明' },
              { id: 'usage', label: '用法' },
            ]}
          />
          <InspectorBody frameKey={`${active}-${inspectorPane}`}>
            {inspectorPane === 'usage' ? (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-[11px] tracking-wide text-ink-cap uppercase">代码</div>
                  <button
                    type="button"
                    className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-lg border-none bg-transparent px-2 text-[12px] text-ink-2 hover:bg-hover"
                    onClick={() => { void copyUsage() }}
                  >
                    {copied ? <Check size={12} strokeWidth={1.75} /> : <Copy size={12} strokeWidth={1.75} />}
                    {copied ? '已复制' : '复制'}
                  </button>
                </div>
                <pre className="m-0 overflow-x-auto rounded-xl bg-code p-3 font-mono text-[12px] leading-[18px] text-ink-2 whitespace-pre-wrap">
                  {section.usage}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="m-0 text-[13px] leading-5 text-ink-2">{section.note}</p>
                <InspectorMeta
                  items={[
                    { label: '分组', value: section.group },
                    { label: '来源', value: <span className="font-mono text-[12px]">{section.source}</span> },
                  ]}
                />
                <p className="m-0 text-[12px] leading-[18px] text-ink-3">
                  中间是活预览。切左边目录会换组件。
                </p>
              </div>
            )}
          </InspectorBody>
        </Inspector>
      </div>

    </div>
  )
}

function StageBody({
  id,
  query,
  onQuery,
  pill,
  onPill,
  modalOpen,
  onModal,
  onToast,
}: {
  id: SectionId
  query: string
  onQuery: (value: string) => void
  pill: string
  onPill: (value: string) => void
  modalOpen: boolean
  onModal: (open: boolean) => void
  onToast: (text: string, level?: NotifyLevel) => void
}) {
  const [tab, setTab] = useState('chat')
  const [inspectorTab, setInspectorTab] = useState('output')
  const [workspace, setWorkspace] = useState('dsh')
  const [groupOpen, setGroupOpen] = useState(true)
  switch (id) {
    case 'brand':
      return (
        <div className="flex flex-wrap items-end justify-center gap-10">
          <figure className="flex flex-col items-center gap-3">
            <BrandWordmark size={28} />
            <figcaption className="font-mono text-[11px] text-ink-3">默认</figcaption>
          </figure>
          <figure className="flex flex-col items-center gap-3">
            <BrandWordmark size={28} name="acme" badge="LAB" mark={<LayoutDashboard size={28} strokeWidth={1.5} />} />
            <figcaption className="font-mono text-[11px] text-ink-3">传入 brand</figcaption>
          </figure>
          <figure className="flex flex-col items-center gap-3">
            <BrandWordmark size={28} name="notebook" badge={null} />
            <figcaption className="font-mono text-[11px] text-ink-3">无徽章</figcaption>
          </figure>
        </div>
      )
    case 'color':
      return (
        <div className="grid w-full max-w-[640px] grid-cols-2 gap-2 sm:grid-cols-3">
          {COLOR_SWATCHES.map((swatch, index) => (
            <motion.div
              key={swatch.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.22 }}
              className="overflow-hidden rounded-xl border border-border-l2 bg-bg-base"
            >
              <div className="h-14 border-b border-border-l1" style={{ background: `var(${swatch.varName})` }} />
              <div className="px-2.5 py-2">
                <div className="font-mono text-[12px] text-ink">{swatch.name}</div>
                <div className="text-[11px] text-ink-3">{swatch.note}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )
    case 'type':
      return (
        <div className="flex w-full max-w-[520px] flex-col gap-4">
          <p className="m-0 text-[26px] leading-8 font-medium">探索未至之境</p>
          <p className="m-0 text-base leading-6">16 / 24 用户气泡与输入草稿</p>
          <p className="m-0 text-sm leading-[22px] text-ink-2">14 / 22 界面正文与按钮</p>
          <p className="m-0 text-xs leading-[18px] text-ink-3">12 / 18 说明、时间、caption</p>
          <p className="m-0 font-mono text-[13px] leading-[22px]">pnpm exec vitest run ui-sidebar</p>
        </div>
      )
    case 'icon':
      return (
        <div className="grid w-full max-w-[560px] grid-cols-3 gap-2 sm:grid-cols-6">
          {LUCIDE_ICONS.map(({ name, Icon }, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02, duration: 0.2 }}
              whileHover={{ y: -3, scale: 1.04 }}
              className="flex flex-col items-center gap-2 rounded-xl border border-border-l1 bg-bg-base px-2 py-3 text-ink-2"
            >
              <Icon size={16} strokeWidth={1.75} />
              <span className="font-mono text-[10px] text-ink-3">{name}</span>
            </motion.div>
          ))}
        </div>
      )
    case 'button':
      return (
        <div className="flex flex-col items-center gap-6">
          <Row label="variant / md">
            {(['primary', 'ghost', 'outline', 'toolbar'] as const).map((variant: ButtonVariant) => (
              <Button key={variant} variant={variant}>{variant}</Button>
            ))}
          </Row>
          <Row label="sm + icon">
            <Button size="sm" variant="primary" icon={<Plus size={14} strokeWidth={1.75} />}>新建</Button>
            <Button size="sm" variant="outline" icon={<Search size={14} strokeWidth={1.75} />}>搜索</Button>
            <Button size="sm" variant="ghost" icon={<Settings size={14} strokeWidth={1.75} />}>设置</Button>
          </Row>
          <Row label="disabled">
            <Button variant="primary" disabled>不可用</Button>
            <Button variant="outline" disabled>不可用</Button>
          </Row>
        </div>
      )
    case 'input':
      return (
        <div className="flex w-full max-w-md flex-col gap-3">
          <Input
            className="w-full"
            icon={<Search size={14} strokeWidth={1.75} />}
            placeholder="搜索会话"
            value={query}
            onChange={(event) => { onQuery(event.target.value) }}
          />
          <Input className="w-full" placeholder="无图标" />
        </div>
      )
    case 'pill':
      return (
        <div className="flex flex-wrap justify-center gap-2">
          {['chat', 'plan', '轨迹'].map((item) => (
            <Pill key={item} active={pill === item} onClick={() => { onPill(item) }}>{item}</Pill>
          ))}
          <Pill>静态</Pill>
        </div>
      )
    case 'statedot':
      return (
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="font-mono text-[11px] text-ink-cap">横向</div>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {STATE_DOT_STATES.map((state) => (
                <StateDotSample key={state} state={state} />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="font-mono text-[11px] text-ink-cap">纵向</div>
            <div className="flex flex-col items-start gap-3">
              {STATE_DOT_STATES.map((state) => (
                <StateDotSample key={state} state={state} />
              ))}
            </div>
          </div>
        </div>
      )
    case 'tooltip':
      return (
        <div className="flex gap-3">
          <Tooltip label="收起侧栏">
            <Button variant="outline" icon={<PanelLeft size={14} strokeWidth={1.75} />}>悬停我</Button>
          </Tooltip>
          <Tooltip label="发送消息">
            <button type="button" className="grid size-[34px] place-items-center rounded-full border-none bg-btn-info text-white">
              <ArrowUp size={16} strokeWidth={1.75} />
            </button>
          </Tooltip>
        </div>
      )
    case 'menu':
      return (
        <Menu
          items={[
            { id: 'rename', label: '重命名', icon: <Copy size={14} strokeWidth={1.75} /> },
            { id: 'copy', label: '复制标题', selected: true, icon: <Check size={14} strokeWidth={1.75} /> },
            { id: 'delete', label: '删除', danger: true, icon: <X size={14} strokeWidth={1.75} /> },
          ]}
        >
          <Button variant="outline">
            打开菜单
            <ChevronDown size={12} strokeWidth={1.75} />
          </Button>
        </Menu>
      )
    case 'modal':
      return (
        <>
          <Button variant="primary" onClick={() => { onModal(true) }}>打开对话框</Button>
          <Modal
            open={modalOpen}
            onClose={() => { onModal(false) }}
            title="创建工作区"
            description="选一个本地目录作为会话的工作区。Demo 不会真的写盘。"
            footer={(
              <>
                <Button variant="outline" onClick={() => { onModal(false) }}>取消</Button>
                <Button variant="primary" onClick={() => { onModal(false) }}>创建</Button>
              </>
            )}
          >
            <Input className="w-full" icon={<FolderOpen size={14} strokeWidth={1.75} />} placeholder="/Users/franco/code/dsh-ui-demo" />
          </Modal>
        </>
      )
    case 'toast':
      return (
        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="outline" onClick={() => { onToast('会话已就绪', 'info') }}>信息</Button>
          <Button variant="outline" onClick={() => { onToast('已复制到剪贴板', 'success') }}>成功</Button>
          <Button variant="outline" onClick={() => { onToast('图片较大，建议压缩后再传', 'warning') }}>警告</Button>
          <Button variant="outline" onClick={() => { onToast('图片总大小超过 20 MB，请移除部分图片', 'error') }}>错误</Button>
        </div>
      )
    case 'iconbutton':
      return (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <IconButton label="复制" onClick={() => { onToast('已复制', 'success') }}>
            <Copy size={14} strokeWidth={1.75} />
          </IconButton>
          <IconButton label="搜索">
            <Search size={14} strokeWidth={1.75} />
          </IconButton>
          <IconButton label="设置" size="md">
            <Settings size={16} strokeWidth={1.75} />
          </IconButton>
          <IconButton label="不可用" disabled>
            <Plus size={14} strokeWidth={1.75} />
          </IconButton>
        </div>
      )
    case 'tabs':
      return (
        <div className="w-full max-w-[420px] border-b border-border-l2">
          <Tabs
            value={tab}
            onValueChange={setTab}
            items={[
              { id: 'chat', label: '对话' },
              { id: 'plan', label: '计划' },
              { id: 'trace', label: '轨迹' },
            ]}
          />
        </div>
      )
    case 'composer':
      return (
        <div className="w-full max-w-[560px]">
          <Composer
            value={query}
            onChange={onQuery}
            onSend={() => { onToast('Demo 已发送', 'success') }}
            placeholder="给智能体发消息"
          />
        </div>
      )
    case 'userbubble':
      return (
        <div className="w-full max-w-[560px]">
          <UserBubble>把侧栏折叠做成 slide + crossfade，不要中途回流。</UserBubble>
        </div>
      )
    case 'assistant':
      return (
        <div className="w-full max-w-[560px]">
          <AssistantText text="收到。用 `--dsw-alias-*` 语义色，不要抄静态色阶。悬停这段文字会出现复制。" />
        </div>
      )
    case 'toolrow':
      return (
        <div className="flex w-full max-w-[520px] flex-col gap-1">
          <ToolRow
            name="read"
            title="SidebarRoot.tsx"
            detail="packages/client/ui-sidebar"
            state="done"
            onClick={() => { onToast('打开详情', 'info') }}
          />
          <ToolRow name="bash" title="pnpm run typecheck" detail="exit 0" state="ongoing" />
          <ToolRow name="grep" title="SectionId" state="warning" />
          <ToolRow name="write" title="Gallery.tsx" state="error" />
        </div>
      )
    case 'navrow':
      return (
        <div className="w-full max-w-[280px] rounded-xl border border-border-l2 bg-sidebar p-2">
          <NavRow
            title="工作区"
            onSelect={() => { setGroupOpen((current) => !current) }}
            leading={(
              <span className="inline-flex items-center gap-1.5">
                <ChevronDown
                  className={cn('text-ink-3 transition-transform duration-150', !groupOpen && '-rotate-90')}
                  size={12}
                  strokeWidth={1.75}
                />
                {groupOpen
                  ? <FolderOpen size={16} strokeWidth={1.75} />
                  : <FolderClosed size={16} strokeWidth={1.75} />}
              </span>
            )}
          />
          {groupOpen && (
            <>
              <NavRow
                title="侧栏折叠动画"
                meta="今天"
                selected
                indent
                menu={(
                  <Menu
                    align="end"
                    items={[
                      { id: 'rename', label: '重命名' },
                      { id: 'delete', label: '删除', danger: true },
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
              <NavRow title="组件库三段式" meta="昨天" indent />
            </>
          )}
        </div>
      )
    case 'workspacechip':
      return (
        <WorkspaceChip
          value={workspace}
          onValueChange={setWorkspace}
          items={[
            { id: 'dsh', label: 'deepseek-harness' },
            { id: 'demo', label: 'dsh-ui-demo' },
            { id: 'none', label: '不绑定工作区' },
          ]}
        />
      )
    case 'catalog':
      return (
        <div className="h-[320px] w-full max-w-[280px] overflow-hidden rounded-xl border border-border-l2">
          <Catalog>
            <CatalogHeader>
              <div className="px-1 py-2 text-sm font-medium">目录</div>
            </CatalogHeader>
            <CatalogBody>
              <NavRow title="工作区" leading={<FolderOpen size={16} strokeWidth={1.75} />} />
              <NavRow title="侧栏折叠动画" meta="今天" selected indent />
              <NavRow title="暗色主题 token" meta="昨天" indent />
            </CatalogBody>
            <CatalogFooter>
              <NavRow title="设置" leading={<Settings size={16} strokeWidth={1.75} />} />
            </CatalogFooter>
          </Catalog>
        </div>
      )
    case 'inspector':
      return (
        <div className="h-[320px] w-full max-w-[320px] overflow-hidden rounded-xl border border-border-l2">
          <Inspector>
            <InspectorHeader title="read" onClose={() => { onToast('关闭侧栏', 'info') }} onBack={() => { onToast('返回会话', 'info') }} />
            <InspectorTabs
              value={inspectorTab}
              onValueChange={setInspectorTab}
              items={[
                { id: 'output', label: '输出' },
                { id: 'info', label: '信息' },
              ]}
            />
            <InspectorBody frameKey={inspectorTab}>
              {inspectorTab === 'info' ? (
                <InspectorMeta
                  items={[
                    { label: '工具', value: 'read' },
                    { label: '调用', value: 'SidebarRoot.tsx' },
                    { label: '状态', value: 'done' },
                  ]}
                />
              ) : (
                <pre className="rounded-xl bg-code p-3 font-mono text-[12px] text-ink-2">collapse is a slide plus crossfade…</pre>
              )}
            </InspectorBody>
          </Inspector>
        </div>
      )
  }
}

const STATE_DOT_STATES: readonly StateDotState[] = ['done', 'ongoing', 'warning', 'error']

function StateDotSample({ state }: { state: StateDotState }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-ink-2">
      <span className="inline-grid size-2.5 shrink-0 aspect-square place-items-center overflow-hidden">
        <StateDot state={state} />
      </span>
      {state}
    </span>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="font-mono text-[11px] text-ink-cap">{label}</div>
      <div className="flex flex-wrap items-center justify-center gap-2">{children}</div>
    </div>
  )
}
