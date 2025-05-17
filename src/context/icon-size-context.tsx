'use client'

import { DEFAULT_ICON_SIZE } from '@/constants'
import { createContext, PropsWithChildren, useContext, useState } from 'react'

export const IconSizeContext = createContext<
  ReturnType<typeof useIconSizeState> | undefined
>(undefined)

function useIconSizeState() {
  const value = useState(DEFAULT_ICON_SIZE)

  return value
}

export function IconSizeContextProvider({ children }: PropsWithChildren) {
  const value = useIconSizeState()

  return (
    <IconSizeContext.Provider value={value}>
      {children}
    </IconSizeContext.Provider>
  )
}

export function useIconSizeContext() {
  const context = useContext(IconSizeContext)

  if (!context) {
    throw new Error('IconSizeContext')
  }

  return context
}
