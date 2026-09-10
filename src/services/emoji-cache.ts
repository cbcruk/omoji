import { cacheLife, cacheTag } from 'next/cache'
import { Effect } from 'effect'
import { EmojiService } from './Emoji'
import { appRuntime } from '@/runtime/app-runtime'
import {
  LibraryGroupPageProps,
  LibrarySubgroupPageProps,
} from '@/app/library/[...slug]/types'

/**
 * 이모지 데이터는 openmoji 릴리스 시점에만 바뀌는 참조 데이터라 오래 캐시한다.
 *
 * 실패는 reject 로 흘려보낸다. 캐시 경계를 넘은 오류는 프로덕션에서 digest 로
 * 가려지지만(원본은 서버 로그에 남는다), 대신 일시적인 장애 결과가 며칠씩
 * 캐시되는 일을 막을 수 있다.
 */
export async function getCachedListByGroup({ group }: LibraryGroupPageProps) {
  'use cache'
  cacheLife('days')
  cacheTag('emoji', `emoji-group-${group}`)

  return appRuntime.runPromise(
    Effect.gen(function* () {
      const emojiService = yield* EmojiService

      return yield* emojiService.getListByGroup({ group })
    })
  )
}

export async function getCachedListBySubgroup({
  group,
  subgroup,
}: LibrarySubgroupPageProps) {
  'use cache'
  cacheLife('days')
  cacheTag('emoji', `emoji-group-${group}`)

  return appRuntime.runPromise(
    Effect.gen(function* () {
      const emojiService = yield* EmojiService

      return yield* emojiService.getListBySubgroup({ group, subgroup })
    })
  )
}
