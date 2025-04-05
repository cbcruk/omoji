import { Effect, Schema } from 'effect'
import { ResultSchema } from './schema'
import { TursoService } from '@/services/Turso'

type Result = Schema.Schema.Type<typeof ResultSchema>

export async function GET() {
  return Effect.runPromise(
    Effect.gen(function* () {
      const turso = yield* TursoService
      const result = yield* turso.execute(`SELECT json_group_object(
  groups,
  (SELECT json_group_array(subgroups)
  FROM (SELECT DISTINCT subgroups 
        FROM openmoji o2 WHERE o2.groups = o1.groups))
) AS tree
FROM (SELECT DISTINCT groups FROM openmoji) o1;`)
      const [row] = result.rows

      return row.tree as unknown as Result['tree']
    }).pipe(
      Effect.provide(TursoService.Default),
      Effect.match({
        onSuccess(tree) {
          return new Response(tree, {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        },
        onFailure(error) {
          return new Response(JSON.stringify({ error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        },
      })
    )
  )
}
