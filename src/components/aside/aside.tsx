'use client'

import { usePathname } from 'next/navigation'
import { AsideLinks } from './aside-links'

export function Aside() {
  return <AsideLinks pathname={usePathname()} />
}
