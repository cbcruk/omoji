import { Schema } from 'effect'

/**
 * catch-all 세그먼트는 `[group]` 또는 `[group, subgroup]` 두 모양만 허용한다.
 * 나머지 깊이나 빈 세그먼트는 렌더 전에 걸러 404 로 보낸다.
 */
export const LibraryPageParamsSchema = Schema.Struct({
  slug: Schema.NonEmptyArray(Schema.NonEmptyString).pipe(Schema.maxItems(2)),
})

export const decodeLibraryPageParams = Schema.decodeUnknownEither(
  LibraryPageParamsSchema
)
