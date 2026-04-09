import LeftSidebar from "../components/home/LeftSidebar";
import MainFeed from "../components/home/MainFeed";
import RightSidebar from "../components/home/RightSidebar";

export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-24 md:pb-12">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2 font-headline">
          연세 로타랙트 커뮤니티
        </h1>
        <p className="text-on-surface-variant">
          초아의 봉사를 실천하는 연세대학교 중앙봉사동아리. 현역과 졸업생이 함께하는 소통의 공간입니다.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <LeftSidebar />
        <MainFeed />
        <RightSidebar />
      </div>
    </main>
  );
}
