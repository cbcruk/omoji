import { Metadata } from 'next'
import { IconGroup } from '../../../components/icon-group/icon-group'
import {
  LibraryGroupPageProps,
  LibrarySubgroupPageProps,
  LibraryPageProps,
} from './types'
import { Effect, Match } from 'effect'
import { EmojiService } from '@/services/Emoji'

async function LibraryGroupPage({ group }: LibraryGroupPageProps) {
  return Effect.runPromise(
    Effect.gen(function* () {
      const emojiService = yield* EmojiService
      const result = yield* emojiService.getListByGroups(group)

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

async function LibrarySubgroupPage({
  group,
  subgroup,
}: LibrarySubgroupPageProps) {
  return Effect.runPromise(
    Effect.gen(function* () {
      const emojiService = yield* EmojiService
      const result = yield* emojiService.getListBySubgroups({ group, subgroup })

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
