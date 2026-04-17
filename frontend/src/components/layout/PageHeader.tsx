import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  iconNode?: ReactNode;
  badge?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export default function PageHeader({ title, subtitle, iconNode, badge, className = "", children }: PageHeaderProps) {
  return (
    <header className={`mb-8 flex items-start justify-between flex-wrap gap-4 ${className}`}>
      <div>
        <div className="flex items-center gap-3 mb-1">
          {iconNode && (
            <span className="[&>svg]:w-8 [&>svg]:h-8 text-primary-container">
              {iconNode}
            </span>
          )}
          <h1 className="text-4xl font-extrabold text-on-surface tracking-tight font-headline">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && <p className="text-on-surface-variant">{subtitle}</p>}
      </div>
      {children}
    </header>
  );
}
