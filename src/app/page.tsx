import { Metadata } from 'next'
import { IconGroup } from '../components/icon-group/icon-group'
import { Effect } from 'effect'
import { EmojiService } from '@/services/Emoji'

export const metadata: Metadata = {
  title: '홈 | 오픈모지',
}

export default async function Home() {
  return (
    <main className="flex">
      {await Effect.gen(function* () {
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
      )}
    </main>
  )
}
