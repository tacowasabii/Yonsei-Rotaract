import { useState } from "react";
import PageLayout from "@components/layout/PageLayout";
import PageHeader from "@components/layout/PageHeader";
import { SchoolIcon, PersonIcon } from "@assets/icons";
import { useAlumni } from "@/api/hooks/profiles/useAlumni";
import type { AlumniMember } from "@/api/types/member";
import { useAuth } from "@/contexts/AuthContext";
import ComposeModal from "@components/common/ComposeModal";
import type { MemberSearchResult } from "@/api/types/message";

function formatAdmissionYear(year: number | null): string {
  if (!year) return "";
  return `${String(year).slice(-2)}학번`;
}

interface AlumniCardProps {
  person: AlumniMember;
  onMessage?: (recipient: MemberSearchResult) => void;
}

function AlumniCard({ person, onMessage }: AlumniCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col">
      <div className="flex flex-col items-center mb-4">
        <div className="w-14 h-14 rounded-full bg-secondary-fixed flex items-center justify-center mb-3">
          <PersonIcon className="w-6 h-6 text-on-secondary-fixed-variant" />
        </div>
        <h3 className="font-headline font-bold text-base text-on-surface">{person.name}</h3>
        <p className="text-xs text-on-surface-variant mt-0.5">{person.email}</p>
      </div>

      <div className="flex gap-2 justify-center flex-wrap mb-4">
        {person.admission_year && (
          <span className="text-xs font-semibold bg-primary-fixed/40 text-primary-container px-3 py-1 rounded-full">
            {formatAdmissionYear(person.admission_year)}
          </span>
        )}
        {person.generation && (
          <span className="text-xs font-semibold bg-secondary-fixed/60 text-on-secondary-fixed px-3 py-1 rounded-full">
            {person.generation}
          </span>
        )}
      </div>

      <div className="space-y-1.5 border-t border-outline-variant/20 pt-3">
        {person.department && (
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">school</span>
            <span>{person.department}</span>
          </div>
        )}
        {person.company && (
          <div className="flex items-center gap-2 text-xs">
            <span className="material-symbols-outlined text-sm text-on-surface-variant">business</span>
            <span className="font-semibold text-on-surface">{person.company}</span>
          </div>
        )}
        {person.job_title && (
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">badge</span>
            <span>{person.job_title}</span>
          </div>
        )}
      </div>

      {onMessage && (
        <button
          onClick={() => onMessage({ id: person.id, name: person.name })}
          className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">mail</span>
          쪽지 보내기
        </button>
      )}
    </div>
  );
}

export default function AlumniPage() {
  const [search, setSearch] = useState("");
  const [composeTarget, setComposeTarget] = useState<MemberSearchResult | null>(null);
  const { user } = useAuth();
  const { data, isLoading, isError } = useAlumni();

  const filtered = (data ?? []).filter((a) => {
    if (!search.trim()) return true;
    const q = search.trim();
    return (
      a.name.includes(q) ||
      (a.department ?? "").includes(q) ||
      (a.company ?? "").includes(q)
    );
  });

  return (
    <PageLayout>
      <PageHeader
        iconNode={<SchoolIcon />}
        title="선배님 정보"
        subtitle="다양한 분야에서 활약 중인 로타랙트 선배님들을 만나보세요."
      />

      <div className="relative mb-8">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
          search
        </span>
        <input
          type="text"
          placeholder="이름, 학과, 소속으로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest rounded-2xl text-sm text-on-surface placeholder:text-on-surface-variant outline-none focus:ring-2 focus:ring-primary-container/30 shadow-card"
        />
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface-container-lowest rounded-2xl p-6 shadow-card h-56 animate-pulse"
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-20 text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl mb-4 block">error</span>
          <p>정보를 불러오지 못했습니다.</p>
        </div>
      )}

      {!isLoading && !isError && (
        data?.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-4 block">group_off</span>
            <p>아직 공개된 선배 정보가 없습니다.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-4 block">search_off</span>
            <p>검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((person) => (
              <AlumniCard
                key={person.id}
                person={person}
                onMessage={user ? setComposeTarget : undefined}
              />
            ))}
          </div>
        )
      )}

      {composeTarget && user && (
        <ComposeModal
          senderId={user.id}
          initialRecipient={composeTarget}
          onClose={() => setComposeTarget(null)}
        />
      )}
    </PageLayout>
  );
}
