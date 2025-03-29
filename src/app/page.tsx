import { Metadata } from 'next'
import { IconGroup } from '../components/icon-group/icon-group'
import { db } from '../lib/sqlite'
import { EmojiSchema } from '../schema/emoji'

export const metadata: Metadata = {
  title: '홈 | 오픈모지',
}

export default function Home() {
  const rows = db
    .prepare<unknown[], EmojiSchema>(
      'SELECT * FROM openmoji ORDER BY RANDOM() LIMIT 10'
    )
    .all()

  return (
    <main className="flex">
      <IconGroup items={rows} />
    </main>
  )
}
