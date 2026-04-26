# 코드 컨벤션

## 폴더 구조

### pages/
페이지는 **섹션별로 그룹 폴더**로 묶어 관리한다.

```
pages/
├── admin/          # 관리자 페이지
│   ├── Dashboard/
│   ├── Pending/
│   ├── Members/
│   └── shared.ts   # 섹션 공통 유틸/타입
├── auth/           # 인증·가입 상태 페이지
├── board/          # 게시판 페이지
├── AlumniPage/
├── GalleryPage/
└── ...
```

- 각 페이지는 **폴더/index.tsx** 구조를 사용한다 (단일 `.tsx` 파일 금지).
- 해당 페이지에서만 쓰이는 컴포넌트는 페이지 폴더 내 `components/` 하위에 둔다.

```
Dashboard/
├── index.tsx
└── components/
    └── StatCard.tsx
```

- 같은 섹션 내 여러 페이지가 공유하는 유틸·타입은 섹션 루트의 `shared.ts`에 둔다.

### components/
전역 공유 컴포넌트는 `src/components/` 하위에 도메인별로 폴더를 만든다.

```
components/
├── layout/   # Navbar, Footer, AdminLayout 등 레이아웃
└── home/     # 홈 전용 섹션 컴포넌트
```

### api/
```
api/
├── hooks/              # React Query 훅 - 도메인별 폴더로 구분
│   ├── auth/           # useLogin, useSignup, useEmailCheck
│   ├── posts/          # usePosts, usePost, useCreatePost, ...
│   ├── comments/       # useComments, useCreateComment, ...
│   ├── profiles/       # useMyProfile, useMembers, useAlumni, ...
│   └── messages/       # useMessages
├── types/              # API 응답 타입 정의
├── auth.ts
├── posts.ts
├── comments.ts
├── profiles.ts
└── messages.ts
```

---

## 파일 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| 페이지 폴더 | PascalCase | `BoardPage/`, `AdminDashboard/` |
| 컴포넌트 파일 | PascalCase | `StatCard.tsx`, `SortHeaderButton.tsx` |
| 훅 파일 | camelCase, `use` 접두사 | `useMembers.ts` |
| 유틸·타입 파일 | camelCase | `shared.ts` |
| 라우트·경로 파일 | camelCase | `paths.ts` |

---

## 라우트 (routes/)

- `paths.ts`의 `PATHS` 객체는 **섹션별 주석**으로 구분한다 (메인 / 게시판 / 인증 / 관리자).
- `index.tsx`의 import와 route 배열도 같은 섹션 주석으로 구분한다.
- 라우트 문자열은 직접 쓰지 않고 항상 `PATHS` 상수를 참조한다.

---

## 컴포넌트 패턴

### 기본 구조
```tsx
interface Props { ... }

export default function ComponentName({ prop1, prop2 }: Props) {
  // ...
}
```

- `export default`는 파일 하단이 아닌 **함수 선언과 함께** 작성한다.
- 핸들러 함수는 **`function` 선언** 방식을 사용한다 (화살표 함수 지양).

```tsx
// ✅
function handleSubmit() { ... }

// ❌
const handleSubmit = () => { ... }
```

### 확인 모달 패턴
관리자 페이지에서 뮤테이션 실행 전 확인이 필요한 경우 아래 패턴을 따른다.

```tsx
type ConfirmAction = { type: "approve" | "reject"; id: string; name: string } | null;

const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

function handleConfirm() {
  if (!confirmAction) return;
  mutation.mutate(confirmAction.id, { onSettled: () => setConfirmAction(null) });
}
```

컴포넌트의 루트를 `<>` Fragment로 감싸 모달을 형제 노드로 배치한다.

---

## 데이터 페칭

- 서버 상태는 **React Query**로 관리한다.
- 훅은 `api/hooks/` 폴더에 `useXxx.ts`로 분리한다.
- `use client` 지시어는 사용하지 않는다 (Vite + React, Next.js 아님).

---

## 스타일링

- **Tailwind CSS v4** 유틸리티 클래스만 사용한다.
- 디자인 토큰(색상·폰트)은 `index.css`의 `@theme` 블록에서 관리한다.
- 아이콘은 `material-symbols-outlined` 클래스를 가진 `<span>`으로 사용한다.

```tsx
<span className="material-symbols-outlined text-xl">search</span>
```
