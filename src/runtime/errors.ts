import { Data } from 'effect'

/**
 * 메시지를 사용자에게 그대로 보여줘도 되는 실패.
 *
 * 이 태그가 없는 실패(스키마 디코딩 실패, 드라이버 오류 등)는 내부 사정이므로
 * 화면에는 일반 문구만 나가고 원인은 서버 로그로만 남는다.
 */
export class UserFacingError extends Data.TaggedError('UserFacingError')<{
  readonly message: string
  readonly cause?: unknown
}> {}
