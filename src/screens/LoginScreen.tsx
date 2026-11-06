import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Loader2, CheckCircle2, Lock } from 'lucide-react';
import { GoogleLogo } from '../components/GoogleLogo';
import { useAuth } from '../context/AuthContext';

interface LoginScreenProps {
  onContinueAsGuest: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onContinueAsGuest }) => {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'auth/unauthorized-domain') {
        setError('This IP domain is not in Firebase Authorized Domains. Use http://localhost:5173 or add your IP to Firebase Console.');
      } else if (err?.code !== 'auth/popup-closed-by-user') {
        setError(err?.message || 'Google Sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 'calc(40px + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(32px + env(safe-area-inset-bottom, 0px))',
        paddingLeft: '24px',
        paddingRight: '24px',
        overflowY: 'auto',
      }}
    >
      {/* Top Branding */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            margin: '0 auto 18px',
            borderRadius: '24px',
            backgroundColor: '#FCEFF0',
            border: '2px solid #F3CFD2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(200, 63, 75, 0.15)',
          }}
        >
          <ShieldCheck size={38} color="var(--color-rose-deep)" strokeWidth={2.2} />
        </div>

        <h1
          style={{
            fontSize: '28px',
            fontWeight: 900,
            letterSpacing: '0.04em',
            color: 'var(--color-text)',
            marginBottom: '8px',
          }}
        >
          AURA
        </h1>
        <p
          style={{
            fontSize: '13.5px',
            color: 'var(--color-text-muted)',
            lineHeight: 1.5,
            maxWidth: '300px',
            margin: '0 auto',
          }}
        >
          Personal safety network with hardware SOS, voice detection & multi-device sync
        </p>
      </div>

      {/* Feature highlights */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-soft)',
          border: '1px solid var(--color-border)',
          borderRadius: '20px',
          padding: '18px 20px',
          margin: '24px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
          <CheckCircle2 size={18} color="var(--color-success)" style={{ flexShrink: 0 }} />
          <span><strong>One-Tap Google Sign-In</strong> across devices</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
          <CheckCircle2 size={18} color="var(--color-success)" style={{ flexShrink: 0 }} />
          <span><strong>Hardware SIM800L</strong> automatic emergency dial</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
          <Lock size={18} color="var(--color-rose-deep)" style={{ flexShrink: 0 }} />
          <span><strong>Emergency Cloud Profile</strong> & medical card sync</span>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: '#FDF0F1',
            border: '1px solid #F3CFD2',
            borderRadius: '12px',
            color: 'var(--color-error)',
            fontSize: '12px',
            marginBottom: '16px',
            lineHeight: 1.4,
            textAlign: 'center',
          }}
        >
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Main Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            height: '56px',
            backgroundColor: '#FFFFFF',
            color: '#3c4043',
            border: '1.5px solid #dadce0',
            borderRadius: '16px',
            fontWeight: 700,
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
            transition: 'transform 0.1s, box-shadow 0.15s',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {loading ? (
            <>
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Signing in with Google...</span>
            </>
          ) : (
            <>
              <GoogleLogo size={22} />
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Emergency Bypass / Continue as Guest */}
        <button
          onClick={onContinueAsGuest}
          style={{
            width: '100%',
            height: '46px',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--color-text-muted)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <span>Continue as Guest (Emergency Access)</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

