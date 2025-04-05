import { Metadata } from 'next'
import { IconGroup } from '../../../components/icon-group/icon-group'
import { Emoji } from '../../../schema/emoji'
import {
  LibraryGroupPageProps,
  LibrarySubgroupPageProps,
  LibraryPageProps,
} from './types'
import { Effect, Match } from 'effect'
import { TursoService } from '@/services/Turso'

async function LibraryGroupPage({ group }: LibraryGroupPageProps) {
  return Effect.runPromise(
    Effect.gen(function* () {
      const turso = yield* TursoService
      const result = yield* turso.execute({
        sql: `SELECT * FROM openmoji WHERE groups = ?`,
        args: [group],
      })

      return result.rows as unknown as Emoji[]
    }).pipe(
      Effect.provide(TursoService.Default),
      Effect.match({
        onSuccess(rows) {
          return <IconGroup items={rows} />
        },
        onFailure(error) {
          console.error(error)
          return <pre>{JSON.stringify(error, null, 2)}</pre>
        },
      })
    )
  )
}

async function LibrarySubgroupPage({
  group,
  subgroup,
}: LibrarySubgroupPageProps) {
  return Effect.runPromise(
    Effect.gen(function* () {
      const turso = yield* TursoService
      const result = yield* turso.execute({
        sql: `SELECT * FROM openmoji WHERE groups = ? AND subgroups = ?`,
        args: [group, subgroup],
      })

      return result.rows as unknown as Emoji[]
    }).pipe(
      Effect.provide(TursoService.Default),
      Effect.match({
        onSuccess(rows) {
          return <IconGroup items={rows} />
        },
        onFailure(error) {
          console.error(error)
          return <pre>{JSON.stringify(error, null, 2)}</pre>
        },
      })
    )
  )
}

export async function generateMetadata({
  params,
}: LibraryPageProps): Promise<Metadata> {
  const { slug } = await params

  return {
    title: `그룹: \`${slug.join('/')}\``,
  }
}

export default async function LibraryPage({ params }: LibraryPageProps) {
  const { slug } = await params
  const [group, subgroup] = slug

  return Match.value(subgroup).pipe(
    Match.when(Match.string, (subgroup) => (
      <LibrarySubgroupPage group={group} subgroup={subgroup} />
    )),
    Match.orElse(() => <LibraryGroupPage group={group} />)
  )
}
