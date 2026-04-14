import { useState } from "react";
import { Users, Trash2, Copy, Check } from "lucide-react";
import { getSubscribers, deleteSubscriber } from "@/lib/postStorage";
import AdminLayout from "@/components/blog/AdminLayout";

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState<string[]>(() => getSubscribers());
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleDelete = (email: string) => {
    deleteSubscriber(email);
    setSubscribers(getSubscribers());
    setDeleteTarget(null);
  };

  const handleCopyAll = () => {
    if (subscribers.length === 0) return;
    navigator.clipboard.writeText(subscribers.join(", ")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <AdminLayout>
      <div className="p-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[24px] font-extrabold text-foreground">구독자 관리</h1>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              뉴스레터를 구독한 이메일 목록입니다.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[13px] font-bold">
              총 {subscribers.length}명
            </span>
            {subscribers.length > 0 && (
              <button
                onClick={handleCopyAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                {copied ? "복사됨" : "전체 복사"}
              </button>
            )}
          </div>
        </div>

        {/* Empty state */}
        {subscribers.length === 0 ? (
          <div className="rounded-2xl border border-border bg-secondary/30 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto mb-4">
              <Users size={28} className="text-muted-foreground" />
            </div>
            <p className="text-[15px] font-semibold text-foreground mb-1">구독자가 없습니다</p>
            <p className="text-[13px] text-muted-foreground">
              블로그 뉴스레터 페이지를 통해 구독자를 모을 수 있습니다.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {subscribers.map((email, idx) => (
              <div
                key={email}
                className="flex items-center gap-4 px-4 py-3 rounded-2xl border border-border bg-background hover:bg-secondary/30 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    {idx + 1}
                  </span>
                </div>
                <span className="flex-1 text-[14px] text-foreground font-medium">{email}</span>
                <button
                  onClick={() => setDeleteTarget(email)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors opacity-0 group-hover:opacity-100"
                  title="구독 취소"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-2xl border border-border p-7 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-900 flex items-center justify-center">
                <Trash2 size={18} className="text-red-500" />
              </div>
              <h3 className="text-[17px] font-extrabold text-foreground">구독 취소</h3>
            </div>
            <p className="text-[14px] text-muted-foreground mb-1">
              다음 구독자를 목록에서 제거합니다:
            </p>
            <p className="text-[13px] font-semibold text-foreground mb-6 bg-secondary rounded-lg px-3 py-2">
              {deleteTarget}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 h-10 rounded-xl border border-border text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                className="flex-1 h-10 rounded-xl bg-red-500 text-white text-[13px] font-semibold hover:bg-red-600 transition-colors"
              >
                제거
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSubscribers;
