import { Effect } from 'effect'
import { EmojiService } from '@/services/Emoji'

const DEFAULT_HEADERS = new Headers([['Content-Type', 'application/json']])

export async function GET() {
  return Effect.runPromise(
    Effect.gen(function* () {
      const emojiService = yield* EmojiService
      const result = yield* emojiService.getTree()

      return result
    }).pipe(
      Effect.provide(EmojiService.Default),
      Effect.match({
        onSuccess(tree) {
          return new Response(tree, {
            status: 200,
            headers: DEFAULT_HEADERS,
          })
        },
        onFailure(error) {
          return new Response(JSON.stringify({ error }), {
            status: 500,
            headers: DEFAULT_HEADERS,
          })
        },
      })
    )
  )
}
