import type { Config } from "tailwindcss";
import preset from "../../tailwind.preset.ts";

export default {
  presets: [preset],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    // 공유 컴포넌트가 쓰는 클래스도 스캔 대상에 포함해야 purge 되지 않습니다.
    "../../packages/core/src/**/*.{ts,tsx}",
  ],
} satisfies Config;
