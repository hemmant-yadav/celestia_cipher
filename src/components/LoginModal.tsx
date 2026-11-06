import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { GoogleLogo } from './GoogleLogo';
import { useAuth } from '../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { user, signInWithGoogle, signOut } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Failed to sign in with Google');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setIsSubmitting(true);
    try {
      await signOut();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 95,
        backgroundColor: 'rgba(40, 35, 38, 0.55)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        animation: 'fadeIn 200ms ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          paddingTop: '20px',
          paddingBottom: 'calc(28px + env(safe-area-inset-bottom, 0px))',
          paddingLeft: '24px',
          paddingRight: '24px',
          maxHeight: '85%',
          overflowY: 'auto',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Handle / Close */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(200, 63, 75, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={18} color="var(--color-rose-deep)" />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-rose-deep)' }}>
              Aura Safety ID
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-surface-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text)',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {user ? (
          /* User is already logged in */
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px',
                backgroundColor: 'var(--color-surface-soft)',
                borderRadius: '16px',
                border: '1px solid var(--color-border)',
                marginBottom: '18px',
              }}
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' }}
                />
              ) : (
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-rose-deep)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '18px',
                  }}
                >
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.displayName || 'Google User'}
                  </h3>
                  <CheckCircle2 size={14} color="var(--color-success)" />
                </div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '2px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </p>
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '6px',
                    fontSize: '10px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    backgroundColor: '#E8F3EE',
                    color: 'var(--color-success)',
                  }}
                >
                  Google Account Linked
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={onClose}
                style={{
                  width: '100%',
                  height: '46px',
                  backgroundColor: 'var(--color-text)',
                  color: '#FFFFFF',
                  borderRadius: '14px',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Continue
              </button>
              <button
                onClick={handleSignOut}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  height: '44px',
                  backgroundColor: 'transparent',
                  color: 'var(--color-error)',
                  borderRadius: '14px',
                  fontWeight: 600,
                  fontSize: '13px',
                  border: '1px solid rgba(200, 63, 75, 0.25)',
                  cursor: 'pointer',
                }}
              >
                {isSubmitting ? 'Signing out...' : 'Sign Out of Google'}
              </button>
            </div>
          </div>
        ) : (
          /* User is NOT logged in */
          <div>
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '6px' }}>
                Sign in with Google
              </h2>
              <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', lineHeight: 1.45, maxWidth: '300px', margin: '0 auto' }}>
                Link your Google account to back up trusted contacts, sync safety alerts, and enable seamless multi-device protection.
              </p>
            </div>

            {/* Feature Perks */}
            <div
              style={{
                backgroundColor: 'var(--color-surface-soft)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: '14px 16px',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
                <CheckCircle2 size={16} color="var(--color-success)" style={{ flexShrink: 0 }} />
                <span>Instant Cloud Sync across Phone & Laptop</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
                <CheckCircle2 size={16} color="var(--color-success)" style={{ flexShrink: 0 }} />
                <span>Verified SOS Medical Card & Contacts</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
                <Lock size={16} color="var(--color-rose-deep)" style={{ flexShrink: 0 }} />
                <span>End-to-End Encrypted Ambient Audio Proofs</span>
              </div>
            </div>

            {errorMessage && (
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#FDF0F1',
                  border: '1px solid #F3CFD2',
                  borderRadius: '12px',
                  color: 'var(--color-error)',
                  fontSize: '12px',
                  marginBottom: '16px',
                  textAlign: 'center',
                }}
              >
                {errorMessage}
              </div>
            )}

            {/* Official Google Sign-in Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              style={{
                width: '100%',
                height: '52px',
                backgroundColor: '#FFFFFF',
                color: '#3c4043',
                border: '1.5px solid #dadce0',
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                transition: 'all 150ms ease',
                marginBottom: '12px',
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <GoogleLogo size={20} />
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* Emergency Guest Access */}
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--color-text-muted)',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              <span>Continue as Guest (Emergency SOS available)</span>
              <ArrowRight size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

