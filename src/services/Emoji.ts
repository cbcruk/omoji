import { Effect } from 'effect'
import { TursoService } from './Turso'
import {
  decodeEmojiArraySchema,
  decodeEmojiTreeResponseSchema,
} from '@/schema/emoji'

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
        getListByGroups: (group: string) =>
          Effect.gen(function* () {
            const result = yield* turso.execute({
              sql: `SELECT * FROM openmoji WHERE groups = ?`,
              args: [group],
            })

            const rows = yield* decodeEmojiArraySchema(result.rows)

            return rows
          }),
        getListBySubgroups: ({
          group,
          subgroup,
        }: Record<'group' | 'subgroup', string>) =>
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
            const result = yield* turso.execute(`SELECT json_group_object(
            groups,
            (SELECT json_group_array(subgroups)
            FROM (SELECT DISTINCT subgroups 
                  FROM openmoji o2 WHERE o2.groups = o1.groups))
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
