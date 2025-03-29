'use client'

import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useActionState } from 'react'

export function Header() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, formAction, isPending] = useActionState(
    (_: unknown, formData: FormData) => {
      const q = formData.get('q')
      const searchParams = new URLSearchParams()

      if (q && typeof q === 'string') {
        searchParams.set('q', q)
      } else {
        searchParams.delete('q')
      }

      router.replace(`/search?${searchParams.toString()}`)
    },
    null
  )

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-lg font-bold">
        <Link href="/" className="tracking-[1rem]">
          오픈모지
        </Link>
      </h1>
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
    </div>
  )
}
