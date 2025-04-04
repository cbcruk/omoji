import { SqliteClient } from '@effect/sql-sqlite-node'
import { SqlClient } from '@effect/sql'
import { Effect } from 'effect'

export const SqlLive = SqliteClient.layer({
  filename: 'emoji.db',
})

export class SqlService extends Effect.Service<SqlService>()('SqlService', {
  effect: Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient
    return sql
  }),
  dependencies: [SqlLive],
}) {}
