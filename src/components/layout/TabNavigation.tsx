'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Calendar, Apple, Camera, CalendarDays } from 'lucide-react';

const tabs = [
  {
    name: 'Today',
    href: '/',
    icon: Home,
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: CalendarDays,
  },
  {
    name: 'Nutrition',
    href: '/nutrition',
    icon: Apple,
  },
  {
    name: 'Progress',
    href: '/progress',
    icon: Camera,
  },
];

export const TabNavigation: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleTabClick = (href: string) => {
    router.push(href);
  };

  return (
    <nav className="pwa-bottom-nav">
      <div className="max-w-screen-sm mx-auto">
        <div className="flex justify-around">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.name}
                onClick={() => handleTabClick(tab.href)}
                className={`touch-target flex flex-col items-center justify-center py-2 px-3 text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-label={tab.name}
              >
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                <span className={isActive ? 'text-primary-600' : 'text-gray-500'}>
                  {tab.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}; 