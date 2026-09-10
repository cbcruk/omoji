import { Metadata } from 'next'
import { Suspense } from 'react'
import { IconGroup } from '../../components/icon-group/icon-group'
import { IconGroupSkeleton } from '../../components/icon-group/icon-group-skeleton'
import { Effect } from 'effect'
import { EmojiService } from '@/services/Emoji'
import { renderEffect } from '@/runtime/render'
import { SearchPageProps, SearchPageSearchParams } from './types'
import { decodeSearchQuery } from './helpers'

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams

  return {
    title: `검색: ${q}`,
  }
}

function SearchResult({ q }: SearchPageSearchParams) {
  return renderEffect(
    Effect.gen(function* () {
      const query = yield* decodeSearchQuery({ q })
      const emojiService = yield* EmojiService

      return yield* emojiService.searchList(query)
    }),
    (rows) => <IconGroup items={rows} />
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
