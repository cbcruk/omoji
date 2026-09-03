import { IconGroup } from '@/components/icon-group/icon-group'
import { getCachedListBySubgroup } from '@/services/emoji-cache'
import { Effect } from 'effect'
import { LibrarySubgroupPageProps } from '../types'

export function LibrarySubgroupPage({
  group,
  subgroup,
}: LibrarySubgroupPageProps) {
  return Effect.tryPromise(() =>
    getCachedListBySubgroup({ group, subgroup })
  ).pipe(
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
