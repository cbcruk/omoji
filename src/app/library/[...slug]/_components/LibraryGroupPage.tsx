import { IconGroup } from '@/components/icon-group/icon-group'
import { EmojiService } from '@/services/Emoji'
import { LibraryGroupPageProps } from '../types'
import { Effect } from 'effect'

export async function LibraryGroupPage({ group }: LibraryGroupPageProps) {
  return Effect.gen(function* () {
    const emojiService = yield* EmojiService
    const result = yield* emojiService.getListByGroup({ group })

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
