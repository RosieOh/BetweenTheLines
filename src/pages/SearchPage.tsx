import { useSearchParams, Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import BlogArticleCard from "@/components/blog/BlogArticleCard";
import { categories } from "@/data/posts";
import { getAllPosts } from "@/lib/postStorage";
import type { PostData } from "@/data/posts";

function searchPosts(query: string, category: string): PostData[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return getAllPosts().filter((post) => {
    const matchesCategory = category === "전체" || post.category === category;
    const matchesQuery =
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.content.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q)) ||
      post.author.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });
}

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "전체";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [results, setResults] = useState<PostData[]>([]);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);

  useEffect(() => {
    if (initialQuery) {
      setResults(searchPosts(initialQuery, initialCategory));
      setHasSearched(true);
    }
  }, [initialQuery, initialCategory]);

  const handleSearch = (q: string, cat: string) => {
    const params: Record<string, string> = {};
    if (q) params.q = q;
    if (cat !== "전체") params.category = cat;
    setSearchParams(params);
    setResults(searchPosts(q, cat));
    setHasSearched(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(query, selectedCategory);
    }
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (hasSearched) {
      handleSearch(query, cat);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main className="container max-w-3xl py-12">
        {/* Search input */}
        <div className="mb-8">
          <h1 className="text-[28px] font-extrabold text-foreground mb-6">검색</h1>
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="제목, 태그, 내용으로 검색..."
              autoFocus
              className="w-full h-12 pl-11 pr-12 rounded-xl border border-border bg-background text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors border ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleSearch(query, selectedCategory)}
            className="mt-4 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition-opacity"
          >
            검색
          </button>
        </div>

        {/* Results */}
        {hasSearched && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[14px] text-muted-foreground">
                {results.length > 0 ? (
                  <>
                    <span className="font-semibold text-foreground">&ldquo;{searchParams.get("q")}&rdquo;</span>
                    {" "}검색 결과{" "}
                    <span className="font-semibold text-foreground">{results.length}건</span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-foreground">&ldquo;{searchParams.get("q")}&rdquo;</span>
                    에 대한 검색 결과가 없습니다.
                  </>
                )}
              </p>
            </div>

            {results.length > 0 ? (
              <div className="divide-y divide-border">
                {results.map((post) => (
                  <BlogArticleCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-4">
                  <Search size={24} className="text-muted-foreground" />
                </div>
                <p className="text-[17px] font-semibold text-foreground mb-2">
                  검색 결과가 없습니다
                </p>
                <p className="text-[14px] text-muted-foreground mb-6 max-w-sm">
                  다른 키워드로 검색하거나 카테고리 필터를 변경해보세요.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Kafka", "AI", "Docker", "Remote", "Security"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setQuery(tag);
                        handleSearch(tag, selectedCategory);
                      }}
                      className="px-3 py-1.5 rounded-full bg-secondary border border-border text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!hasSearched && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-4">
              <Search size={24} className="text-muted-foreground" />
            </div>
            <p className="text-[17px] font-semibold text-foreground mb-2">
              무엇을 찾고 있나요?
            </p>
            <p className="text-[14px] text-muted-foreground mb-6 max-w-sm">
              아티클 제목, 태그, 내용, 저자 이름으로 검색할 수 있습니다.
            </p>
            <div className="text-[13px] text-muted-foreground">
              <p className="mb-2 font-medium text-foreground">인기 검색어</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Kafka", "AI", "CI/CD", "Remote", "Security", "Architecture"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setQuery(tag);
                      handleSearch(tag, selectedCategory);
                    }}
                    className="px-3 py-1.5 rounded-full bg-secondary border border-border text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <BlogFooter />
    </div>
  );
};

export default SearchPage;
