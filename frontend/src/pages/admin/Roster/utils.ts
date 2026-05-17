import * as XLSX from "xlsx";

export type ParsedRow = {
  department: string;
  name: string;
  student_id: string;
  phone: string;
  generation: string;
};

function parseStudentId(raw: unknown): string {
  if (raw === null || raw === undefined || raw === "") return "";
  const num = Number(raw);
  if (!isNaN(num) && isFinite(num)) return Math.round(num).toString();
  return String(raw);
}

export function parseExcel(file: File): Promise<ParsedRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
          defval: "",
        });
        const parsed: ParsedRow[] = rows
          .map((row) => ({
            department: String(row["소속분과"] ?? "").trim(),
            name: String(row["이름"] ?? "").trim(),
            student_id: parseStudentId(row["학번"]),
            phone: String(row["전화번호"] ?? "").replace(/\D/g, ""),
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
