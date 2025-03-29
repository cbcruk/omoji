import { Metadata } from 'next'
import { IconGroup } from '../../components/icon-group/icon-group'
import { db } from '../../lib/sqlite'
import { EmojiSchema } from '../../schema/emoji'

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

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams

  if (!q) {
    return null
  }

  const rows = db
    .prepare<unknown[], EmojiSchema>(
      `SELECT * FROM openmoji WHERE annotation LIKE '%${q}%' 
        OR tags LIKE '%${q}%'
        OR openmoji_tags LIKE '%${q}%'`
    )
    .all()

  return <IconGroup items={rows} />
}
