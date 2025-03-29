'use client'

import Link from 'next/link'
import data from './aside.data.json'
import { usePathname } from 'next/navigation'

export function Aside() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(data).map(([group, subgroups]) => (
        <div key={group}>
          <Link
            prefetch
            href={`/library/${group}`}
            className="text-base font-semibold"
          >
            {group}
          </Link>
          <div className="flex flex-col gap-2 p-2">
            {subgroups.map((subgroup) => {
              const href = `/library/${group}/${subgroup}`

              return (
                <Link
                  key={subgroup}
                  prefetch
                  href={href}
                  data-active={pathname === href}
                  className="hover:underline data-[active='true']:underline data-[active='true']:font-semibold"
                >
                  {subgroup}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
