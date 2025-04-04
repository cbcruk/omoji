import { Metadata } from 'next'
import { IconGroup } from '../../../components/icon-group/icon-group'
import { Emoji } from '../../../schema/emoji'
import {
  LibraryGroupPageProps,
  LibrarySubgroupPageProps,
  LibraryPageProps,
} from './types'
import { Effect, Match } from 'effect'
import { SqlService } from '@/services/Sql'

function LibraryGroupPage({ group }: LibraryGroupPageProps) {
  return Effect.runSync(
    Effect.gen(function* () {
      const sql = yield* SqlService
      const result = yield* sql<Emoji>`SELECT * FROM openmoji WHERE ${sql.in(
        'groups',
        [group]
      )}`

      return result
    }).pipe(
      Effect.provide(SqlService.Default),
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

function LibrarySubgroupPage({ group, subgroup }: LibrarySubgroupPageProps) {
  return Effect.runSync(
    Effect.gen(function* () {
      const sql = yield* SqlService
      const result = yield* sql<Emoji>`SELECT * FROM openmoji WHERE ${sql.and([
        sql.in('groups', [group]),
        sql.in('subgroups', [subgroup]),
      ])}`

      return result
    }).pipe(
      Effect.provide(SqlService.Default),
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
