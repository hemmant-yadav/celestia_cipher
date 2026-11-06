import React from 'react';
import { Home, MapPin, ShieldCheck, Radio } from 'lucide-react';
import type { TabType } from '../types';
import { useTranslation } from '../services/i18n';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation();

  const navItems = [
    { id: 'home' as TabType, label: t('nav.home'), icon: Home },
    { id: 'map' as TabType, label: t('nav.map'), icon: MapPin },
    { id: 'safety' as TabType, label: t('nav.safety'), icon: ShieldCheck },
    { id: 'devices' as TabType, label: t('nav.devices'), icon: Radio },
  ];

  return (
    <nav
      aria-label="Application navigation"
      className="bottom-nav-glass"
    >
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const IconComponent = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            role="tab"
            aria-selected={isActive}
            aria-label={item.label}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="bottom-nav-icon-capsule">
              <IconComponent
                size={20}
                strokeWidth={isActive ? 2.2 : 1.8}
                style={{
                  filter: isActive ? 'drop-shadow(0 2px 4px rgba(185, 111, 128, 0.35))' : undefined,
                  transition: 'all 160ms ease',
                }}
              />
            </div>

            <span className="bottom-nav-label">
              {item.label}
            </span>

            {/* Subtle active state glowing indicator dot */}
            {isActive && <span className="bottom-nav-active-dot" />}
          </button>
        );
      })}
    </nav>
  );
};
