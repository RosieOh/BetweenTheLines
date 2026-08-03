/**
 * 시리즈 문맥 안에서는 시리즈 이름이 이미 주어지므로 제목 앞의 `[...]` 접두사는 중복입니다.
 * 예) "[Friday] 297개 라벨을 40개로" → "297개 라벨을 40개로"
 *
 * 목록·네비게이션에서만 씁니다. 상세 페이지의 h1 과 공유 카드에는 원제목을 그대로 둡니다.
 */
export function stripSeriesPrefix(title: string): string {
  return title.replace(/^\s*\[[^\]]+\]\s*/, "");
}
