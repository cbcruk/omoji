import Link from 'next/link'
import data from './aside.data.json'

type AsideLinksProps = {
  /** 없으면 활성 표시 없이 렌더링된다 (프리렌더 셸 용도) */
  pathname?: string | null
}

export function AsideLinks({ pathname }: AsideLinksProps) {
  return (
    <div className="flex flex-col gap-4">
      {Object.entries(data).map(([group, subgroups]) => (
        <div key={group}>
          {/* 그룹은 12개뿐이라 URL 별 콘텐츠까지 미리 받아둔다 */}
          <Link
            prefetch={true}
            href={`/library/${group}`}
            className="text-base font-semibold"
          >
            {group}
          </Link>
          <div className="flex flex-col gap-2 p-2">
            {subgroups.map((subgroup) => {
              const href = `/library/${group}/${subgroup}`

              return (
                // 서브그룹은 121개라 링크마다 요청을 보내지 않고,
                // 라우트 하나를 공유하는 App Shell 프리페치만 사용한다
                <Link
                  key={subgroup}
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
