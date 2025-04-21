import { Metadata } from 'next'
import { LibraryPageProps } from './types'
import { Option } from 'effect'
import { LibraryGroupPage } from './_components/LibraryGroupPage'
import { LibrarySubgroupPage } from './_components/LibrarySubgroupPage'

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

  return Option.fromNullable(subgroup).pipe(
    Option.match({
      onSome(subgroup) {
        return <LibrarySubgroupPage group={group} subgroup={subgroup} />
      },
      onNone() {
        return <LibraryGroupPage group={group} />
      },
    })
  )
}
