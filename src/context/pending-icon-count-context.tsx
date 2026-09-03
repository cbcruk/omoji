'use client'

import { createContext, PropsWithChildren, useContext, useState } from 'react'

/**
 * 사이드바에서 클릭한 링크의 이모지 개수를 담아둔다.
 *
 * 로딩 셸은 라우트 전체가 공유하는 프리렌더 결과라서 `params` 를 볼 수 없다.
 * 그래서 URL 이 아니라 클릭 시점에 개수를 넘겨 스켈레톤 크기를 맞춘다.
 */
function usePendingIconCountState() {
  const value = useState<number | null>(null)

  return value
}

export const PendingIconCountContext = createContext<
  ReturnType<typeof usePendingIconCountState> | undefined
>(undefined)

export function PendingIconCountContextProvider({
  children,
}: PropsWithChildren) {
  const value = usePendingIconCountState()

  return (
    <PendingIconCountContext.Provider value={value}>
      {children}
    </PendingIconCountContext.Provider>
  )
}

export function usePendingIconCount() {
  const context = useContext(PendingIconCountContext)

  if (!context) {
    throw new Error('PendingIconCountContext')
  }

  return context
}
