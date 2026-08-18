import { cn } from '../lib/cn'

export type StateDotState = 'done' | 'warning' | 'ongoing' | 'error'

const CELLS: readonly (readonly [number, number])[] = [
  [0, 0], [4, 0], [8, 0], [8, 4], [8, 8], [4, 8], [0, 8], [0, 4],
]

export function StateDot({
  state,
  size = 10,
  className,
}: {
  state: StateDotState
  size?: number
  className?: string
}) {
  if (state === 'ongoing') {
    return (
      <svg
        className={cn('shrink-0 text-[var(--dsw-static-deepseek-450)]', className)}
        width={size}
        height={size}
        viewBox="0 0 10 10"
        shapeRendering="crispEdges"
        aria-hidden
      >
        {CELLS.map(([x, y], index) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="2"
            height="2"
            className="fill-current opacity-15 [animation:dsh-state-dot-chase_1s_infinite]"
            style={{ animationDelay: `${(index - CELLS.length) * 125}ms` }}
          />
        ))}
      </svg>
    )
  }
  const color =
    state === 'done' ? 'text-ok' : state === 'warning' ? 'text-warn' : 'text-err'
  return (
    <span
      className={cn('relative inline-block shrink-0', color, className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span className="absolute inset-0 rounded-full bg-current opacity-10" />
      <span className="absolute inset-[20%] rounded-full bg-current" />
    </span>
  )
}
