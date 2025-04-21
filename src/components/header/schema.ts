import { Schema } from 'effect'

export const formDataSchema = Schema.Struct({
  q: Schema.String,
})

export const decodeFormDataSchema = Schema.decodeUnknown(formDataSchema)
