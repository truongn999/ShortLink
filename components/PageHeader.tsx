import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, children }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">{title}</h1>
        {description && (
          <p className="text-base text-neutral-600 dark:text-neutral-400 mt-1">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;