import { Metadata } from 'next'
import { connection } from 'next/server'
import { Suspense } from 'react'
import { IconGroup } from '../components/icon-group/icon-group'
import { IconGroupSkeleton } from '../components/icon-group/icon-group-skeleton'
import { Effect } from 'effect'
import { EmojiService } from '@/services/Emoji'

export const metadata: Metadata = {
  title: '홈 | 오픈모지',
}

/** 매 요청마다 달라져야 하므로 캐시하지 않고 Suspense 로 스트리밍한다. */
async function RandomIconGroup() {
  await connection()

  return Effect.gen(function* () {
    const emojiService = yield* EmojiService
    const result = yield* emojiService.getRandomList()

    return result
  }).pipe(
    Effect.provide(EmojiService.Default),
    Effect.match({
      onSuccess(rows) {
        return <IconGroup items={rows} />
      },
      onFailure(error) {
        return <pre>{JSON.stringify(error, null, 2)}</pre>
      },
    }),
    Effect.runPromise
  )
}

export default function Home() {
  return (
    <main className="flex">
      <Suspense fallback={<IconGroupSkeleton count={10} />}>
        <RandomIconGroup />
      </Suspense>
    </main>
  )
}
