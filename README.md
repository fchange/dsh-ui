# dsh-ui

DSH 界面风格的组件库，基于 [shadcn](https://ui.shadcn.com) 二次封装。

Token、几何和交互跟 DeepSeek Harness 浏览器端对齐：`--dsw-alias-*` 语义色、胶囊按钮、22 圆角输入卡、侧栏行、工具调用。行为层用 shadcn / Radix（焦点、键盘、Portal），外观层走 DSH token。

除 `StateDot` 外，产品组件都包在 shadcn 之上。图标只用 Lucide。

## 跑起来

```sh
npm install
npm run dev
```

- [Demo](http://localhost:5173/#/)：三栏壳、会话、Hero / 对话阶段 Composer
- [组件库](http://localhost:5173/#/gallery)：目录 / 预览 / 说明

## 组件

| 组 | 组件 | 底层 |
| --- | --- | --- |
| 基础 | `BrandWordmark` | 可传入 `mark` / `name` / `badge` |
| 控件 | `Button` `IconButton` `Input` `Pill` `Tabs` | shadcn Button / InputGroup / Tabs |
| 控件 | `StateDot` | 手写（10px 光晕 / 3×3 追逐） |
| 浮层 | `Tooltip` `Menu` `Modal` `Toast` | shadcn Tooltip / DropdownMenu / Dialog / Sonner |
| 组合 | `Composer` | Card + Textarea + Button |
| 组合 | `UserBubble` `AssistantText` `ToolRow` | 对话气泡、正文、工具行 |
| 组合 | `NavRow` `WorkspaceChip` | 侧栏行、工作区选择 |

`src/components/ui/*` 是 shadcn 原件。`src/components/*` 是产品封装，Demo 和 Gallery 只引用这一层。

## 栈

Vite 8 · React 19 · Tailwind v4 · shadcn radix-nova · Lucide · Motion
