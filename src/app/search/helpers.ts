import { Data, Effect } from 'effect'
import { SearchPageSearchParams } from './types'

class SearchParamsError extends Data.TaggedError('SearchParamsError')<{
  readonly message: string
  readonly cause?: unknown
}> {}

export const validateSearchQueryGen = (q: SearchPageSearchParams['q']) =>
  Effect.gen(function* () {
    if (!q) {
      yield* Effect.fail(
        new SearchParamsError({
          message: '검색어를 입력해주세요.',
        })
      )
    }
  })
