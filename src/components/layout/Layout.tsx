'use client';

import React from 'react';
import { Header } from './Header';
import { TabNavigation } from './TabNavigation';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  headerActions?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Fitness Tracker',
  showBackButton = false,
  onBackClick,
  headerActions,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header
        title={title}
        showBackButton={showBackButton}
        onBackClick={onBackClick}
        actions={headerActions}
      />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-screen-sm mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <TabNavigation />
    </div>
  );
}; 