import { Metadata } from 'next'
import { IconGroup } from '../../components/icon-group/icon-group'
import { Emoji } from '../../schema/emoji'
import { Data, Effect } from 'effect'
import { SqlService } from '@/services/Sql'

type SearchPageSearchParams = {
  q: string | undefined
}

type SearchPageProps = {
  searchParams: Promise<SearchPageSearchParams>
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams

  return {
    title: `검색: ${q}`,
  }
}

export class SearchParamsError extends Data.TaggedError('SearchParamsError')<{
  readonly message: string
  readonly cause?: unknown
}> {}

const genSearchParams = (searchParams: SearchPageProps['searchParams']) =>
  Effect.gen(function* () {
    const { q } = yield* Effect.promise(() => searchParams)

    if (!q) {
      return yield* Effect.fail(
        new SearchParamsError({
          message: '검색어를 입력해주세요.',
        })
      )
    }

    return q
  })

export default async function SearchPage({ searchParams }: SearchPageProps) {
  return Effect.runPromise(
    Effect.gen(function* () {
      const q = yield* genSearchParams(searchParams)
      const sql = yield* SqlService
      const pattern = `%${q}%`
      const rows = yield* sql<Emoji>`SELECT * FROM openmoji WHERE ${sql.or([
        sql`annotation LIKE ${pattern}`,
        sql`tags LIKE ${pattern}`,
        sql`openmoji_tags LIKE ${pattern}`,
      ])}`

      return rows
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
