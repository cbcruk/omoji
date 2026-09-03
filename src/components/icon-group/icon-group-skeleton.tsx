'use client'

import { useIconSizeContext } from '@/context/icon-size-context'

const DEFAULT_COUNT = 24

type IconGroupSkeletonProps = {
  count?: number
}

export function IconGroupSkeleton({
  count = DEFAULT_COUNT,
}: IconGroupSkeletonProps) {
  const [size] = useIconSizeContext()

  return (
    <div className="flex flex-wrap gap-4" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{ width: size, height: size }}
          className="animate-pulse rounded bg-white/10"
        />
      ))}
    </div>
  )
}
