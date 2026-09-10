import { Effect, Schema } from 'effect'
import { UserFacingError } from '@/runtime/errors'
import { SearchPageSearchParams } from './types'

const SearchPageSearchParamsSchema = Schema.Struct({
  q: Schema.Trim.pipe(Schema.minLength(1)),
})

const decode = Schema.decodeUnknown(SearchPageSearchParamsSchema)

/** 통과하면 검색어가 빈 값이 아님이 타입으로도 보장된다. */
export const decodeSearchQuery = (searchParams: SearchPageSearchParams) =>
  decode(searchParams).pipe(
    Effect.mapError(
      (cause) =>
        new UserFacingError({ message: '검색어를 입력해주세요.', cause })
    ),
    Effect.map(({ q }) => q)
  )
