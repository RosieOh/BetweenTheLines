import thumbArchitecture from "@/assets/thumb-architecture.jpg";
import thumbAiReview from "@/assets/thumb-ai-review.jpg";
import thumbCommunication from "@/assets/thumb-communication.jpg";
import thumbSecurity from "@/assets/thumb-security.jpg";
import thumbCicd from "@/assets/thumb-cicd.jpg";

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
    thumbnail: thumbArchitecture,
    tags: ["Kafka", "Architecture", "Microservices"],
    aciScore: 730,
  },
  {
    id: "2",
    title: "GPT-4o 기반 코드 리뷰 자동화 파이프라인 구축기",
    excerpt:
      "AI 도구를 활용하여 코드 리뷰 프로세스를 자동화하고, 리뷰 품질과 속도를 동시에 높인 경험을 정리합니다.",
    category: "DIG",
    author: "이서연",
    date: "2026. 02. 25.",
    thumbnail: thumbAiReview,
    tags: ["AI", "Automation", "DevOps"],
    aciScore: 795,
  },
  {
    id: "3",
    title: "글로벌 리모트 팀과의 비동기 커뮤니케이션 프로토콜",
    excerpt:
      "4개국 8명의 엔지니어가 시차를 극복하고 효율적으로 협업하기 위해 수립한 커뮤니케이션 가이드라인입니다.",
    category: "GCC",
    author: "박민석",
    date: "2026. 02. 18.",
    thumbnail: thumbCommunication,
    tags: ["Remote", "Communication", "Agile"],
    aciScore: 670,
  },
  {
    id: "4",
    title: "[AES] 프로덕션 PII 노출 사고 회고 및 재발 방지 대책",
    excerpt:
      "사용자 개인정보가 로그에 노출된 보안 사고의 원인 분석과 우리가 이를 통해 개선한 전체 보안 파이프라인을 공유합니다.",
    category: "AES",
    author: "정다은",
    date: "2026. 02. 10.",
    thumbnail: thumbSecurity,
    tags: ["Security", "Post-mortem", "Compliance"],
    aciScore: 690,
    hasAesPenalty: true,
  },
  {
    id: "5",
    title: "CI/CD 파이프라인 최적화로 배포 시간 70% 단축한 이야기",
    excerpt:
      "GitHub Actions와 Docker 레이어 캐싱을 활용하여 15분 걸리던 배포를 4분으로 줄인 과정을 단계별로 설명합니다.",
    category: "WFA",
    author: "최준혁",
    date: "2026. 02. 05.",
    thumbnail: thumbCicd,
    tags: ["CI/CD", "Docker", "GitHub Actions"],
    aciScore: 790,
  },
];

export const popularPosts = [
  { id: "2", title: "GPT-4o 기반 코드 리뷰 자동화 파이프라인 구축기", author: "이서연" },
  { id: "5", title: "CI/CD 파이프라인 최적화로 배포 시간 70% 단축한 이야기", author: "최준혁" },
  { id: "1", title: "대규모 트래픽 환경에서의 Event-Driven Architecture 설계 전략", author: "김현우" },
];
