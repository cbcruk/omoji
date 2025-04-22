import { Popover } from 'radix-ui'
import { EmojiArray } from '../../schema/emoji'
import { IconImage } from '../icon-image/icon-image'

type IconGroupProps = {
  items: EmojiArray
}

export function IconGroup({ items }: IconGroupProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {items.map((item) => (
        <Popover.Root key={item.hexcode}>
          <Popover.Trigger asChild className="cursor-pointer">
            <IconImage hexcode={item.hexcode} />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="w-[260px] overflow-auto rounded bg-gray-900 p-2 shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.violet7)] data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=top]:animate-slideDownAndFade"
              align="start"
              sideOffset={5}
            >
              <pre>{JSON.stringify(item, null, 2)}</pre>
              <Popover.Arrow className="fill-gray-900" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      ))}
    </div>
  )
}
