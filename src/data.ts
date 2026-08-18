export type AccessMode = 'read' | 'workspace' | 'full'
export type ThemeMode = 'light' | 'dark'

export type ChatBlock =
  | { kind: 'user'; id: string; text: string }
  | { kind: 'assistant'; id: string; text: string }
  | {
      kind: 'tool'
      id: string
      name: string
      title: string
      state: 'done' | 'ongoing' | 'error'
      detail: string
      output?: string
    }

export type Session = {
  id: string
  title: string
  updatedAt: string
  blocks: ChatBlock[]
}

export type Workspace = {
  id: string
  title: string
  path: string
  sessionIds: string[]
}

export const workspaces: Workspace[] = [
  {
    id: 'ws-harness',
    title: 'deepseek-harness',
    path: '/Users/franco/code/deepseek-harness',
    sessionIds: ['s-sidebar', 's-theme', 's-empty'],
  },
  {
    id: 'ws-demo',
    title: 'dsh-ui-demo',
    path: '/Users/franco/code/dsh-ui-demo',
    sessionIds: ['s-demo'],
  },
]

export const seedSessions: Session[] = [
  {
    id: 's-sidebar',
    title: '侧栏折叠动画',
    updatedAt: '今天 14:21',
    blocks: [
      {
        kind: 'user',
        id: 'u1',
        text: '把侧栏折叠做成 slide + crossfade，不要中途回流。',
      },
      {
        kind: 'tool',
        id: 't1',
        name: 'read',
        title: 'SidebarRoot.tsx',
        state: 'done',
        detail: 'packages/client/ui-sidebar/src/client/SidebarRoot.tsx',
        output: 'collapse is a slide plus crossfade: content freezes at its expanded width…',
      },
      {
        kind: 'tool',
        id: 't2',
        name: 'bash',
        title: 'pnpm exec vitest run ui-sidebar',
        state: 'done',
        detail: 'exit 0 · 8 passed',
        output: '✓ SidebarRoot collapse settle\n✓ rail-in only after live collapse\n✓ quietBars linger 2000ms',
      },
      {
        kind: 'assistant',
        id: 'a1',
        text: '折叠分两段：宽内容先在原宽度上淡出 150ms，列轨道同时收缩；settle 后再切到 56px rail，四个控件从右侧滑入。展开则反向淡入，避免中途回流。',
      },
    ],
  },
  {
    id: 's-theme',
    title: '暗色主题 token',
    updatedAt: '昨天 19:04',
    blocks: [
      {
        kind: 'user',
        id: 'u2',
        text: '品牌主色为什么不是蓝？',
      },
      {
        kind: 'assistant',
        id: 'a2',
        text: '`--dsw-alias-brand-primary` 在这套 token 里解析成墨色。选中态、发送按钮走 `--dsw-alias-state-business-primary` / `--dsw-alias-button-info-fill`，也就是 DeepSeek 蓝 500→400。',
      },
    ],
  },
  {
    id: 's-empty',
    title: '新会话',
    updatedAt: '周一',
    blocks: [],
  },
  {
    id: 's-demo',
    title: '抄一套 Vite Demo',
    updatedAt: '刚刚',
    blocks: [
      {
        kind: 'user',
        id: 'u3',
        text: '用 Vite + Tailwind + React 把这套前端抄出来，给我一个 Demo 页。',
      },
      {
        kind: 'tool',
        id: 't3',
        name: 'bash',
        title: 'npm create vite@latest dsh-ui-demo -- --template react-ts',
        state: 'done',
        detail: 'exit 0',
        output: 'Scaffolding project in /Users/franco/code/dsh-ui-demo…\nDone.',
      },
      {
        kind: 'assistant',
        id: 'a3',
        text: '独立项目已经搭好：三栏壳、侧栏、Hero、输入胶囊、会话气泡、工具卡、设置弹层、明暗主题都按原 token 复刻。没有接真实 agent 后端，发送会走本地回显。',
      },
    ],
  },
]
