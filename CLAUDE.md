# Rota - 연세 로타랙트 커뮤니티 웹사이트

## 프로젝트 개요
연세대학교 중앙봉사동아리 **로타랙트(Rotaract)**의 커뮤니티 웹사이트.
현역 회원과 졸업생(선배)이 함께 소통할 수 있는 플랫폼.

## 대상 사용자
- 20대 초반~후반 대학생 (현역 회원)
- 졸업생 (선배)
- **젊은층부터 나이 많은 층까지 쉽게 사용할 수 있는 UI/UX** 필수

## 주요 페이지 구상
- **소식 페이지**: 동아리 소식(글, 사진) 게시
- **선배 정보 게시판**: 졸업생 프로필/정보 열람
- **공지 게시판**: 공지사항 관리
- **자유 게시판**: 자유로운 소통 공간
- **사진첩**: 활동 사진 갤러리

## 기술 스택
- **Frontend**: Vite + React + TypeScript + Tailwind CSS v4
- **디렉토리**: `frontend/`

## 코드 컨벤션
→ **`docs/CONVENTIONS.md`** 참고
- 폴더 구조, 파일 네이밍, 라우트 패턴, 컴포넌트 작성 규칙 등이 정의되어 있다.

## 디자인 시스템
- 참고 파일: `frontend/design/` 폴더 내 HTML 프로토타입 및 `design_system.md`
- **Primary 색상**: #003876 (네이비 블루) - 로타랙트 브랜드 컬러
- **폰트**: Plus Jakarta Sans (헤드라인), Manrope (본문)
- **아이콘**: Material Symbols Outlined
- **디자인 철학**: "The Digital Campus Square" - 편집 디자인급 커뮤니티 경험, tonal layering 기반
- **로고**: `frontend/public/logo.png` (Rotaract Club 공식 로고)

## 프로젝트 구조
```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/    # Navbar, Footer, MobileNav
│   │   └── home/      # HeroSection, LeftSidebar, MainFeed, RightSidebar
│   ├── pages/         # HomePage
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css      # Tailwind v4 @theme 설정
├── public/
│   └── logo.png
└── design/            # 디자인 참고 HTML 파일들
```
