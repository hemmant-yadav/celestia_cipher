import React, { useEffect, useState } from 'react';
import { Languages, CheckCircle2, RefreshCw, Sparkles, User as UserIcon } from 'lucide-react';
import { SosControl } from '../components/SosControl';
import { arduinoSerial, type ArduinoStatus } from '../services/arduinoSerial';
import { voiceSos } from '../services/voiceSos';
import { useTranslation } from '../services/i18n';
import { useAuth } from '../context/AuthContext';

interface HomeScreenProps {
  onTriggerSos: () => void;
  onOpenSettings?: () => void;
  onOpenChatbot: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onTriggerSos,
  onOpenSettings,
  onOpenChatbot,
}) => {
  const { user } = useAuth();
  const { t, language, languages, openLanguageModal } = useTranslation();
  const [serialStatus, setSerialStatus] = useState<ArduinoStatus>(arduinoSerial.getStatus());

  useEffect(() => {
    // Subscribe to real-time serial status updates
    const unsubscribeSerial = arduinoSerial.subscribe((status) => {
      setSerialStatus(status);
    });

    // Voice SOS is always on by default on Home screen (no button needed)
    voiceSos.startListening().catch(() => {});

    // Try auto-connecting to previously paired port if available
    arduinoSerial.connect(false).catch(() => {});

    return () => {
      unsubscribeSerial();
    };
  }, []);

  const handleConnectClick = () => {
    arduinoSerial.connect(true);
  };

  const handleMarkReady = () => {
    arduinoSerial.markAsReady();
  };

  const isButtonDisabled = !serialStatus.isReady || serialStatus.isSosActive;

  const getDisabledReason = () => {
    if (serialStatus.state === 'connecting') return 'BOOTING';
    if (serialStatus.state === 'active') return 'ACTIVE';
    if (serialStatus.state === 'error') return 'ERROR';
    if (serialStatus.state === 'disconnected') return 'CONNECT';
    return undefined;
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
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

      {/* Top Header: Device Port Indicator & Profile Entry Point */}
      <header
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingBottom: '8px',
        }}
      >
        {/* Multilingual Translation Switcher Icon Button (Same circular style as Profile button) */}
        <button
          onClick={openLanguageModal}
          title={`Language: ${languages.find((l) => l.code === language)?.nativeName} (Tap to change)`}
          aria-label="Change Application Language"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: '0 2px 12px rgba(185, 111, 128, 0.1)',
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
          <Languages size={18} strokeWidth={1.8} color="var(--color-text)" />
        </button>

        {/* Right Header Actions: Aura AI + Google Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Aura Safety Assistant Button */}
          <button
            onClick={onOpenChatbot}
            title="Aura Safety Assistant"
            aria-label="Open Aura Safety Assistant"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.65)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              boxShadow: '0 2px 12px rgba(185, 111, 128, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-rose-deep)',
              cursor: 'pointer',
              transition: 'transform var(--motion-fast)',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.94)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Sparkles size={18} strokeWidth={1.8} color="var(--color-rose-deep)" />
          </button>

          {/* Profile / Google Auth Button */}
          <button
            onClick={onOpenSettings}
            title={user ? `Signed in as ${user.displayName || user.email}` : "Sign in with Google"}
            aria-label="Safety Profile and Account"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: user ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: user ? '1.5px solid var(--color-rose-deep)' : '1px solid rgba(255, 255, 255, 0.6)',
              boxShadow: '0 2px 12px rgba(185, 111, 128, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text)',
              cursor: 'pointer',
              overflow: 'hidden',
              padding: 0,
              transition: 'transform var(--motion-fast)',
              position: 'relative',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.94)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Profile'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : user ? (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'var(--color-rose-deep)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                {(user.displayName || user.email || 'U')[0].toUpperCase()}
              </div>
            ) : (
              <UserIcon size={18} strokeWidth={1.8} color="var(--color-text)" />
            )}
          </button>
        </div>
      </header>

      {/* Central Visual Centerpiece: Distinctive Sculptural SOS Control */}
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: '16px',
        }}
      >
        <SosControl
          onActivate={onTriggerSos}
          disabled={isButtonDisabled}
          disabledReason={getDisabledReason()}
          onDisabledClick={handleConnectClick}
        />

        {/* Live Hardware Status Display */}
        <div
          style={{
            marginTop: '22px',
            maxWidth: '300px',
            textAlign: 'center',
            padding: '10px 16px',
            borderRadius: '16px',
            backgroundColor:
              serialStatus.state === 'error'
                ? 'rgba(253, 240, 241, 0.75)'
                : 'rgba(255, 255, 255, 0.5)',
            border:
              serialStatus.state === 'error'
                ? '1px solid rgba(243, 207, 210, 0.8)'
                : '1px solid rgba(255, 255, 255, 0.55)',
            boxShadow: '0 4px 16px rgba(185, 111, 128, 0.08)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            transition: 'all 200ms ease',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '11.5px',
              fontWeight: 600,
              color:
                serialStatus.state === 'error'
                  ? 'var(--color-error)'
                  : serialStatus.state === 'ready'
                  ? 'var(--color-text)'
                  : 'var(--color-text-muted)',
              lineHeight: 1.4,
            }}
          >
            {serialStatus.state === 'ready' ? t('home.systemReady') : serialStatus.displayMessage}
          </p>

          {/* Reconnect & Bypass options on error */}
          {serialStatus.state === 'error' && (
            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <button
                onClick={handleConnectClick}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--color-error)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={11} />
                <span>Retry</span>
              </button>

              <button
                onClick={handleMarkReady}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--color-success)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                <CheckCircle2 size={11} />
                <span>Mark Ready</span>
              </button>
            </div>
          )}

          {/* Helper cue when connecting */}
          {serialStatus.state === 'connecting' && (
            <p
              onClick={handleMarkReady}
              style={{
                marginTop: '6px',
                fontSize: '10px',
                color: 'var(--color-rose-deep)',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Already powered on? Click to mark ready
            </p>
          )}

          {/* Helper cue when disconnected */}
          {serialStatus.state === 'disconnected' && (
            <p
              onClick={handleConnectClick}
              style={{
                marginTop: '4px',
                fontSize: '10.5px',
                color: 'var(--color-rose-deep)',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Click to select Arduino port
            </p>
          )}
        </div>
      </main>

      {/* Space reserved for BottomNav */}
      <div style={{ height: '62px', pointerEvents: 'none' }} />
    </div>
  );
};
