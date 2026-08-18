import { useState } from 'react'
import { ChevronDown, FolderClosed, FolderOpen } from 'lucide-react'
import { Menu, type MenuItem } from './Menu'

export function WorkspaceChip({
  value,
  onValueChange,
  items,
  placeholder = '选择工作区',
}: {
  value?: string
  onValueChange?: (id: string) => void
  items: MenuItem[]
  placeholder?: string
}) {
  const [uncontrolled, setUncontrolled] = useState(
    () => items.find((item) => item.selected)?.id,
  )
  const selectedId = value ?? uncontrolled
  const selected = items.find((item) => item.id === selectedId)
  const empty = selected === undefined || selected.id === 'none' || selected.label === ''

  return (
    <Menu
      items={items.map((item) => ({
        ...item,
        selected: item.id === selectedId,
        onSelect: () => {
          if (value === undefined) setUncontrolled(item.id)
          onValueChange?.(item.id)
          item.onSelect?.()
        },
      }))}
    >
      <button
        type="button"
        className="inline-flex max-w-[360px] min-h-7 cursor-pointer items-center gap-1 rounded-2xl border-none bg-transparent px-2 text-[13px] leading-5 font-medium text-ink hover:bg-hover"
      >
        {empty
          ? <FolderClosed className="shrink-0" size={16} strokeWidth={1.75} />
          : <FolderOpen className="shrink-0" size={16} strokeWidth={1.75} />}
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {empty ? placeholder : selected.label}
        </span>
        <ChevronDown className="shrink-0 text-ink-cap" size={12} strokeWidth={1.75} />
      </button>
    </Menu>
  )
}
