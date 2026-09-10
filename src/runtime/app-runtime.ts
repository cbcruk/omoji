import { Layer, ManagedRuntime } from 'effect'
import { EmojiService } from '@/services/Emoji'

/**
 * 앱이 쓰는 서비스 전체. 서비스가 늘어나면 여기에만 추가하고,
 * 렌더 지점에서는 다시 provide 하지 않는다.
 */
const AppLayer = Layer.mergeAll(EmojiService.Default)

export type AppServices = Layer.Layer.Success<typeof AppLayer>

const makeAppRuntime = () => ManagedRuntime.make(AppLayer)

type AppRuntime = ReturnType<typeof makeAppRuntime>

const globalForRuntime = globalThis as typeof globalThis & {
  __omojiRuntime?: AppRuntime
}

/**
 * Layer 를 한 번만 만들어 요청 사이에 재사용한다. 렌더마다 provide 하면
 * Turso 클라이언트와 설정 조회가 매번 새로 일어난다.
 *
 * 개발 모드의 HMR 은 모듈을 다시 평가하므로 globalThis 에 매달아 둔다.
 */
export const appRuntime: AppRuntime = (globalForRuntime.__omojiRuntime ??=
  makeAppRuntime())
