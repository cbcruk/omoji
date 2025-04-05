import { Metadata } from 'next'
import { IconGroup } from '../components/icon-group/icon-group'
import { Effect } from 'effect'
import { Emoji } from '@/schema/emoji'
import { TursoService } from '@/services/Turso'

export const metadata: Metadata = {
  title: '홈 | 오픈모지',
}

export default async function Home() {
  return (
    <main className="flex">
      {await Effect.runPromise(
        Effect.gen(function* () {
          const turso = yield* TursoService
          const result = yield* turso.execute({
            sql: `SELECT * FROM openmoji ORDER BY RANDOM() LIMIT 10`,
          })

          return result.rows as unknown as Emoji[]
        }).pipe(
          Effect.provide(TursoService.Default),
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
