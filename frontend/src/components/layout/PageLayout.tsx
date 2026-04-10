import type { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <main className={`w-full md:w-7xl mx-auto px-4 md:px-8 pt-12 pb-24 md:pb-12 ${className}`}>
      {children}
    </main>
  );
}
