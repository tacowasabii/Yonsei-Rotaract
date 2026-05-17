import type { RosterMember } from "@/api/roster";
import { formatPhone } from "@pages/admin/shared";
import { EditIcon, DeleteIcon } from "@assets/icons";

export type EditForm = {
  department: string;
  name: string;
  student_id: string;
  phone: string;
  generation: string;
};

const inputCls =
  "w-full px-2 py-1 bg-surface-container rounded-lg text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary-container/30";

interface RosterTableProps {
  members: RosterMember[];
  isAdmin: boolean;
  editingId: string | null;
  editForm: EditForm;
  updatePending: boolean;
  onStartEdit: (m: RosterMember) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onEditFormChange: (field: keyof EditForm, value: string) => void;
  onDeleteTarget: (target: { id: string; name: string }) => void;
}

export default function RosterTable({
  members,
  isAdmin,
  editingId,
  editForm,
  updatePending,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditFormChange,
  onDeleteTarget,
}: RosterTableProps) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max text-sm">
          <thead>
            <tr className="border-b border-outline-variant/20 bg-surface-container/50">
              <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant whitespace-nowrap">
                기수
              </th>
              <th className="text-left px-5 py-3 text-xs font-bold text-on-surface-variant whitespace-nowrap">
                이름
              </th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant whitespace-nowrap">
                소속분과
              </th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant whitespace-nowrap">
                학번
              </th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant whitespace-nowrap">
                전화번호
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {members.map((m) =>
              editingId === m.id ? (
                <tr key={m.id} className="bg-primary-fixed/5">
                  <td className="px-5 py-2">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.5"
                        value={editForm.generation}
                        onChange={(e) => onEditFormChange("generation", e.target.value)}
                        className="w-16 px-2 py-1 bg-surface-container rounded-lg text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary-container/30"
                        placeholder="58"
                      />
                      <span className="text-sm text-on-surface-variant">기</span>
                    </div>
                  </td>
                  <td className="px-5 py-2">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => onEditFormChange("name", e.target.value)}
                      className={inputCls}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={editForm.department}
                      onChange={(e) => onEditFormChange("department", e.target.value)}
                      className={inputCls}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={editForm.student_id}
                      onChange={(e) => onEditFormChange("student_id", e.target.value)}
                      className={inputCls}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                        onEditFormChange("phone", digits);
                      }}
                      className={inputCls}
                      placeholder="01000000000"
                      maxLength={11}
                    />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={onSaveEdit}
                        disabled={updatePending}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-primary-container text-white hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
                      >
                        저장
                      </button>
                      <button
                        onClick={onCancelEdit}
                        disabled={updatePending}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container whitespace-nowrap"
                      >
                        취소
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr
                  key={m.id}
                  className="hover:bg-primary-fixed/10 transition-colors"
                >
                  <td className="px-5 py-3 text-sm text-on-surface-variant whitespace-nowrap">
                    {m.generation}
                  </td>
                  <td className="px-5 py-3 font-semibold text-on-surface whitespace-nowrap">
                    {m.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-on-surface-variant whitespace-nowrap">
                    {m.department}
                  </td>
                  <td className="px-4 py-3 text-sm text-on-surface-variant whitespace-nowrap">
                    {m.student_id}
                  </td>
                  <td className="px-4 py-3 text-sm text-on-surface-variant whitespace-nowrap">
                    {formatPhone(m.phone)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {isAdmin && (
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => onStartEdit(m)}
                          className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                          title="수정"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteTarget({ id: m.id, name: m.name })}
                          className="p-1 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10"
                          title="삭제"
                        >
                          <DeleteIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
