import React from 'react';
import { X, HeartPulse, Lock } from 'lucide-react';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        backgroundColor: 'rgba(40, 35, 38, 0.45)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        animation: 'fadeIn 180ms ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 'var(--radius-lg)',
          borderTopRightRadius: 'var(--radius-lg)',
          paddingTop: '20px',
          paddingBottom: '32px',
          paddingLeft: '22px',
          paddingRight: '22px',
          maxHeight: '80%',
          overflowY: 'auto',
          boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Pull Bar & Close */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-surface-soft)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '13px',
                color: 'var(--color-rose-deep)',
              }}
            >
              HL
            </div>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 700 }}>Harshith L.</h2>
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Emergency ID: #AR-8402</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close settings"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-surface-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text)',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Medical / Identity Info */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-soft)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            marginBottom: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <HeartPulse size={16} color="var(--color-sos)" />
            <span style={{ fontSize: '12px', fontWeight: 700 }}>Emergency Medical Card</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11.5px' }}>
            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>Blood Type: </span>
              <strong>O Positive</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>Allergies: </span>
              <strong>Penicillin</strong>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Primary Contact: </span>
              <strong>Maya Lin (+1 555-392-1048)</strong>
            </div>
          </div>
        </div>

        {/* Security / PIN */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-soft)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Lock size={16} color="var(--color-rose-deep)" />
            <span style={{ fontSize: '12px', fontWeight: 700 }}>App Protection</span>
          </div>
          <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
            SOS deactivation PIN is verified and active.
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            height: '44px',
            backgroundColor: 'var(--color-text)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: '13px',
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};
