import { notFound } from 'next/navigation'
import { IconGroup } from '@/components/icon-group/icon-group'
import { getCachedListByGroup } from '@/services/emoji-cache'
import { LibraryGroupPageProps } from '../types'

/**
 * 캐시된 함수의 실패와 Next 의 프리렌더 제어 흐름은 그대로 흘려보낸다.
 * 여기서 잡으면 프레임워크가 처리해야 할 예외까지 삼킨다.
 */
export async function LibraryGroupPage({ group }: LibraryGroupPageProps) {
  const rows = await getCachedListByGroup({ group })

  // 없는 그룹에 빈 목록을 200 으로 주지 않는다.
  if (rows.length === 0) {
    notFound()
  }

  return <IconGroup items={rows} />
}
