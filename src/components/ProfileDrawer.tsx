import React, { useState, useEffect } from 'react';
import { X, HeartPulse, Lock, LogOut, CheckCircle2, Phone, Plus, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleLogo } from './GoogleLogo';
import { contactSettings } from '../services/contactSettings';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ isOpen, onClose }) => {
  const { user, signInWithGoogle, signOut } = useAuth();
  const [isBusy, setIsBusy] = useState(false);

  // Emergency contact phone inputs
  const [primaryPhone, setPrimaryPhone] = useState(() => contactSettings.getContacts().primaryPhone);
  const [secondaryPhone, setSecondaryPhone] = useState(() => contactSettings.getContacts().secondaryPhone);
  const [showSecondaryInput, setShowSecondaryInput] = useState(() => Boolean(contactSettings.getContacts().secondaryPhone));
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const unsub = contactSettings.subscribe((c) => {
      setPrimaryPhone(c.primaryPhone);
      setSecondaryPhone(c.secondaryPhone);
      if (c.secondaryPhone) setShowSecondaryInput(true);
    });
    return () => unsub();
  }, []);

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    contactSettings.setPrimaryPhone(primaryPhone);
    contactSettings.setSecondaryPhone(showSecondaryInput ? secondaryPhone : '');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsBusy(true);
    try {
      await signInWithGoogle();
    } finally {
      setIsBusy(false);
    }
  };

  const handleSignOut = async () => {
    setIsBusy(true);
    try {
      localStorage.removeItem('aura_guest');
      await signOut();
      onClose();
    } finally {
      setIsBusy(false);
    }
  };

  // Derive initials and display name
  const displayName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'Guest User');
  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : (user?.email ? user.email.slice(0, 2).toUpperCase() : 'GU');

  const emergencyId = user?.uid ? `#AR-${user.uid.slice(0, 5).toUpperCase()}` : '#AR-8402';

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
          maxHeight: '85%',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayName}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid var(--color-border)',
                }}
              />
            ) : (
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-soft)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: 'var(--color-rose-deep)',
                }}
              >
                {initials}
              </div>
            )}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <h2 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>{displayName}</h2>
                {user && <CheckCircle2 size={13} color="var(--color-success)" />}
              </div>
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: '1px 0 0 0' }}>
                {user?.email ? user.email : `Emergency ID: ${emergencyId}`}
              </p>
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
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Google Account Authentication Banner */}
        {!user ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E5E7EB',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              marginBottom: '14px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <GoogleLogo size={22} />
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
                  Sign in with Google
                </p>
                <p style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', margin: 0 }}>
                  Sync contacts & profile across devices
                </p>
              </div>
            </div>
            <button
              onClick={handleSignIn}
              disabled={isBusy}
              style={{
                padding: '6px 12px',
                backgroundColor: 'var(--color-text)',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                border: 'none',
                cursor: isBusy ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {isBusy ? 'Connecting...' : 'Sign In'}
            </button>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#E8F3EE',
              border: '1px solid #C5E0D2',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GoogleLogo size={16} />
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-success)' }}>
                Google Cloud Synced
              </span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
              {emergencyId}
            </span>
          </div>
        )}

        {/* Emergency SMS Contact Numbers (Arduino SIM800L Dispatches Here) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            marginBottom: '14px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={16} color="var(--color-rose-deep)" />
              <span style={{ fontSize: '12.5px', fontWeight: 700 }}>Emergency SMS Recipients</span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 600 }}>SIM800L Alert</span>
          </div>

          <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '10px', lineHeight: 1.35 }}>
            Arduino automatically sends your live GPS & Google Maps link to these numbers during SOS.
          </p>

          <form onSubmit={handleSavePhone} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Primary Recipient Number
              </label>
              <input
                type="tel"
                value={primaryPhone}
                onChange={(e) => setPrimaryPhone(e.target.value)}
                placeholder="+918197149231"
                required
                style={{
                  width: '100%',
                  height: '38px',
                  padding: '0 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface-soft)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {showSecondaryInput ? (
              <div>
                <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                  Secondary Recipient Number (Delivered too)
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="tel"
                    value={secondaryPhone}
                    onChange={(e) => setSecondaryPhone(e.target.value)}
                    placeholder="+919876543210"
                    style={{
                      flex: 1,
                      height: '38px',
                      padding: '0 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface-soft)',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSecondaryPhone('');
                      setShowSecondaryInput(false);
                      contactSettings.setSecondaryPhone('');
                    }}
                    style={{
                      height: '38px',
                      padding: '0 10px',
                      borderRadius: '8px',
                      border: '1px solid #EDD8DC',
                      backgroundColor: 'transparent',
                      color: 'var(--color-error)',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowSecondaryInput(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  alignSelf: 'flex-start',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--color-rose-deep)',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '4px 0',
                }}
              >
                <Plus size={13} />
                <span>Add another number (deliver SMS to that number too)</span>
              </button>
            )}

            <button
              type="submit"
              style={{
                marginTop: '4px',
                height: '36px',
                backgroundColor: saveSuccess ? 'var(--color-success)' : 'var(--color-rose-deep)',
                color: '#FFFFFF',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'background-color 0.2s',
              }}
            >
              {saveSuccess ? (
                <>
                  <Check size={14} />
                  <span>Numbers Saved & Synced</span>
                </>
              ) : (
                <span>Save Number(s)</span>
              )}
            </button>
          </form>
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
              <strong>Emergency Contact ({primaryPhone || '+91 8197149231'})</strong>
            </div>
            {secondaryPhone && (
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Secondary Contact: </span>
                <strong>{secondaryPhone}</strong>
              </div>
            )}
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
          <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: 0 }}>
            {user ? 'Secured by Google OAuth & 4-digit SOS deactivation PIN.' : 'SOS deactivation PIN is verified and active.'}
          </p>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {user && (
            <button
              onClick={handleSignOut}
              disabled={isBusy}
              style={{
                width: '100%',
                height: '42px',
                backgroundColor: 'transparent',
                color: 'var(--color-error)',
                border: '1px solid rgba(200, 63, 75, 0.25)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '12.5px',
                cursor: isBusy ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <LogOut size={14} />
              <span>Sign Out ({user.email?.split('@')[0]})</span>
            </button>
          )}

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
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
