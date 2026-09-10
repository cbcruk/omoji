import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex flex-col gap-2 p-4">
      <h2 className="text-base font-semibold">찾을 수 없는 페이지입니다.</h2>
      <p>
        주소를 확인하거나{' '}
        <Link href="/" className="underline">
          홈
        </Link>
        으로 돌아가세요.
      </p>
    </main>
  )
}
