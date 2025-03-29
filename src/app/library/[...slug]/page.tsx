import { Metadata } from 'next'
import { IconGroup } from '../../../components/icon-group/icon-group'
import { db } from '../../../lib/sqlite'
import { EmojiSchema } from '../../../schema/emoji'
import {
  LibraryGroupPageProps,
  LibrarySubgroupPageProps,
  LibraryPageProps,
} from './types'

function LibraryGroupPage({ group }: LibraryGroupPageProps) {
  const rows = db
    .prepare<EmojiSchema['groups'], EmojiSchema>(
      'SELECT * FROM openmoji WHERE groups = ?'
    )
    .all(group)

  return <IconGroup items={rows} />
}

function LibrarySubgroupPage({ group, subgroup }: LibrarySubgroupPageProps) {
  const rows = db
    .prepare<[EmojiSchema['groups'], EmojiSchema['subgroups']], EmojiSchema>(
      'SELECT * FROM openmoji WHERE groups = ? AND subgroups = ?'
    )
    .all(group, subgroup)

  return <IconGroup items={rows} />
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

  switch (true) {
    case typeof subgroup === 'string':
      return <LibrarySubgroupPage group={group} subgroup={subgroup} />
    default:
      return <LibraryGroupPage group={group} />
  }
}
