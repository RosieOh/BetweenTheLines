import { useEffect, useRef } from "react";
import { giscusConfig } from "@/lib/blogConfig";

const GiscusComments = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isConfigured = Boolean(giscusConfig.repoId && giscusConfig.categoryId);

  useEffect(() => {
    if (!containerRef.current || containerRef.current.hasChildNodes() || !isConfigured) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", giscusConfig.repo);
    script.setAttribute("data-repo-id", giscusConfig.repoId);
    script.setAttribute("data-category", giscusConfig.category);
    script.setAttribute("data-category-id", giscusConfig.categoryId);
    script.setAttribute("data-mapping", giscusConfig.mapping);
    script.setAttribute("data-strict", giscusConfig.strict);
    script.setAttribute("data-reactions-enabled", giscusConfig.reactionsEnabled);
    script.setAttribute("data-emit-metadata", giscusConfig.emitMetadata);
    script.setAttribute("data-input-position", giscusConfig.inputPosition);
    script.setAttribute("data-theme", giscusConfig.theme);
    script.setAttribute("data-lang", giscusConfig.lang);
    script.crossOrigin = "anonymous";
    script.async = true;

    containerRef.current.appendChild(script);
  }, [isConfigured]);

  return (
    <div className="mt-12 pt-10 border-t border-border">
      <p className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground mb-6">
        댓글
      </p>
      {isConfigured ? (
        <div ref={containerRef} />
      ) : (
        <p className="text-sm text-muted-foreground">
          댓글 기능을 활성화하려면 `VITE_GISCUS_REPO_ID`, `VITE_GISCUS_CATEGORY_ID`를 설정하세요.
        </p>
      )}
    </div>
  );
};

export default GiscusComments;
