import { Effect } from 'effect'
import { TursoService } from './Turso'
import {
  decodeEmojiArraySchema,
  decodeEmojiTreeResponseSchema,
} from '@/schema/emoji'
import {
  LibraryGroupPageProps,
  LibrarySubgroupPageProps,
} from '@/app/library/[...slug]/types'

export class EmojiService extends Effect.Service<EmojiService>()(
  'EmojiService',
  {
    effect: Effect.gen(function* () {
      const turso = yield* TursoService

      return {
        getRandomList: () =>
          Effect.gen(function* () {
            const result = yield* turso.execute({
              sql: `SELECT * FROM openmoji ORDER BY RANDOM() LIMIT 10`,
            })
            const rows = yield* decodeEmojiArraySchema(result.rows)

            return rows
          }),
        getListByGroup: ({ group }: LibraryGroupPageProps) =>
          Effect.gen(function* () {
            const result = yield* turso.execute({
              sql: `SELECT * FROM openmoji WHERE groups = ?`,
              args: [group],
            })
            const rows = yield* decodeEmojiArraySchema(result.rows)

            return rows
          }),
        getListBySubgroup: ({ group, subgroup }: LibrarySubgroupPageProps) =>
          Effect.gen(function* () {
            const result = yield* turso.execute({
              sql: `SELECT * FROM openmoji WHERE groups = ? AND subgroups = ?`,
              args: [group, subgroup],
            })
            const rows = yield* decodeEmojiArraySchema(result.rows)

            return rows
          }),
        getTree: () =>
          Effect.gen(function* () {
            // 서브그룹은 `ORDER BY MIN(rowid)` 로 이모지 순서를 유지한다.
            // GROUP BY 만 쓰면 알파벳순으로 정렬되어 사이드바 순서가 바뀐다.
            const result = yield* turso.execute(`SELECT json_group_object(
            groups,
            json_object(
              'n', (SELECT COUNT(*) FROM openmoji o2 WHERE o2.groups = o1.groups),
              'sub', (SELECT json_group_object(subgroups, c)
                      FROM (SELECT subgroups, COUNT(*) c
                            FROM openmoji o3 WHERE o3.groups = o1.groups
                            GROUP BY subgroups ORDER BY MIN(o3.rowid)))
            )
          ) AS tree
          FROM (SELECT DISTINCT groups FROM openmoji) o1;`)
            const row = yield* decodeEmojiTreeResponseSchema(result.rows.at(0))

            return row.tree
          }),
        searchList: (pattern: string) =>
          Effect.gen(function* () {
            const result = yield* turso.execute({
              sql: `SELECT * FROM openmoji WHERE 
              annotation LIKE '${pattern}' OR
              tags LIKE '${pattern}' OR
              openmoji_tags LIKE '${pattern}'`,
            })
            const rows = yield* decodeEmojiArraySchema(result.rows)

            return rows
          }),
      }
    }),
    dependencies: [TursoService.Default],
  }
) {}
