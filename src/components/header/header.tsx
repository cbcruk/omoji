'use client'

import { Effect, pipe } from 'effect'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useActionState } from 'react'
import { decodeFormDataSchema } from './schema'
import { HeaderIconSizeSelect } from './header-icon-size-select'

function Form() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, formAction, isPending] = useActionState(
    (_: unknown, formData: FormData) =>
      Effect.gen(function* () {
        const searchParams = new URLSearchParams()

        yield* pipe(
          Effect.succeed(formData.get('q')),
          Effect.flatMap((q) => decodeFormDataSchema({ q })),
          Effect.match({
            onSuccess({ q }) {
              searchParams.set('q', q)
            },
            onFailure() {
              searchParams.delete('q')
            },
          })
        )

        return `/search?${searchParams.toString()}`
      }).pipe(
        Effect.tap((url) => Effect.sync(() => router.replace(url))),
        Effect.runSync
      ),
    null
  )

  return (
    <form action={formAction}>
      <input
        type="search"
        name="q"
        placeholder="검색..."
        className="p-2 text-xs bg-[--background-start-rgb] border border-[--background-end-rgb] rounded-lg"
        defaultValue={searchParams.get('q') ?? undefined}
        required
        disabled={isPending}
      />
    </form>
  )
}

export function Header() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-lg font-bold">
        <Link href="/" className="tracking-[1rem]">
          오픈모지
        </Link>
      </h1>

      <div className="flex items-center gap-4">
        <Suspense fallback={null}>
          <Form />
        </Suspense>
        <HeaderIconSizeSelect />
      </div>
    </div>
  )
}
