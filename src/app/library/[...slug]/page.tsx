import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { LibraryPageProps } from './types'
import { Either, Option } from 'effect'
import { decodeLibraryPageParams } from './schema'
import { LibrarySkeleton } from './_components/LibrarySkeleton'
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

/**
 * `params` 를 await 하지 않고 Suspense 안으로 넘겨서, 클릭 즉시 보여줄
 * 로딩 셸(App Shell)이 프리렌더/프리페치 대상으로 남도록 한다.
 */
export default function LibraryPage({ params }: LibraryPageProps) {
  return (
    <Suspense fallback={<LibrarySkeleton />}>
      {params.then((params) =>
        decodeLibraryPageParams(params).pipe(
          Either.match({
            onLeft: () => notFound(),
            onRight({ slug: [group, subgroup] }) {
              return Option.fromNullable(subgroup).pipe(
                Option.match({
                  onSome(subgroup) {
                    return (
                      <LibrarySubgroupPage group={group} subgroup={subgroup} />
                    )
                  },
                  onNone() {
                    return <LibraryGroupPage group={group} />
                  },
                })
              )
            },
          })
        )
      )}
    </Suspense>
  )
}
