import { IconGroup } from '@/components/icon-group/icon-group'
import { EmojiService } from '@/services/Emoji'
import { Effect } from 'effect'
import { LibrarySubgroupPageProps } from '../types'

export async function LibrarySubgroupPage({
  group,
  subgroup,
}: LibrarySubgroupPageProps) {
  return Effect.gen(function* () {
    const emojiService = yield* EmojiService
    const result = yield* emojiService.getListBySubgroup({ group, subgroup })

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
