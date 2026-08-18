import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '../lib/cn'

const SIDEBAR_MIN = 264
const SIDEBAR_MAX = 420
const SIDEBAR_DEFAULT = 280
const SIDEBAR_COLLAPSED = 56
const SIDEBAR_AUTO_COLLAPSE = 1024
const DETAILS_MIN = 300
const DETAILS_MAX = 520
const DETAILS_DEFAULT = 360
const CENTER_MIN = 640

function clamp(px: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(px)))
}

function solve(viewport: number, sidebarPref: number, detailsPref: number) {
  const sidebar = sidebarPref === 0 ? SIDEBAR_COLLAPSED : clamp(sidebarPref, SIDEBAR_MIN, SIDEBAR_MAX)
  const details0 = detailsPref === 0 ? 0 : clamp(detailsPref, DETAILS_MIN, DETAILS_MAX)
  if (sidebar + details0 + CENTER_MIN <= viewport) {
    return { sidebar, center: viewport - sidebar - details0, details: details0 }
  }
  const details1 = details0 === 0 ? 0 : Math.max(DETAILS_MIN, viewport - sidebar - CENTER_MIN)
  if (sidebar + details1 + CENTER_MIN <= viewport) {
    return { sidebar, center: CENTER_MIN, details: details1 }
  }
  return { sidebar, center: Math.max(0, viewport - sidebar), details: 0 }
}

function DragHandle({
  side,
  left,
  onStart,
  onDrag,
  onEnd,
}: {
  side: 'sidebar' | 'details'
  left: number
  onStart: () => void
  onDrag: (dx: number) => void
  onEnd: () => void
}) {
  const [dragging, setDragging] = useState(false)
  const origin = useRef(0)
  const latest = useRef(0)
  const frame = useRef<number | null>(null)

  return (
    <div
      className={cn(
        'absolute top-0 bottom-0 z-2 w-2 -ml-1 cursor-col-resize touch-none transition-[left] duration-300 ease-ds',
        dragging && 'transition-none',
      )}
      style={{ left }}
      data-side={side}
      onPointerDown={(event) => {
        event.preventDefault()
        event.currentTarget.setPointerCapture(event.pointerId)
        origin.current = event.clientX
        latest.current = event.clientX
        onStart()
        setDragging(true)
      }}
      onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
        latest.current = event.clientX
        frame.current ??= requestAnimationFrame(() => {
          frame.current = null
          onDrag(latest.current - origin.current)
        })
      }}
      onPointerUp={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
        event.currentTarget.releasePointerCapture(event.pointerId)
        if (frame.current !== null) {
          cancelAnimationFrame(frame.current)
          frame.current = null
        }
        onDrag(latest.current - origin.current)
        setDragging(false)
        onEnd()
      }}
    >
      {side === 'details' && (
        <span
          className={cn(
            'pointer-events-none absolute top-1/2 left-1/2 h-8 w-3 -translate-x-1/2 -translate-y-1/2 rounded-[10px] border border-border-l2-thin bg-btn-float opacity-0 transition-opacity duration-300',
            dragging && 'opacity-100 bg-btn-float-hover',
          )}
        />
      )}
    </div>
  )
}

export function AppFrame({
  sidebar,
  center,
  details,
  sidebarCollapsed,
  detailsOpen,
  onSidebarWidth,
  onDetailsWidth,
}: {
  sidebar: ReactNode
  center: ReactNode
  details: ReactNode
  sidebarCollapsed: boolean
  detailsOpen: boolean
  onSidebarWidth: (px: number) => void
  onDetailsWidth: (px: number) => void
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [viewport, setViewport] = useState(() => window.innerWidth)
  const [sidebarPref, setSidebarPref] = useState(SIDEBAR_DEFAULT)
  const [detailsPref, setDetailsPref] = useState(DETAILS_DEFAULT)
  const [dragging, setDragging] = useState(false)
  const sidebarBase = useRef(0)
  const detailsBase = useRef(0)

  useEffect(() => {
    const el = frameRef.current
    if (el === null) return
    let raf: number | null = null
    const observer = new ResizeObserver(() => {
      raf ??= requestAnimationFrame(() => {
        raf = null
        const width = el.getBoundingClientRect().width
        if (width > 0) setViewport(width)
      })
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
      if (raf !== null) cancelAnimationFrame(raf)
    }
  }, [])

  const narrow = viewport < SIDEBAR_AUTO_COLLAPSE
  const collapsed = sidebarCollapsed || (narrow && sidebarCollapsed)
  const cols = solve(viewport, collapsed ? 0 : sidebarPref, detailsOpen ? detailsPref : 0)
  const colsRef = useRef(cols)
  colsRef.current = cols

  useEffect(() => {
    onSidebarWidth(cols.sidebar)
  }, [cols.sidebar, onSidebarWidth])

  useEffect(() => {
    onDetailsWidth(cols.details)
  }, [cols.details, onDetailsWidth])

  const onSidebarStart = useCallback(() => {
    sidebarBase.current = colsRef.current.sidebar
    setDragging(true)
  }, [])
  const onDetailsStart = useCallback(() => {
    detailsBase.current = colsRef.current.details
    setDragging(true)
  }, [])
  const onEnd = useCallback(() => { setDragging(false) }, [])

  return (
    <div
      ref={frameRef}
      className={cn(
        'relative grid h-full overflow-hidden bg-bg-base transition-[grid-template-columns] duration-300 ease-ds',
        dragging && 'transition-none',
      )}
      style={{ gridTemplateColumns: `${cols.sidebar}px minmax(0, 1fr) ${cols.details}px` }}
      data-sidebar-collapsed={collapsed || undefined}
      data-details-collapsed={cols.details === 0 || undefined}
    >
      <div className="min-w-0 overflow-hidden border-r border-border-l1 bg-sidebar">
        {sidebar}
      </div>
      <div className="flex min-w-0 flex-col overflow-hidden">{center}</div>
      <div className={cn('min-w-0 overflow-hidden', cols.details > 0 && 'border-l border-border-l2')}>
        {details}
      </div>
      {!collapsed && (
        <DragHandle
          side="sidebar"
          left={cols.sidebar}
          onStart={onSidebarStart}
          onDrag={(dx) => { setSidebarPref(clamp(sidebarBase.current + dx, SIDEBAR_MIN, SIDEBAR_MAX)) }}
          onEnd={onEnd}
        />
      )}
      {cols.details > 0 && (
        <DragHandle
          side="details"
          left={viewport - cols.details}
          onStart={onDetailsStart}
          onDrag={(dx) => { setDetailsPref(clamp(detailsBase.current - dx, DETAILS_MIN, DETAILS_MAX)) }}
          onEnd={onEnd}
        />
      )}
    </div>
  )
}

export { SIDEBAR_COLLAPSED, SIDEBAR_DEFAULT }
