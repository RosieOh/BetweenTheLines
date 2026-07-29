// blog.config.json 을 빌드 스크립트에서 읽기 위한 얇은 래퍼입니다.
// 런타임(src/lib/blogConfig.ts)과 같은 파일을 보므로 값이 어긋날 수 없습니다.

import { readFileSync } from "node:fs";
import { join } from "node:path";

export const blogMeta = JSON.parse(
  readFileSync(join(process.cwd(), "blog.config.json"), "utf8")
);
