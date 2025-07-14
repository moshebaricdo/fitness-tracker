'use client';

import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackClick,
  actions,
}) => {
  return (
    <header className="pwa-header">
      <div className="max-w-screen-sm mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Back Button or Spacer */}
          <div className="flex items-center">
            {showBackButton && (
              <button
                onClick={onBackClick}
                className="touch-target flex items-center justify-center -ml-2 mr-2 p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
          </div>
          
          {/* Center - Title */}
          <h1 className="text-lg font-semibold text-gray-900 text-center flex-1">
            {title}
          </h1>
          
          {/* Right Side - Actions */}
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        </div>
      </div>
    </header>
  );
}; 