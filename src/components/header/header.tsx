'use client'

import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { FormEvent, Suspense } from 'react'
import { HeaderIconSizeSelect } from './header-icon-size-select'

const SEARCH_PATHNAME = '/search'

function Form() {
  const router = useRouter()
  const searchParams = useSearchParams()

  /** 하이드레이션 이후에는 전체 이동 대신 클라이언트 내비게이션으로 처리한다. */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const q = String(new FormData(event.currentTarget).get('q') ?? '')
    const query = new URLSearchParams({ q })

    router.replace(`${SEARCH_PATHNAME}?${query.toString()}`)
  }

  return (
    // 네이티브 GET 폼이라 JS 가 없거나 하이드레이션 전에도 검색이 동작한다.
    // 검색어 검증은 서버 경계(`decodeSearchQuery`)가 담당한다.
    <form
      role="search"
      action={SEARCH_PATHNAME}
      method="get"
      onSubmit={handleSubmit}
    >
      <input
        type="search"
        name="q"
        placeholder="검색..."
        className="p-2 text-xs bg-[--background-start-rgb] border border-[--background-end-rgb] rounded-lg"
        defaultValue={searchParams.get('q') ?? undefined}
        required
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
