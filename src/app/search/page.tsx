import { Metadata } from 'next'
import { Suspense } from 'react'
import { IconGroup } from '../../components/icon-group/icon-group'
import { IconGroupSkeleton } from '../../components/icon-group/icon-group-skeleton'
import { Effect } from 'effect'
import { EmojiService } from '@/services/Emoji'
import { SearchPageProps, SearchPageSearchParams } from './types'
import { validateSearchQueryGen } from './helpers'

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams

  return {
    title: `검색: ${q}`,
  }
}

function SearchResult({ q }: SearchPageSearchParams) {
  return Effect.gen(function* () {
    yield* validateSearchQueryGen(q)

    const pattern = `%${q}%`
    const emojiService = yield* EmojiService
    const result = yield* emojiService.searchList(pattern)

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

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <Suspense fallback={<IconGroupSkeleton />}>
      {searchParams.then(({ q }) => (
        <SearchResult q={q} />
      ))}
    </Suspense>
  )
}
