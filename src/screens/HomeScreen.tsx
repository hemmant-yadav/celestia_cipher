import React from 'react';
import { User } from 'lucide-react';
import { SosControl } from '../components/SosControl';

interface HomeScreenProps {
  onTriggerSos: () => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onTriggerSos,
  onOpenSettings,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundImage: 'url(/assets/safety-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 42%',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
      }}
    >
      {/* Subtle protective veil for text/contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(248, 233, 233, 0.05)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header: Minimal Profile/Settings Entry Point */}
      <header
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingBottom: '8px',
        }}
      >
        <button
          onClick={onOpenSettings}
          aria-label="Profile and safety settings"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            boxShadow: '0 2px 8px rgba(185, 111, 128, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text)',
            cursor: 'pointer',
            transition: 'transform var(--motion-fast)',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.94)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <User size={18} strokeWidth={1.8} color="var(--color-text)" />
        </button>
      </header>

      {/* Central Visual Centerpiece: Distinctive Sculptural SOS Control */}
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: '20px',
        }}
      >
        <SosControl onActivate={onTriggerSos} />
      </main>

      {/* Space reserved for BottomNav */}
      <div style={{ height: '62px', pointerEvents: 'none' }} />
    </div>
  );
};
