import { useState } from "react";
import { MessageSquare, Trash2, X } from "lucide-react";
import { getInquiries, deleteInquiry, type Inquiry } from "@/lib/postStorage";
import AdminLayout from "@/components/blog/AdminLayout";

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>(() =>
    getInquiries().slice().reverse()
  );
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteInquiry(id);
    setInquiries(getInquiries().slice().reverse());
    setDeleteTarget(null);
    if (selected?.id === id) setSelected(null);
  };

  return (
    <AdminLayout>
      <div className="p-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[24px] font-extrabold text-foreground">문의 관리</h1>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              블로그를 통해 수신된 문의를 확인하세요.
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[13px] font-bold">
            총 {inquiries.length}건
          </span>
        </div>

        {/* Empty state */}
        {inquiries.length === 0 ? (
          <div className="rounded-2xl border border-border bg-secondary/30 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={28} className="text-muted-foreground" />
            </div>
            <p className="text-[15px] font-semibold text-foreground mb-1">수신된 문의가 없습니다</p>
            <p className="text-[13px] text-muted-foreground">
              블로그에서 문의 폼을 통해 메시지를 보내면 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-background hover:bg-secondary/30 transition-colors cursor-pointer group"
                onClick={() => setSelected(inq)}
              >
                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={14} className="text-blue-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-[14px] font-semibold text-foreground">{inq.name}</span>
                    <span className="text-[12px] text-muted-foreground">{inq.email}</span>
                    {inq.company && (
                      <span className="px-1.5 py-0.5 rounded bg-secondary border border-border text-[10px] text-muted-foreground font-medium">
                        {inq.company}
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-muted-foreground line-clamp-1">{inq.message}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(inq.date).toLocaleDateString("ko-KR")}
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(inq.id); }}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors opacity-0 group-hover:opacity-100"
                    title="삭제"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-background rounded-2xl border border-border p-7 max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">
                  문의 상세
                </p>
                <h2 className="text-[18px] font-extrabold text-foreground">{selected.name}</h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-3 mb-5">
              <div className="flex gap-3">
                <span className="text-[12px] font-semibold text-muted-foreground w-14 flex-shrink-0">이메일</span>
                <span className="text-[13px] text-foreground">{selected.email}</span>
              </div>
              {selected.company && (
                <div className="flex gap-3">
                  <span className="text-[12px] font-semibold text-muted-foreground w-14 flex-shrink-0">회사</span>
                  <span className="text-[13px] text-foreground">{selected.company}</span>
                </div>
              )}
              <div className="flex gap-3">
                <span className="text-[12px] font-semibold text-muted-foreground w-14 flex-shrink-0">날짜</span>
                <span className="text-[13px] text-foreground">
                  {new Date(selected.date).toLocaleString("ko-KR")}
                </span>
              </div>
            </div>

            <div className="bg-secondary rounded-xl border border-border p-4 mb-5">
              <p className="text-[12px] font-semibold text-muted-foreground mb-2">문의 내용</p>
              <p className="text-[14px] text-foreground whitespace-pre-wrap leading-relaxed">
                {selected.message}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelected(null)}
                className="flex-1 h-10 rounded-xl border border-border text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                닫기
              </button>
              <button
                onClick={() => { setDeleteTarget(selected.id); setSelected(null); }}
                className="px-4 h-10 rounded-xl bg-red-500 text-white text-[13px] font-semibold hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-2xl border border-border p-7 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-900 flex items-center justify-center">
                <Trash2 size={18} className="text-red-500" />
              </div>
              <h3 className="text-[17px] font-extrabold text-foreground">문의 삭제</h3>
            </div>
            <p className="text-[14px] text-muted-foreground mb-6">
              이 문의를 삭제하면 복구할 수 없습니다. 정말 삭제하시겠습니까?
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
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminInquiries;
