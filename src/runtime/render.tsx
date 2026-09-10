import { ReactNode } from 'react'
import { unstable_rethrow } from 'next/navigation'
import { Cause, Effect, Exit, Option } from 'effect'
import { AppServices, appRuntime } from './app-runtime'
import { UserFacingError } from './errors'

const FALLBACK_MESSAGE =
  '요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.'

function ErrorMessage({ message }: { message: string }) {
  return (
    <p role="alert" className="p-4">
      {message}
    </p>
  )
}

/** 사용자에게 그대로 보여줄 수 있는 메시지가 있으면 꺼낸다. */
const userMessageOf = (cause: Cause.Cause<unknown>) =>
  Cause.failureOption(cause).pipe(
    Option.flatMap((error) =>
      error instanceof UserFacingError
        ? Option.some(error.message)
        : Option.none()
    )
  )

/** 검색어 누락 같은 예상된 실패까지 ERROR 로 남기면 로그가 무의미해진다. */
const logCause = (cause: Cause.Cause<unknown>) =>
  Option.isSome(userMessageOf(cause))
    ? Effect.logDebug(cause)
    : Effect.logError(cause)

/**
 * notFound, redirect, 프리렌더 중단은 Next 가 예외로 흘려보내는 제어 흐름이다.
 * 우리가 대신 처리하면 해당 UI 가 렌더되지 않으므로 그대로 다시 던진다.
 * Effect 가 감싼 경우가 있어 cause 사슬도 함께 확인한다.
 */
function rethrowFrameworkError(error: unknown) {
  unstable_rethrow(error)

  if (error instanceof Error && error.cause !== undefined) {
    rethrowFrameworkError(error.cause)
  }
}

/**
 * 서버 컴포넌트가 Effect 를 실행하는 유일한 경계.
 *
 * 성공값만 JSX 로 옮기면 되고, 실패와 결함은 서버 로그로 보낸 뒤
 * 화면에는 문구 하나만 남긴다.
 */
export async function renderEffect<A, E>(
  effect: Effect.Effect<A, E, AppServices>,
  onSuccess: (value: A) => ReactNode
): Promise<ReactNode> {
  const exit = await appRuntime.runPromiseExit(
    effect.pipe(Effect.map(onSuccess), Effect.tapErrorCause(logCause))
  )

  if (Exit.isSuccess(exit)) {
    return exit.value
  }

  rethrowFrameworkError(Cause.squash(exit.cause))

  return (
    <ErrorMessage
      message={Option.getOrElse(
        userMessageOf(exit.cause),
        () => FALLBACK_MESSAGE
      )}
    />
  )
}
