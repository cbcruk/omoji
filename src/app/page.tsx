import { Metadata } from 'next'
import { IconGroup } from '../components/icon-group/icon-group'
import { Effect } from 'effect'
import { SqlService } from '@/services/Sql'
import { Emoji } from '@/schema/emoji'

export const metadata: Metadata = {
  title: '홈 | 오픈모지',
}

export default function Home() {
  return (
    <main className="flex">
      {Effect.runSync(
        Effect.gen(function* () {
          const sql = yield* SqlService
          const result =
            yield* sql<Emoji>`SELECT * FROM openmoji ORDER BY RANDOM() LIMIT 10`

          return result
        }).pipe(
          Effect.provide(SqlService.Default),
          Effect.match({
            onSuccess(rows) {
              return <IconGroup items={rows} />
            },
            onFailure(error) {
              return <pre>{JSON.stringify(error, null, 2)}</pre>
            },
          })
        )
      )}
    </main>
  )
}
