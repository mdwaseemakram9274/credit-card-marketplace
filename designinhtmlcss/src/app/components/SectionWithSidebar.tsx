import { StickySidebar } from './StickySidebar';
import { ReactNode } from 'react';

interface SectionWithSidebarProps {
  children: ReactNode;
}

export function SectionWithSidebar({ children }: SectionWithSidebarProps) {
  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Main Content - 8 columns */}
      <div className="lg:col-span-8">
        {children}
      </div>

      {/* Sticky Sidebar - 4 columns */}
      <div className="lg:col-span-4 mt-8 lg:mt-0">
        <StickySidebar />
      </div>
    </div>
  );
}
