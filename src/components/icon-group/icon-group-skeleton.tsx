'use client'

import { useIconSizeContext } from '@/context/icon-size-context'

const DEFAULT_COUNT = 24

/** person-role(492) 같은 큰 서브그룹을 그대로 그리면 플레이스홀더만 수백 개가 된다 */
const MAX_COUNT = 60

type IconGroupSkeletonProps = {
  count?: number
}

export function IconGroupSkeleton({
  count = DEFAULT_COUNT,
}: IconGroupSkeletonProps) {
  const [size] = useIconSizeContext()

  return (
    <div className="flex flex-wrap gap-4" aria-hidden>
      {Array.from({ length: Math.min(count, MAX_COUNT) }).map((_, i) => (
        <div
          key={i}
          style={{ width: size, height: size }}
          className="animate-pulse rounded bg-white/10"
        />
      ))}
    </div>
  )
}
