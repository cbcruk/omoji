'use client'

import { IconGroupSkeleton } from '@/components/icon-group/icon-group-skeleton'
import { usePendingIconCount } from '@/context/pending-icon-count-context'

/**
 * 사이드바에서 클릭한 카테고리의 개수만큼 플레이스홀더를 그린다.
 * URL 로 바로 들어온 경우엔 개수를 알 수 없어 기본값으로 떨어진다.
 */
export function LibrarySkeleton() {
  const [pendingIconCount] = usePendingIconCount()

  return <IconGroupSkeleton count={pendingIconCount ?? undefined} />
}
