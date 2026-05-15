import { useRef, useState, useCallback, useEffect } from "react";
import * as XLSX from "xlsx";
import { useAuth } from "@/contexts/AuthContext";
import { useRoster, useInsertRoster } from "@/api/hooks/roster/useRoster";
import type { RosterInsert } from "@/api/roster";
import LoadingState from "@components/admin/LoadingState";

type ParsedRow = {
  department: string;
  name: string;
  student_id: string;
  phone: string;
  generation: string;
};

type UploadStatus = "idle" | "loading" | "success" | "error";

function parseStudentId(raw: unknown): string {
  if (raw === null || raw === undefined || raw === "") return "";
  const num = Number(raw);
  if (!isNaN(num) && isFinite(num)) return Math.round(num).toString();
  return String(raw);
}

function parseExcel(file: File): Promise<ParsedRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
        const parsed: ParsedRow[] = rows
          .map((row) => ({
            department: String(row["소속분과"] ?? "").trim(),
            name: String(row["이름"] ?? "").trim(),
            student_id: parseStudentId(row["학번"]),
            phone: String(row["전화번호"] ?? "").trim(),
            generation: String(row["기수"] ?? "").trim(),
          }))
          .filter((r) => r.name && r.generation);
        resolve(parsed);
      } catch {
        reject(new Error("엑셀 파일을 파싱할 수 없습니다."));
      }
    };
    reader.onerror = () => reject(new Error("파일을 읽을 수 없습니다."));
    reader.readAsArrayBuffer(file);
  });
}

export default function AdminRoster() {
  const { profile } = useAuth();
  const { data: roster = [], isLoading } = useRoster();
  const insertRoster = useInsertRoster();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [selectedGen, setSelectedGen] = useState<string>("전체");

  // 성공 후 3초 뒤 idle 복귀
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
    [profile, insertRoster]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  // 기수 목록 추출 및 정렬
  const grouped = roster.reduce<Record<string, typeof roster>>((acc, m) => {
    if (!acc[m.generation]) acc[m.generation] = [];
    acc[m.generation].push(m);
    return acc;
  }, {});
  const parseGenNum = (g: string) => parseFloat(g.replace("기", "")) || 0;
  const generations = Object.keys(grouped).sort((a, b) => parseGenNum(b) - parseGenNum(a));

  const sortMembers = (list: typeof roster) =>
    [...list].sort((a, b) => {
      const diff = parseGenNum(b.generation) - parseGenNum(a.generation);
      return diff !== 0 ? diff : a.name.localeCompare(b.name, "ko");
    });

  const displayedMembers = sortMembers(
    selectedGen === "전체" ? roster : (grouped[selectedGen] ?? [])
  );

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-headline text-on-surface">부원 명단</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            엑셀 파일을 업로드해 기수별 부원 명단을 관리합니다.
          </p>
        </div>

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
                <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                업로드 중...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">upload_file</span>
                엑셀 업로드
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* 명단 */}
      {isLoading ? (
        <LoadingState />
      ) : roster.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl shadow-card px-6 py-16 flex flex-col items-center gap-2">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">group</span>
          <p className="text-sm text-on-surface-variant">아직 등록된 명단이 없습니다.</p>
          <p className="text-xs text-on-surface-variant/60">엑셀 파일을 업로드하면 명단이 등록됩니다.</p>
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
                  <span className={`ml-1.5 text-xs ${selectedGen === gen ? "text-white/70" : "text-on-surface-variant/60"}`}>
                    {grouped[gen].length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <p className="text-xs text-on-surface-variant">
            총 <span className="font-semibold text-on-surface">{displayedMembers.length}명</span>
          </p>

          <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container/50">
                    <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant">기수</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant">이름</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant">소속분과</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant">학번</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant">전화번호</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {displayedMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-primary-fixed/10 transition-colors">
                      <td className="px-5 py-3 text-sm text-on-surface-variant">{m.generation}</td>
                      <td className="px-5 py-3 font-semibold text-on-surface">{m.name}</td>
                      <td className="px-4 py-3 text-sm text-on-surface-variant">{m.department}</td>
                      <td className="px-4 py-3 text-sm text-on-surface-variant">{m.student_id}</td>
                      <td className="px-4 py-3 text-sm text-on-surface-variant">{m.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
