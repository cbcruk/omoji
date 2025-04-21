import { Metadata } from 'next'
import { IconGroup } from '../../components/icon-group/icon-group'
import { Data, Effect } from 'effect'
import { EmojiService } from '@/services/Emoji'

type SearchPageSearchParams = {
  q: string | undefined
}

type SearchPageProps = {
  searchParams: Promise<SearchPageSearchParams>
}

class SearchParamsError extends Data.TaggedError('SearchParamsError')<{
  readonly message: string
  readonly cause?: unknown
}> {}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams

  return {
    title: `검색: ${q}`,
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams

  if (!q) {
    return null
  }

  return Effect.runPromise(
    Effect.gen(function* () {
      if (!q) {
        return yield* Effect.fail(
          new SearchParamsError({
            message: '검색어를 입력해주세요.',
          })
        )
      }

      const emojiService = yield* EmojiService
      const pattern = `%${q}%`
      const result = yield* emojiService.searchList(pattern)

      return result
    }).pipe(
      Effect.provide(EmojiService.Default),
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
