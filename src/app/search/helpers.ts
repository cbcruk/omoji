import { Effect } from 'effect'
import { UserFacingError } from '@/runtime/errors'
import { SearchPageSearchParams } from './types'

/** 통과하면 검색어가 빈 값이 아님이 타입으로도 보장된다. */
export const validateSearchQuery = (q: SearchPageSearchParams['q']) =>
  q
    ? Effect.succeed(q)
    : Effect.fail(new UserFacingError({ message: '검색어를 입력해주세요.' }))
