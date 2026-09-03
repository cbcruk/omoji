import { IconGroup } from '@/components/icon-group/icon-group'
import { getCachedListByGroup } from '@/services/emoji-cache'
import { LibraryGroupPageProps } from '../types'
import { Effect } from 'effect'

export function LibraryGroupPage({ group }: LibraryGroupPageProps) {
  return Effect.tryPromise(() => getCachedListByGroup({ group })).pipe(
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
