import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy-loaded pages
const Index = lazy(() => import("./pages/Index"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AciPillars = lazy(() => import("./pages/AciPillars"));
const AesGuardrail = lazy(() => import("./pages/AesGuardrail"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const TagPage = lazy(() => import("./pages/TagPage"));
const AuthorPage = lazy(() => import("./pages/AuthorPage"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Engineering = lazy(() => import("./pages/Engineering"));
const About = lazy(() => import("./pages/About"));
const Newsletter = lazy(() => import("./pages/Newsletter"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const PostEditor = lazy(() => import("./pages/admin/PostEditor"));

const PageFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
  </div>
);

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/post/:id" element={<PostDetail />} />

            {/* Phase 1 — required */}
            <Route path="/aci-pillars" element={<AciPillars />} />
            <Route path="/aes-guardrail" element={<AesGuardrail />} />
            <Route path="/search" element={<SearchPage />} />

            {/* Phase 2 — recommended */}
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/tag/:tag" element={<TagPage />} />
            <Route path="/author/:name" element={<AuthorPage />} />

            {/* Phase 3 — optional */}
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/engineering" element={<Engineering />} />
            <Route path="/about" element={<About />} />
            <Route path="/newsletter" element={<Newsletter />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/posts/new" element={<PostEditor />} />
            <Route path="/admin/posts/:id/edit" element={<PostEditor />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;
