'use client'

import { useIconSizeContext } from '@/context/icon-size-context'
import Image from 'next/image'

const BASE_URL =
  'https://raw.githubusercontent.com/hfg-gmuend/openmoji/refs/heads/master/color/svg'

type IconImageProps = {
  hexcode: string
}

export function IconImage({ hexcode }: IconImageProps) {
  const [size] = useIconSizeContext()

  return (
    <Image
      src={`${BASE_URL}/${hexcode}.svg`}
      width={size}
      height={size}
      alt=""
      loading="lazy"
    />
  )
}
