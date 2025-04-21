import { Metadata } from 'next'
import { IconGroup } from '../../components/icon-group/icon-group'
import { Effect } from 'effect'
import { EmojiService } from '@/services/Emoji'
import { SearchPageProps } from './types'
import { validateSearchQueryGen } from './helpers'

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
