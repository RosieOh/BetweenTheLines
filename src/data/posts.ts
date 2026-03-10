import thumbArchitecture from "@/assets/thumb-architecture.jpg";
import thumbAiReview from "@/assets/thumb-ai-review.jpg";
import thumbCommunication from "@/assets/thumb-communication.jpg";
import thumbSecurity from "@/assets/thumb-security.jpg";
import thumbCicd from "@/assets/thumb-cicd.jpg";

export interface AciBreakdown {
  pps: number;
  dig: number;
  gcc: number;
  wfa: number;
}

export interface PostData {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  thumbnail: string;
  tags: string[];
  aciScore: number;
  hasAesPenalty?: boolean;
  readTime: string;
  aciBreakdown: AciBreakdown;
  content: string;
}

export const categories = [
  "전체",
  "PPS",
  "DIG",
  "GCC",
  "WFA",
  "AES",
] as const;

export const samplePosts: PostData[] = [
  {
    id: "1",
    title: "대규모 트래픽 환경에서의 Event-Driven Architecture 설계 전략",
    excerpt:
      "초당 50,000건의 이벤트를 안정적으로 처리하기 위한 Kafka 기반 아키텍처 설계와 장애 대응 전략을 공유합니다.",
    category: "PPS",
    author: "김현우",
    date: "2026. 03. 01.",
    readTime: "12분",
    thumbnail: thumbArchitecture,
    tags: ["Kafka", "Architecture", "Microservices"],
    aciScore: 730,
    aciBreakdown: { pps: 230, dig: 175, gcc: 165, wfa: 160 },
    content: `## 들어가며

초당 50,000건 이상의 이벤트를 처리해야 하는 요구사항을 받았을 때, 기존의 동기식 REST API 구조로는 한계가 명확했습니다. 주문 서비스가 결제·재고·알림 서비스를 순차적으로 호출하는 방식에서는 하나의 서비스 장애가 전체 주문 흐름을 멈추게 만들었습니다.

이 글에서는 **Kafka를 중심으로 한 Event-Driven Architecture(EDA)**를 도입하면서 마주한 설계 결정과 트레이드오프를 단계별로 공유합니다.

## 기존 구조의 한계

### 동기식 호출의 문제

기존 모놀리식 구조에서 주문 처리 흐름은 다음과 같았습니다.

1. 주문 서비스 → 결제 서비스 호출 (최대 200ms)
2. 결제 완료 → 재고 서비스 호출 (최대 150ms)
3. 재고 확보 → 알림 서비스 호출 (최대 80ms)

총 p99 레이턴시가 430ms 이상이었고, 알림 서비스가 간헐적으로 타임아웃되면 주문 전체가 롤백되는 문제가 반복됐습니다. 특히 블랙프라이데이 같은 트래픽 피크 구간에서 **결제 서비스의 DB 커넥션 풀이 고갈**되어 전체 시스템이 수 분간 다운되는 장애가 발생했습니다.

### 병목 지점 분석

APM 데이터를 분석한 결과, 전체 레이턴시의 68%가 서비스 간 동기 호출에서 발생하고 있었습니다. 특히 결제 서비스가 외부 PG사 API를 호출하는 구간에서 P99 레이턴시가 크게 튀는 현상이 확인됐습니다.

## Kafka 기반 EDA 설계

### 토픽 구조 설계

토픽 설계는 EDA의 핵심입니다. 우리는 **도메인 이벤트 단위**로 토픽을 분리했습니다.

\`\`\`
order.created
order.payment.completed
order.payment.failed
order.inventory.reserved
order.notification.sent
\`\`\`

파티션 수는 예상 처리량과 컨슈머 그룹 수를 고려해 초기 24개로 설정했습니다. 파티션 키는 \`order_id\`를 사용해 동일 주문의 이벤트 순서를 보장했습니다. Replication Factor는 3으로 설정해 브로커 한 대 장애에도 데이터 유실 없이 서비스가 유지되도록 했습니다.

### 컨슈머 그룹 전략

각 서비스는 독립적인 컨슈머 그룹을 가집니다. 이를 통해 서비스별 독립적인 오프셋 관리와 재처리가 가능해졌습니다.

\`\`\`java
@KafkaListener(
  topics = "order.created",
  groupId = "payment-service",
  containerFactory = "kafkaListenerContainerFactory"
)
public void handleOrderCreated(OrderCreatedEvent event) {
    paymentService.processPayment(event.getOrderId());
}
\`\`\`

컨슈머 그룹을 분리함으로써 결제 서비스의 처리 속도가 알림 서비스에 영향을 주지 않게 됐습니다. 각 서비스는 자신의 페이스대로 이벤트를 소비할 수 있습니다.

## 장애 대응 전략

### Dead Letter Queue

처리 실패한 메시지는 **DLQ(Dead Letter Queue)** 로 이동시켜 별도로 관리합니다. 3회 재시도 후에도 실패하면 \`order.created.dlq\` 토픽으로 라우팅됩니다. DLQ 모니터링 대시보드를 통해 운영팀이 실패한 이벤트를 확인하고 수동 재처리할 수 있습니다.

### 멱등성 보장

네트워크 오류로 인한 중복 처리를 방지하기 위해 **이벤트 ID 기반의 멱등성 처리**를 적용했습니다. Redis에 처리된 이벤트 ID를 TTL 24시간으로 캐싱하고, 동일 ID가 다시 들어오면 처리 없이 ACK만 보냅니다.

중복 처리 방지 적용 전에는 결제가 이중으로 청구되는 사고가 월 2~3건 발생했는데, 적용 이후 6개월간 단 한 건도 발생하지 않았습니다.

### Circuit Breaker 패턴

외부 PG사 API 호출에는 Resilience4j의 Circuit Breaker를 적용했습니다. 5초 슬라이딩 윈도우에서 실패율이 50% 이상이 되면 회로가 열리고, 30초 후 Half-Open 상태로 전환됩니다. 이를 통해 외부 장애가 내부로 전파되는 것을 차단했습니다.

## 성과 요약

EDA 도입 후 6개월간의 성과를 요약하면 다음과 같습니다.

- **P99 레이턴시**: 430ms → 45ms (90% 감소)
- **초당 처리량**: 6,200 TPS → 51,000 TPS (8.2배 향상)
- **장애 전파 건수**: 월 평균 4.2건 → 0건
- **서비스 독립 배포 횟수**: 주 2회 → 주 12회

## 이벤트 스키마 버전 관리의 중요성

가장 큰 교훈은 **이벤트 스키마 버전 관리**의 중요성입니다. 초기에 스키마를 느슨하게 관리하다가 \`order.created\` 이벤트에 새 필드를 추가했을 때 기존 컨슈머들이 역직렬화 오류를 일으켰습니다.

이후 **Confluent Schema Registry**를 도입하고 Avro 스키마를 사용해 Backward/Forward 호환성을 명시적으로 관리하기 시작했습니다. 스키마 변경 PR은 반드시 호환성 검증을 거치도록 CI 파이프라인에 스키마 호환성 체크 단계를 추가했습니다.

## 마치며

EDA는 만능 해결책이 아닙니다. 단순한 CRUD 서비스에 EDA를 적용하면 오히려 복잡성만 높아집니다. 높은 처리량, 서비스 간 느슨한 결합, 이벤트 재처리 요구사항이 있는 경우에 도입을 검토해보시길 권장합니다.

이 구조를 도입하면서 팀의 배포 자신감이 높아졌고, 각 서비스 오너십이 명확해졌습니다. 기술 선택이 조직 문화에 긍정적인 영향을 미친 좋은 사례라고 생각합니다.`,
  },
  {
    id: "2",
    title: "GPT-4o 기반 코드 리뷰 자동화 파이프라인 구축기",
    excerpt:
      "AI 도구를 활용하여 코드 리뷰 프로세스를 자동화하고, 리뷰 품질과 속도를 동시에 높인 경험을 정리합니다.",
    category: "DIG",
    author: "이서연",
    date: "2026. 02. 25.",
    readTime: "9분",
    thumbnail: thumbAiReview,
    tags: ["AI", "Automation", "DevOps"],
    aciScore: 795,
    aciBreakdown: { pps: 185, dig: 225, gcc: 195, wfa: 190 },
    content: `## 배경

우리 팀은 주간 평균 80개 이상의 PR을 처리합니다. 리뷰어 한 명이 담당하는 PR이 15~20개를 넘어서자 리뷰 품질이 떨어지기 시작했습니다. 버그는 프로덕션에서 발견됐고, 주니어 개발자들은 리뷰 피드백을 받는 데 평균 2.3일을 기다려야 했습니다.

이 문제를 해결하기 위해 **GPT-4o 기반 코드 리뷰 자동화 파이프라인**을 구축했습니다.

## 시스템 아키텍처

### GitHub Actions 트리거

PR이 생성되거나 업데이트될 때 GitHub Actions 워크플로우가 트리거됩니다. 변경된 파일의 diff를 추출해 GPT-4o API로 전송합니다.

\`\`\`yaml
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run AI Review
        run: python scripts/ai_review.py
\`\`\`

### 프롬프트 설계

초기에는 단순히 "이 코드를 리뷰해줘"라는 프롬프트를 사용했지만, 결과가 너무 일반적이었습니다. 팀의 코딩 컨벤션과 자주 발생하는 버그 패턴을 프롬프트에 포함시키자 리뷰 품질이 크게 향상됐습니다.

특히 **Few-shot learning** 방식으로 좋은 리뷰 예시 3~5개를 프롬프트에 포함했을 때 가장 좋은 결과를 얻었습니다. 팀 내 시니어 엔지니어의 실제 리뷰 코멘트를 예시로 활용했습니다.

## 비용 최적화

GPT-4o는 강력하지만 비용이 부담스러울 수 있습니다. 우리는 두 단계 전략을 사용합니다.

1. **1차 필터링**: GPT-4o-mini로 변경 규모가 작은 PR(\`diff < 200 lines\`)을 먼저 처리
2. **2차 심층 리뷰**: 복잡도가 높은 PR만 GPT-4o로 처리

이를 통해 월 AI 리뷰 비용을 초기 대비 62% 절감했습니다.

## 성과

- **초기 리뷰 시간**: 2.3일 → 3분 (자동 리뷰 기준)
- **버그 사전 탐지율**: 도입 전 대비 34% 향상
- **리뷰어 부담**: PR당 리뷰 시간 평균 47% 감소
- **주니어 만족도**: 팀 서베이 4.1/5.0 → 4.7/5.0

## 한계와 주의사항

AI 리뷰는 인간 리뷰를 대체하지 않습니다. 비즈니스 컨텍스트나 팀 전략적 결정이 필요한 부분은 여전히 사람이 판단해야 합니다. AI가 잡지 못하는 **의도적인 기술 부채**나 **도메인 특수 로직**에 대해서는 리뷰어의 역할이 여전히 중요합니다.

## 마치며

코드 리뷰 자동화는 팀의 생산성을 높이는 동시에 주니어 개발자의 성장을 가속화하는 도구가 됐습니다. 다음 단계로는 PR 분류 자동화와 리뷰 우선순위 지정 기능을 추가할 계획입니다.`,
  },
  {
    id: "3",
    title: "글로벌 리모트 팀과의 비동기 커뮤니케이션 프로토콜",
    excerpt:
      "4개국 8명의 엔지니어가 시차를 극복하고 효율적으로 협업하기 위해 수립한 커뮤니케이션 가이드라인입니다.",
    category: "GCC",
    author: "박민석",
    date: "2026. 02. 18.",
    readTime: "7분",
    thumbnail: thumbCommunication,
    tags: ["Remote", "Communication", "Agile"],
    aciScore: 670,
    aciBreakdown: { pps: 155, dig: 160, gcc: 200, wfa: 155 },
    content: `## 상황 정의

한국(UTC+9), 독일(UTC+1), 캐나다(UTC-5), 싱가포르(UTC+8)에 걸쳐 8명의 엔지니어가 단일 제품을 개발하는 상황에서 팀 효율을 유지하는 일은 쉽지 않았습니다. 시차가 최대 14시간에 달하다 보니, 실시간 소통을 전제한 기존 협업 방식은 곧바로 한계를 드러냈습니다.

## 비동기 우선 원칙

우리 팀은 **"비동기 우선, 동기는 예외"** 원칙을 수립했습니다. 이는 실시간 미팅을 없애는 게 아니라, 실시간이 꼭 필요한 경우와 그렇지 않은 경우를 명확히 구분하는 것입니다.

### 동기 커뮤니케이션이 필요한 경우

- 중요한 아키텍처 결정 (주 1회 Architecture Review)
- 신규 입사자 온보딩
- 팀 리트로스펙티브 (격주)

### 비동기로 충분한 경우

- 일반 코드 리뷰
- 버그 리포트 및 티켓 논의
- 기술 제안서 검토
- 진행 상황 공유

## Working Agreement 핵심 조항

팀이 합의한 Working Agreement 중 가장 큰 변화를 만든 3가지 조항입니다.

**1. 24시간 응답 SLA**: 비동기 메시지는 24시간 내 응답을 보장합니다. 단, "읽었다"는 이모지 리액션으로도 충분합니다.

**2. Decision Log 의무화**: 모든 주요 결정은 Notion의 Decision Log에 배경·선택지·결론·책임자를 기록합니다. 미팅 중 결정된 사항도 반드시 24시간 내 문서화합니다.

**3. 비동기 데일리**: Slack의 \`#daily-standup\` 채널에 각자의 시간대 업무 시작 시 텍스트로 standup을 공유합니다. 포맷은 자유지만 블로커(Blocker)는 반드시 명시합니다.

## Loom을 활용한 비디오 비동기

텍스트만으로는 복잡한 기술적 내용을 전달하기 어려울 때 **Loom**을 적극 활용합니다. 코드 리뷰, 버그 재현, 아키텍처 설명 등을 Loom 영상으로 공유하면 실시간 미팅 없이도 충분히 맥락을 전달할 수 있었습니다.

## 성과와 교훈

Working Agreement 도입 3개월 후 팀 서베이 결과, "업무 진행에 불필요한 대기 시간이 있다"는 응답이 71%에서 23%로 감소했습니다. 특히 한국과 캐나다 팀원 간의 협업 만족도가 크게 향상됐습니다.

가장 중요한 교훈은 **문서화는 팀원에 대한 존중**이라는 것입니다. 잘 작성된 비동기 메시지 하나가 불필요한 미팅 한 시간을 대체할 수 있습니다.`,
  },
  {
    id: "4",
    title: "[AES] 프로덕션 PII 노출 사고 회고 및 재발 방지 대책",
    excerpt:
      "사용자 개인정보가 로그에 노출된 보안 사고의 원인 분석과 우리가 이를 통해 개선한 전체 보안 파이프라인을 공유합니다.",
    category: "AES",
    author: "정다은",
    date: "2026. 02. 10.",
    readTime: "10분",
    thumbnail: thumbSecurity,
    tags: ["Security", "Post-mortem", "Compliance"],
    aciScore: 690,
    hasAesPenalty: true,
    aciBreakdown: { pps: 175, dig: 155, gcc: 170, wfa: 190 },
    content: `## 사고 요약

2026년 1월 14일 오전 11시, 모니터링 시스템이 Elasticsearch 클러스터에서 비정상적인 쿼리 패턴을 감지했습니다. 조사 결과 결제 서비스의 에러 로그에 사용자 카드 번호 일부(앞 6자리·뒤 4자리)와 이메일 주소가 평문으로 기록되고 있었음을 확인했습니다.

영향받은 사용자는 약 2,400명이며, 외부 유출은 확인되지 않았습니다. 사고 인지 후 4시간 내 로그 마스킹 핫픽스를 배포했고, 72시간 내 규제 기관에 신고했습니다.

## 근본 원인 분석

### 즉각적 원인

결제 처리 중 PG사 API 오류 응답이 발생했을 때, 개발자가 디버깅 목적으로 추가한 \`console.error(JSON.stringify(request))\` 코드가 리뷰를 통과해 프로덕션에 배포되었습니다. 요청 객체에는 마스킹 처리가 되지 않은 PII가 포함돼 있었습니다.

### 구조적 원인

- PII 필드에 대한 자동 마스킹 레이어 부재
- 로그 출력 코드에 대한 별도 리뷰 기준 없음
- 프로덕션 로그 접근 권한이 지나치게 광범위하게 부여됨
- PII 데이터 유형에 대한 팀 교육 부족

## 재발 방지 대책

### 1. 자동 PII 마스킹 레이어

모든 로거를 커스텀 래퍼로 교체했습니다. 이 래퍼는 로그 직전에 사전 정의된 PII 패턴(이메일, 전화번호, 카드번호, 주민번호 등)을 정규식으로 탐지하고 자동으로 마스킹합니다.

\`\`\`python
class PIISafeLogger:
    PII_PATTERNS = [
        (r'\\b[\\w.+-]+@[\\w-]+\\.[\\w.]+\\b', '[EMAIL]'),
        (r'\\b(\\d{4})[- ]?(\\d{4})[- ]?(\\d{4})[- ]?(\\d{4})\\b', '[CARD_NUM]'),
    ]

    def error(self, message: str, *args):
        safe_msg = self._mask_pii(str(message))
        self._logger.error(safe_msg, *args)
\`\`\`

### 2. 정적 분석 룰 추가

CI 파이프라인에 커스텀 린트 룰을 추가해, \`console.log\`, \`print\`, \`logger.debug\` 등의 호출에 \`request\`, \`payload\`, \`body\` 같은 고위험 변수가 포함되면 경고를 발생시킵니다.

### 3. 최소 권한 원칙 적용

프로덕션 로그 접근 권한을 시니어 엔지니어와 보안팀으로 제한했습니다. 일반 개발자는 스테이징 환경 로그에만 접근할 수 있습니다.

### 4. 보안 코드 리뷰 체크리스트

PR 템플릿에 보안 체크리스트를 추가했습니다. 결제·인증·개인정보 관련 코드 변경 시 반드시 보안 담당자의 LGTM을 받도록 CODEOWNERS를 설정했습니다.

## 사고 대응 타임라인

| 시간 | 행동 |
|------|------|
| T+0h | 모니터링 시스템 알림 발생 |
| T+0.5h | 사고 확인 및 대응팀 소집 |
| T+2h | 영향 범위 파악 완료 |
| T+4h | 로그 마스킹 핫픽스 배포 |
| T+24h | 전체 로그 삭제 및 재색인 |
| T+72h | 개인정보보호위원회 신고 |

## 마치며

이 사고는 기술적인 실수였지만, 근본적으로는 **보안을 개인의 주의에 의존하는 구조**에서 비롯된 문제였습니다. 재발 방지 대책의 핵심은 사람이 실수를 저질러도 시스템이 이를 막아주는 **Security by Default** 구조를 만드는 것입니다.

이 회고가 유사한 사고를 예방하는 데 도움이 되길 바랍니다.`,
  },
  {
    id: "5",
    title: "CI/CD 파이프라인 최적화로 배포 시간 70% 단축한 이야기",
    excerpt:
      "GitHub Actions와 Docker 레이어 캐싱을 활용하여 15분 걸리던 배포를 4분으로 줄인 과정을 단계별로 설명합니다.",
    category: "WFA",
    author: "최준혁",
    date: "2026. 02. 05.",
    readTime: "8분",
    thumbnail: thumbCicd,
    tags: ["CI/CD", "Docker", "GitHub Actions"],
    aciScore: 790,
    aciBreakdown: { pps: 190, dig: 185, gcc: 195, wfa: 220 },
    content: `## 문제 인식

팀의 배포 파이프라인은 15분이 걸렸습니다. 처음에는 크게 신경 쓰지 않았지만, 하루에 10~15번 배포가 이루어지면서 개발자들이 파이프라인 완료를 기다리며 컨텍스트를 잃는 문제가 생겼습니다. 핫픽스 배포 시에는 15분이 체감상 훨씬 길게 느껴졌습니다.

파이프라인을 분석해보니 문제는 명확했습니다.

- Docker 이미지 빌드: **8분** (매번 전체 레이어 재빌드)
- 테스트 실행: **4분** (순차 실행)
- 컨테이너 레지스트리 push: **2분** (캐싱 없음)
- 배포: **1분**

## 최적화 1: Docker 레이어 캐싱

가장 큰 시간을 차지하는 Docker 빌드를 먼저 공략했습니다. \`node_modules\` 설치 레이어를 소스 코드 레이어보다 먼저 배치하는 것만으로도 캐시 히트율이 크게 향상됩니다.

\`\`\`dockerfile
# 의존성 레이어 (거의 변하지 않음)
COPY package.json package-lock.json ./
RUN npm ci --only=production

# 소스 레이어 (자주 변함)
COPY src/ ./src/
RUN npm run build
\`\`\`

GitHub Actions에서는 \`cache-from\`과 \`cache-to\`를 활용해 빌드 캐시를 GitHub Container Registry에 저장합니다.

\`\`\`yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    cache-from: type=registry,ref=ghcr.io/org/app:cache
    cache-to: type=registry,ref=ghcr.io/org/app:cache,mode=max
\`\`\`

이 변경만으로 Docker 빌드 시간이 8분 → **2.5분**으로 단축됐습니다.

## 최적화 2: 테스트 병렬화

Jest의 \`--maxWorkers\` 옵션과 GitHub Actions의 \`matrix\` 전략을 결합해 테스트를 4개의 병렬 잡으로 분산했습니다.

\`\`\`yaml
strategy:
  matrix:
    shard: [1, 2, 3, 4]

steps:
  - run: npx jest --shard=\${{ matrix.shard }}/4
\`\`\`

테스트 실행 시간이 4분 → **1.2분**으로 단축됐습니다.

## 최적화 3: 조건부 실행

모든 PR에서 E2E 테스트와 보안 스캔을 실행할 필요는 없습니다. 변경 파일을 기준으로 필요한 잡만 실행하도록 했습니다.

\`\`\`yaml
- name: Check changed files
  id: changes
  uses: dorny/paths-filter@v3
  with:
    filters: |
      src:
        - 'src/**'
      infra:
        - 'terraform/**'
\`\`\`

## 최종 결과

| 단계 | 최적화 전 | 최적화 후 |
|------|----------|----------|
| Docker 빌드 | 8분 | 2.5분 |
| 테스트 | 4분 | 1.2분 |
| Registry Push | 2분 | 0.5분 |
| 배포 | 1분 | 0.8분 |
| **합계** | **15분** | **5분** |

목표였던 70% 단축을 달성했습니다. 팀의 배포 빈도는 일 평균 12회에서 **21회**로 증가했고, 배포 관련 불만 사항이 분기 리트로에서 사라졌습니다.

## 마치며

CI/CD 최적화는 단순히 시간을 아끼는 것이 아닙니다. 빠른 피드백 루프는 개발자가 더 자주, 더 작은 단위로 배포하도록 유도하고 이는 결과적으로 **리스크를 분산**시킵니다. 15분짜리 파이프라인은 개발자를 다른 작업으로 떠나게 만들지만, 5분짜리 파이프라인은 개발자가 결과를 직접 확인하게 만듭니다.`,
  },
];

export const popularPosts = [
  { id: "2", title: "GPT-4o 기반 코드 리뷰 자동화 파이프라인 구축기", author: "이서연" },
  { id: "5", title: "CI/CD 파이프라인 최적화로 배포 시간 70% 단축한 이야기", author: "최준혁" },
  { id: "1", title: "대규모 트래픽 환경에서의 Event-Driven Architecture 설계 전략", author: "김현우" },
];
