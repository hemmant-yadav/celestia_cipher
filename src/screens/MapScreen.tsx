import React, { useState } from 'react';
import { Share2, Hospital, Building2, ShieldCheck } from 'lucide-react';

export const MapScreen: React.FC = () => {
  const [sharingActive, setSharingActive] = useState(true);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#F8E9E9',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        color: 'var(--color-text)',
      }}
    >
      {/* Top Map Header */}
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))',
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingBottom: '14px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            Safety Map
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '11px',
              color: 'var(--color-text-muted)',
              marginTop: '2px',
            }}
          >
            Live location & verified safe havens
          </p>
        </div>

        <button
          onClick={() => setSharingActive(!sharingActive)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: sharingActive ? 'var(--color-surface-soft)' : '#FFFFFF',
            border: '1px solid var(--color-border)',
            fontSize: '11.5px',
            fontWeight: 600,
            color: sharingActive ? 'var(--color-rose-deep)' : 'var(--color-text-muted)',
          }}
        >
          <Share2 size={13} />
          <span>{sharingActive ? 'Sharing On' : 'Sharing Off'}</span>
        </button>
      </header>

      {/* Styled Vector Map Canvas Mock */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          backgroundColor: '#F7EDEE',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Subtle Map Grid lines */}
        <svg
          width="100%"
          height="100%"
          style={{ position: 'absolute', inset: 0, opacity: 0.28 }}
        >
          <defs>
            <pattern id="mapGrid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#D98D9D" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapGrid)" />
          {/* Safe Route Path */}
          <path
            d="M 60 700 Q 180 520 195 420 T 310 260"
            fill="none"
            stroke="var(--color-rose-deep)"
            strokeWidth="4"
            strokeDasharray="6 4"
          />
        </svg>

        {/* Current User Location Beacon */}
        <div
          style={{
            position: 'absolute',
            top: '48%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '2px solid var(--color-rose-deep)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(185, 111, 128, 0.3)',
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-rose-deep)',
              }}
            />
          </div>
          <span
            style={{
              marginTop: '4px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 700,
              boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
            }}
          >
            You are here
          </span>
        </div>

        {/* Safe Point 1: Police Station */}
        <div
          style={{
            position: 'absolute',
            top: '28%',
            right: '18%',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-full)',
            padding: '5px 10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.06)',
          }}
        >
          <Building2 size={13} color="var(--color-rose-deep)" />
          <span style={{ fontSize: '11px', fontWeight: 600 }}>Central Precinct (0.4 mi)</span>
        </div>

        {/* Safe Point 2: Hospital */}
        <div
          style={{
            position: 'absolute',
            bottom: '32%',
            left: '12%',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-full)',
            padding: '5px 10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.06)',
          }}
        >
          <Hospital size={13} color="var(--color-success)" />
          <span style={{ fontSize: '11px', fontWeight: 600 }}>City Emergency (0.8 mi)</span>
        </div>
      </div>

      {/* Floating Quiet Route Control Sheet */}
      <div
        style={{
          position: 'absolute',
          bottom: '82px',
          left: '16px',
          right: '16px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          padding: '14px 16px',
          boxShadow: '0 6px 18px rgba(185, 111, 128, 0.12)',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="var(--color-rose-deep)" />
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Safe Route Active</span>
            </div>
            <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Well-lit path via Montgomery St • 14 min walk
            </p>
          </div>
          <button
            style={{
              backgroundColor: 'var(--color-surface-soft)',
              border: '1px solid var(--color-border)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '11.5px',
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            End Navigation
          </button>
        </div>
      </div>

      <div style={{ height: '78px', pointerEvents: 'none' }} />
    </div>
  );
};
