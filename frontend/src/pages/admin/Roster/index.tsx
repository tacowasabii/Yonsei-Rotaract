import { useRef, useState, useCallback, useEffect } from "react";
import { useAuth, useIsAdmin } from "@/contexts/AuthContext";
import {
  useRoster,
  useInsertRoster,
  useUpdateRoster,
  useDeleteRoster,
  useDeleteRosterByGeneration,
} from "@/api/hooks/roster/useRoster";
import type { RosterInsert } from "@/api/roster";
import LoadingState from "@components/admin/LoadingState";
import ConfirmModal from "@components/admin/ConfirmModal";
import { UploadFileIcon } from "@assets/icons";
import { parseExcel } from "./utils";
import RosterTable, { type EditForm } from "./components/RosterTable";

type UploadStatus = "idle" | "loading" | "success" | "error";

const parseGenNum = (g: string) => parseFloat(g.replace("기", "")) || 0;

export default function AdminRoster() {
  const { profile } = useAuth();
  const isAdmin = useIsAdmin();
  const { data: roster = [], isLoading } = useRoster();
  const insertRoster = useInsertRoster();
  const updateRoster = useUpdateRoster();
  const deleteRoster = useDeleteRoster();
  const deleteRosterBulk = useDeleteRosterByGeneration();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadMessage, setUploadMessage] = useState<string>("");

  const [selectedGen, setSelectedGen] = useState<string>("전체");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    department: "",
    name: "",
    student_id: "",
    phone: "",
    generation: "",
  });

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [bulkDeleteTarget, setBulkDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    if (uploadStatus !== "success") return;
    const timer = setTimeout(() => setUploadStatus("idle"), 3000);
    return () => clearTimeout(timer);
  }, [uploadStatus]);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
        setUploadStatus("error");
        setUploadMessage("xlsx 또는 xls 파일만 업로드할 수 있습니다.");
        return;
      }
      setUploadStatus("loading");
      setUploadMessage("");
      try {
        const rows = await parseExcel(file);
        if (rows.length === 0) {
          setUploadStatus("error");
          setUploadMessage("유효한 데이터가 없습니다. 파일 형식을 확인해주세요.");
          return;
        }
        const members: RosterInsert[] = rows.map((r) => ({
          ...r,
          uploaded_by: profile?.id ?? null,
        }));
        insertRoster.mutate(members, {
          onSuccess: () => {
            setUploadStatus("success");
            setUploadMessage(`${members.length}명이 추가됐습니다.`);
          },
          onError: () => {
            setUploadStatus("error");
            setUploadMessage("저장 중 오류가 발생했습니다.");
          },
        });
      } catch (err) {
        setUploadStatus("error");
        setUploadMessage(err instanceof Error ? err.message : "파싱 오류");
      }
    },
    [profile, insertRoster],
  );

  function handleEditFormChange(field: keyof EditForm, value: string) {
    setEditForm((f) => ({ ...f, [field]: value }));
  }

  function handleStartEdit(m: (typeof roster)[number]) {
    setEditingId(m.id);
    setEditForm({
      department: m.department,
      name: m.name,
      student_id: m.student_id,
      phone: m.phone,
      generation: m.generation.replace("기", ""),
    });
  }

  function handleSaveEdit() {
    if (!editingId) return;
    updateRoster.mutate(
      {
        id: editingId,
        data: {
          department: editForm.department.trim(),
          name: editForm.name.trim(),
          student_id: editForm.student_id.trim(),
          phone: editForm.phone.replace(/\D/g, ""),
          generation: editForm.generation.trim() + "기",
        },
      },
      { onSuccess: () => setEditingId(null) },
    );
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteRoster.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }

  const grouped = roster.reduce<Record<string, typeof roster>>((acc, m) => {
    if (!acc[m.generation]) acc[m.generation] = [];
    acc[m.generation].push(m);
    return acc;
  }, {});
  const generations = Object.keys(grouped).sort(
    (a, b) => parseGenNum(b) - parseGenNum(a),
  );

  const displayedMembers = [...(selectedGen === "전체" ? roster : (grouped[selectedGen] ?? []))].sort(
    (a, b) => {
      const diff = parseGenNum(b.generation) - parseGenNum(a.generation);
      return diff !== 0 ? diff : a.name.localeCompare(b.name, "ko");
    },
  );

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-headline text-on-surface">
            부원 명단
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            엑셀 파일을 업로드해 기수별 부원 명단을 관리합니다.
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-3 shrink-0">
            {uploadStatus === "success" && (
              <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-base">check_circle</span>
                {uploadMessage}
              </span>
            )}
            {uploadStatus === "error" && (
              <span className="text-xs text-error font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-base">error</span>
                {uploadMessage}
              </span>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadStatus === "loading"}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-primary-container text-white hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {uploadStatus === "loading" ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">
                    progress_activity
                  </span>
                  업로드 중...
                </>
              ) : (
                <>
                  <UploadFileIcon className="w-4 h-4" />
                  엑셀 업로드
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = "";
              }}
            />
          </div>
        )}
      </div>

      {/* 명단 */}
      {isLoading ? (
        <LoadingState />
      ) : roster.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl shadow-card px-6 py-16 flex flex-col items-center gap-2">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
            group
          </span>
          <p className="text-sm text-on-surface-variant">
            아직 등록된 명단이 없습니다.
          </p>
          <p className="text-xs text-on-surface-variant/60">
            엑셀 파일을 업로드하면 명단이 등록됩니다.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 기수 탭 */}
          <div className="flex gap-2 flex-wrap">
            {["전체", ...generations].map((gen) => (
              <button
                key={gen}
                onClick={() => setSelectedGen(gen)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  selectedGen === gen
                    ? "bg-primary-container text-white"
                    : "bg-surface-container-lowest text-on-surface-variant shadow-card hover:bg-primary-fixed/20"
                }`}
              >
                {gen}
                {gen !== "전체" && (
                  <span
                    className={`ml-1.5 text-xs ${selectedGen === gen ? "text-white/70" : "text-on-surface-variant/60"}`}
                  >
                    {grouped[gen].length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-on-surface-variant">
              총{" "}
              <span className="font-semibold text-on-surface">
                {displayedMembers.length}명
              </span>
            </p>
            {isAdmin && (
              <button
                onClick={() => setBulkDeleteTarget(selectedGen)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-error hover:bg-error/10 transition-all"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                {selectedGen === "전체" ? "전체 삭제" : `${selectedGen} 전체 삭제`}
              </button>
            )}
          </div>

          <RosterTable
            members={displayedMembers}
            isAdmin={isAdmin}
            editingId={editingId}
            editForm={editForm}
            updatePending={updateRoster.isPending}
            onStartEdit={handleStartEdit}
            onCancelEdit={() => setEditingId(null)}
            onSaveEdit={handleSaveEdit}
            onEditFormChange={handleEditFormChange}
            onDeleteTarget={setDeleteTarget}
          />
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="부원 삭제"
          message={`${deleteTarget.name}을(를) 명단에서 삭제합니다. 이 작업은 되돌릴 수 없습니다.`}
          icon="delete"
          isDestructive
          confirmLabel="삭제"
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteTarget(null)}
          isPending={deleteRoster.isPending}
        />
      )}

      {bulkDeleteTarget && (
        <ConfirmModal
          title={bulkDeleteTarget === "전체" ? "전체 삭제" : `${bulkDeleteTarget} 전체 삭제`}
          message={
            bulkDeleteTarget === "전체"
              ? "명단 전체를 삭제합니다. 이 작업은 되돌릴 수 없습니다."
              : `${bulkDeleteTarget} 부원 전체를 삭제합니다. 이 작업은 되돌릴 수 없습니다.`
          }
          icon="delete"
          isDestructive
          confirmLabel="전체 삭제"
          onConfirm={() => {
            deleteRosterBulk.mutate(
              bulkDeleteTarget === "전체" ? null : bulkDeleteTarget,
              {
                onSuccess: () => {
                  setBulkDeleteTarget(null);
                  setSelectedGen("전체");
                },
              },
            );
          }}
          onClose={() => setBulkDeleteTarget(null)}
          isPending={deleteRosterBulk.isPending}
        />
      )}
    </div>
  );
}
