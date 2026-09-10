import { Effect } from 'effect'
import { EmojiService } from '@/services/Emoji'
import { appRuntime } from '@/runtime/app-runtime'

const DEFAULT_HEADERS = new Headers([['Content-Type', 'application/json']])

export async function GET() {
  return appRuntime.runPromise(
    Effect.gen(function* () {
      const emojiService = yield* EmojiService

      return yield* emojiService.getTree()
    }).pipe(
      Effect.map(
        (tree) =>
          new Response(tree, {
            status: 200,
            headers: DEFAULT_HEADERS,
          })
      ),
      Effect.catchAllCause((cause) =>
        Effect.logError(cause).pipe(
          Effect.as(
            new Response(
              JSON.stringify({ error: '데이터를 불러오지 못했습니다.' }),
              {
                status: 500,
                headers: DEFAULT_HEADERS,
              }
            )
          )
        )
      )
    )
  )
}
