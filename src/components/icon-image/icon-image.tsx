import Image from 'next/image'

const BASE_URL =
  'https://raw.githubusercontent.com/hfg-gmuend/openmoji/refs/heads/master/color/svg'

type IconImageProps = {
  hexcode: string
}

export function IconImage({ hexcode }: IconImageProps) {
  return (
    <Image
      src={`${BASE_URL}/${hexcode}.svg`}
      width={32}
      height={32}
      alt=""
      loading="lazy"
    />
  )
}
