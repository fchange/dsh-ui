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
  const color =
    state === 'ongoing'
      ? 'text-[var(--dsw-static-deepseek-450)]'
      : state === 'done'
        ? 'text-ok'
        : state === 'warning'
          ? 'text-warn'
          : 'text-err'

  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden',
        color,
        className,
      )}
      style={{ width: size, height: size, aspectRatio: '1 / 1' }}
      aria-hidden
    >
      {state === 'ongoing' ? (
        <svg
          className="block size-full"
          width={size}
          height={size}
          viewBox="0 0 10 10"
          preserveAspectRatio="xMidYMid meet"
          shapeRendering="crispEdges"
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
      ) : (
        <>
          <span className="absolute inset-0 rounded-full bg-current opacity-10" />
          <span className="absolute inset-[20%] rounded-full bg-current" />
        </>
      )}
    </span>
  )
}
