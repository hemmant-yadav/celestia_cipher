import React from 'react';
import { Home, MapPin, ShieldCheck, Radio } from 'lucide-react';
import type { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

interface NavItemConfig {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string; style?: React.CSSProperties }>;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'map', label: 'Map', icon: MapPin },
  { id: 'safety', label: 'My Safety', icon: ShieldCheck },
  { id: 'devices', label: 'Devices', icon: Radio },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav
      aria-label="Application navigation"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        paddingTop: '10px',
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
        paddingLeft: '16px',
        paddingRight: '16px',
        zIndex: 40,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: '0 -4px 16px rgba(185, 111, 128, 0.06)',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        const IconComponent = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            role="tab"
            aria-selected={isActive}
            aria-label={item.label}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '6px 0',
              cursor: 'pointer',
              color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
              transition: 'color var(--motion-fast), transform var(--motion-fast)',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconComponent
                size={22}
                strokeWidth={isActive ? 2.1 : 1.6}
                color={isActive ? 'var(--color-rose-deep)' : 'var(--color-text-muted)'}
              />
            </div>

            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '11px',
                fontWeight: isActive ? 600 : 500,
                letterSpacing: '0.01em',
                lineHeight: 1.1,
                color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
              }}
            >
              {item.label}
            </span>

            {/* Subtle active state indicator dot */}
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-rose-deep)',
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};
