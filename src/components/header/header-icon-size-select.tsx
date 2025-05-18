import { DEFAULT_ICON_SIZE } from '@/constants'
import { useIconSizeContext } from '@/context/icon-size-context'

const DEFAULT_STEP = 16

export function HeaderIconSizeSelect() {
  const [size, setSize] = useIconSizeContext()

  return (
    <select
      className="self-stretch border border-[--background-end-rgb] rounded-lg"
      defaultValue={size}
      onChange={(e) => {
        const value = parseInt(e.target.value, 10)

        setSize(value)
      }}
    >
      {Array.from({ length: 7 }).map((_, i) => {
        const value = DEFAULT_ICON_SIZE + i * DEFAULT_STEP

        return (
          <option key={value} value={value}>
            {value}
          </option>
        )
      })}
    </select>
  )
}
