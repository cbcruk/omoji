import { z } from 'zod'

export const emojiSchema = z.object({
  emoji: z.string(),
  hexcode: z.string(),
  groups: z.string(),
  subgroups: z.string(),
  annotation: z.string(),
  tags: z.string(),
  openmoji_tags: z.string().nullable(),
  openmoji_author: z.string(),
  openmoji_date: z.string(),
  skintone: z.string().nullable(),
  skintone_combination: z.string().nullable(),
  skintone_base_emoji: z.string().nullable(),
  skintone_base_hexcode: z.string().nullable(),
  unicode: z.number().nullable(),
  order: z.number().nullable(),
})

export type EmojiSchema = z.infer<typeof emojiSchema>
