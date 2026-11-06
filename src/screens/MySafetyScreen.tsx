import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Activity,
  Bell,
  Timer,
  PhoneCall,
  Lock,
  Disc,
  FileText,
  FolderLock,
  ChevronRight,
  X,
  Plus,
  Check,
  Volume2,
  Languages
} from 'lucide-react';
import {
  voiceSos,
  type VoiceSosState,
  DEFAULT_STANDALONE_KEYWORDS,
  DEFAULT_NATURAL_PHRASES,
} from '../services/voiceSos';
import { useTranslation } from '../services/i18n';
import { contactSettings } from '../services/contactSettings';

export const MySafetyScreen: React.FC = () => {
  const { t, language, languages, openLanguageModal } = useTranslation();
  // Voice SOS Engine State
  const [voiceState, setVoiceState] = useState<VoiceSosState>(voiceSos.getState());
  const [customKeywords, setCustomKeywords] = useState<string[]>(voiceSos.getConfig().customPhrases);
  const [newPhraseInput, setNewPhraseInput] = useState('');
  const [phraseError, setPhraseError] = useState('');

  // Three vertical layout toggles
  const isVoiceListening = voiceState === 'listening';
  const isVoiceError = voiceState === 'permission_denied' || voiceState === 'unsupported' || voiceState === 'error';
  const [voiceBusy, setVoiceBusy] = useState(false);
  const [voiceErrorMsg, setVoiceErrorMsg] = useState('');
  const [shakeEnabled, setShakeEnabled] = useState<boolean>(true);
  const [criticalAlertsEnabled, setCriticalAlertsEnabled] = useState<boolean>(true);

  // Modal sheet state for navigation rows
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Emergency contacts state (live from contactSettings)
  const [primaryPhone, setPrimaryPhone] = useState(() => contactSettings.getContacts().primaryPhone);
  const [secondaryPhone, setSecondaryPhone] = useState(() => contactSettings.getContacts().secondaryPhone);
  const [showSecondaryInput, setShowSecondaryInput] = useState(() => Boolean(contactSettings.getContacts().secondaryPhone));
  const [contactSaveSuccess, setContactSaveSuccess] = useState(false);

  // Fake call state
  const [fakeCallTimer, setFakeCallTimer] = useState<number | null>(null);

  useEffect(() => {
    const unsub = voiceSos.subscribe((state) => {
      setVoiceState(state);
      setCustomKeywords(voiceSos.getConfig().customPhrases);
    });
    return () => unsub();
  }, []);

  // Sync contact changes from other tabs/drawers
  useEffect(() => {
    const unsub = contactSettings.subscribe((c) => {
      setPrimaryPhone(c.primaryPhone);
      setSecondaryPhone(c.secondaryPhone);
      if (c.secondaryPhone) setShowSecondaryInput(true);
    });
    return () => unsub();
  }, []);

  const handleToggleVoice = async () => {
    if (isVoiceListening) {
      voiceSos.disable();
      setVoiceErrorMsg('');
      return;
    }

    // Check if Speech API is available at all
    const hasSpeechAPI = !!(
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    );
    if (!hasSpeechAPI) {
      setVoiceErrorMsg('Voice SOS requires Chrome or Edge browser.');
      return;
    }

    // Check if we're on HTTP (not localhost) — Speech API blocked
    const isInsecure =
      location.protocol === 'http:' &&
      location.hostname !== 'localhost' &&
      location.hostname !== '127.0.0.1';
    if (isInsecure) {
      setVoiceErrorMsg('Voice SOS needs HTTPS or localhost. Use http://localhost:5173 on this PC.');
      return;
    }

    setVoiceBusy(true);
    setVoiceErrorMsg('');
    try {
      const ok = await voiceSos.enable();
      if (!ok) {
        const s = voiceSos.getState();
        if (s === 'permission_denied') {
          setVoiceErrorMsg('Microphone access denied. Allow mic in browser settings and retry.');
        } else {
          setVoiceErrorMsg('Could not start Voice SOS. Try again.');
        }
      }
    } finally {
      setVoiceBusy(false);
    }
  };

  const handleAddPhrase = () => {
    if (!newPhraseInput.trim()) return;
    const added = voiceSos.addCustomPhrase(newPhraseInput);
    if (!added) {
      setPhraseError('Phrase already exists or is too short (min 2 chars)');
    } else {
      setNewPhraseInput('');
      setPhraseError('');
    }
  };

  const handleRemovePhrase = (phrase: string) => {
    voiceSos.removeCustomPhrase(phrase);
  };

  const handleTriggerFakeCall = (seconds: number) => {
    setActiveModal(null);
    setFakeCallTimer(seconds);
    const interval = setInterval(() => {
      setFakeCallTimer((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setActiveModal('incomingFakeCall');
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        color: 'var(--color-text)',
        paddingTop: 'calc(18px + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(96px + env(safe-area-inset-bottom, 0px))',
        paddingLeft: '16px',
        paddingRight: '16px',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Screen Editorial Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px',
          paddingLeft: '4px',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 600,
              lineHeight: 1.15,
              color: 'var(--color-text)',
            }}
          >
            {t('safety.title')}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              color: '#655358',
              marginTop: '3px',
            }}
          >
            {t('safety.subtitle')}
          </p>
        </div>

        {/* Multilingual Switcher Icon */}
        <button
          onClick={openLanguageModal}
          title={`Language: ${languages.find((l) => l.code === language)?.nativeName} (Tap to change)`}
          aria-label="Change Application Language"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(235, 218, 222, 0.8)',
            boxShadow: '0 2px 8px rgba(185, 111, 128, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text)',
            cursor: 'pointer',
            transition: 'transform var(--motion-fast)',
          }}
        >
          <Languages size={16} strokeWidth={1.8} color="var(--color-text)" />
        </button>
      </header>

      {/* ---------------- 1. TRUSTED CONTACTS ---------------- */}
      <section style={{ marginBottom: '16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '7px',
            paddingLeft: '4px',
            paddingRight: '4px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              fontWeight: 700,
              color: '#3B121C',
              letterSpacing: '0.02em',
            }}
          >
            {t('safety.trustedContacts')} (2)
          </span>
          <button
            onClick={() => setActiveModal('contacts')}
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '11.5px',
              fontWeight: 600,
              color: 'var(--color-rose-deep)',
              cursor: 'pointer',
              padding: '2px 6px',
            }}
          >
            {t('safety.manage')}
          </button>
        </div>

        {/* Translucent Grouped Surface */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.82)',
            borderRadius: '16px',
            border: '1px solid rgba(235, 218, 222, 0.7)',
            boxShadow: '0 2px 8px rgba(185, 111, 128, 0.04)',
            overflow: 'hidden',
          }}
        >
          {/* Contact 1 */}
          <div
            onClick={() => setActiveModal('contacts')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
              borderBottom: '1px solid rgba(235, 218, 222, 0.5)',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(217, 141, 157, 0.14)',
                  border: '1px solid #EED8DC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: 'var(--color-rose-deep)',
                  flexShrink: 0,
                }}
              >
                EC
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.2 }}>Emergency Contact</p>
                <p style={{ fontSize: '11px', color: '#655358', marginTop: '2px' }}>
                  Primary • +91 8197149231
                </p>
              </div>
            </div>

            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 600,
                color: 'var(--color-rose-deep)',
                backgroundColor: 'rgba(217, 141, 157, 0.12)',
                border: '1px solid rgba(217, 141, 157, 0.25)',
                padding: '3px 8px',
                borderRadius: '6px',
              }}
            >
              {t('safety.alertsActive')}
            </span>
          </div>

          {/* Contact 2 */}
          <div
            onClick={() => setActiveModal('contacts')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(217, 141, 157, 0.14)',
                  border: '1px solid #EED8DC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: 'var(--color-rose-deep)',
                  flexShrink: 0,
                }}
              >
                PD
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.2 }}>Police Dispatch</p>
                <p style={{ fontSize: '11px', color: '#655358', marginTop: '2px' }}>
                  Central Emergency • 112
                </p>
              </div>
            </div>

            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 600,
                color: 'var(--color-rose-deep)',
                backgroundColor: 'rgba(217, 141, 157, 0.12)',
                border: '1px solid rgba(217, 141, 157, 0.25)',
                padding: '3px 8px',
                borderRadius: '6px',
              }}
            >
              {t('safety.alertsActive')}
            </span>
          </div>
        </div>
      </section>

      {/* ---------------- 2. ACTIVE TOGGLES (VERTICAL LAYOUT) ---------------- */}
      <section style={{ marginBottom: '16px' }}>
        <div style={{ marginBottom: '7px', paddingLeft: '4px' }}>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              fontWeight: 700,
              color: '#3B121C',
              letterSpacing: '0.02em',
            }}
          >
            {t('safety.instantTriggers')}
          </span>
        </div>

        {/* 3-Column Vertical Layout Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
          }}
        >
          {/* Vertical Toggle 1: Voice Trigger (Click to configure keywords) */}
          <div
            onClick={() => setActiveModal('voice')}
            style={{
              backgroundColor: isVoiceListening ? 'rgba(232, 245, 233, 0.75)' : 'rgba(255, 255, 255, 0.82)',
              borderRadius: '14px',
              border: isVoiceListening
                ? '1px solid rgba(46, 125, 50, 0.35)'
                : '1px solid rgba(235, 218, 222, 0.7)',
              padding: '12px 6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 2px 6px rgba(185, 111, 128, 0.04)',
              cursor: 'pointer',
              transition: 'all 160ms ease',
            }}
          >
            {/* Small refined icon at the top */}
            <div style={{ position: 'relative' }}>
              <Mic
                size={17}
                strokeWidth={2}
                color={isVoiceListening ? '#2E7D32' : 'var(--color-rose-deep)'}
              />
              {isVoiceListening && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-4px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#2E7D32',
                    boxShadow: '0 0 6px #2E7D32',
                  }}
                />
              )}
            </div>

            {/* Setting name and short description underneath */}
            <p style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-text)', marginTop: '6px', lineHeight: 1.15 }}>
              {t('safety.voiceSos')}
            </p>
            <p
              style={{
                fontSize: '9.5px',
                color: isVoiceListening ? '#2E7D32' : isVoiceError ? 'var(--color-sos)' : '#655358',
                fontWeight: isVoiceListening || isVoiceError ? 700 : 500,
                marginTop: '2px',
                lineHeight: 1.2,
              }}
            >
              {isVoiceListening
                ? t('safety.voiceActive')
                : voiceBusy
                ? 'Starting...'
                : isVoiceError
                ? voiceState === 'permission_denied' ? 'Mic blocked' : 'Unavailable'
                : t('safety.tapSetup')}
            </p>
            {/* Error message below the card if any */}
            {voiceErrorMsg && (
              <p style={{ fontSize: '9px', color: 'var(--color-sos)', marginTop: '4px', lineHeight: 1.3, textAlign: 'center' }}>
                {voiceErrorMsg}
              </p>
            )}

            {/* Toggle switch at the bottom */}
            <button
              role="switch"
              aria-checked={isVoiceListening}
              aria-label="Toggle Voice Trigger"
              disabled={voiceBusy}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleVoice();
              }}
              style={{
                marginTop: '10px',
                width: '34px',
                height: '20px',
                borderRadius: '10px',
                backgroundColor: isVoiceListening ? '#2E7D32' : isVoiceError ? '#C8404B' : '#E0D4D6',
                position: 'relative',
                cursor: voiceBusy ? 'not-allowed' : 'pointer',
                transition: 'background-color 160ms ease-out',
                border: 'none',
                outline: 'none',
                opacity: voiceBusy ? 0.6 : 1,
              }}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  position: 'absolute',
                  top: '2px',
                  left: isVoiceListening ? '16px' : '2px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
                  transition: 'left 160ms cubic-bezier(0.2, 0, 0, 1)',
                }}
              />
            </button>
          </div>

          {/* Vertical Toggle 2: Shake Detection */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.82)',
              borderRadius: '14px',
              border: '1px solid rgba(235, 218, 222, 0.7)',
              padding: '12px 6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 2px 6px rgba(185, 111, 128, 0.04)',
            }}
          >
            {/* Small refined icon at the top */}
            <Activity size={17} strokeWidth={1.8} color="var(--color-rose-deep)" />

            {/* Setting name and short description underneath */}
            <p style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-text)', marginTop: '6px', lineHeight: 1.15 }}>
              {t('safety.shakeDetection')}
            </p>
            <p style={{ fontSize: '9.5px', color: '#655358', marginTop: '2px', lineHeight: 1.2 }}>
              Multi-shake
            </p>

            {/* Toggle switch at the bottom */}
            <button
              role="switch"
              aria-checked={shakeEnabled}
              aria-label="Toggle Shake Detection"
              onClick={() => setShakeEnabled(!shakeEnabled)}
              style={{
                marginTop: '10px',
                width: '34px',
                height: '20px',
                borderRadius: '10px',
                backgroundColor: shakeEnabled ? 'var(--color-rose-deep)' : '#E0D4D6',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 160ms ease-out',
                border: 'none',
                outline: 'none',
              }}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  position: 'absolute',
                  top: '2px',
                  left: shakeEnabled ? '16px' : '2px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
                  transition: 'left 160ms cubic-bezier(0.2, 0, 0, 1)',
                }}
              />
            </button>
          </div>

          {/* Vertical Toggle 3: Critical Alert Permissions */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.82)',
              borderRadius: '14px',
              border: '1px solid rgba(235, 218, 222, 0.7)',
              padding: '12px 6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 2px 6px rgba(185, 111, 128, 0.04)',
            }}
          >
            {/* Small refined icon at the top */}
            <Bell size={17} strokeWidth={1.8} color="var(--color-rose-deep)" />

            {/* Setting name and short description underneath */}
            <p style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-text)', marginTop: '6px', lineHeight: 1.15 }}>
              {t('safety.criticalAlerts')}
            </p>
            <p style={{ fontSize: '9.5px', color: '#655358', marginTop: '2px', lineHeight: 1.2 }}>
              {t('safety.highPriority')}
            </p>

            {/* Toggle switch at the bottom */}
            <button
              role="switch"
              aria-checked={criticalAlertsEnabled}
              aria-label="Toggle Critical Alert Permissions"
              onClick={() => setCriticalAlertsEnabled(!criticalAlertsEnabled)}
              style={{
                marginTop: '10px',
                width: '34px',
                height: '20px',
                borderRadius: '10px',
                backgroundColor: criticalAlertsEnabled ? 'var(--color-rose-deep)' : '#E0D4D6',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 160ms ease-out',
                border: 'none',
                outline: 'none',
              }}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  position: 'absolute',
                  top: '2px',
                  left: criticalAlertsEnabled ? '16px' : '2px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
                  transition: 'left 160ms cubic-bezier(0.2, 0, 0, 1)',
                }}
              />
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- 3. SAFETY PROTOCOLS (NAVIGATION ROWS) ---------------- */}
      <section style={{ marginBottom: '16px' }}>
        <div style={{ marginBottom: '7px', paddingLeft: '4px' }}>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              fontWeight: 700,
              color: '#3B121C',
              letterSpacing: '0.02em',
            }}
          >
            {t('safety.safeguards')}
          </span>
        </div>

        {/* Translucent Grouped Surface */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.82)',
            borderRadius: '16px',
            border: '1px solid rgba(235, 218, 222, 0.7)',
            boxShadow: '0 2px 8px rgba(185, 111, 128, 0.04)',
            overflow: 'hidden',
          }}
        >
          {/* Language Selection Row */}
          <div
            role="button"
            tabIndex={0}
            onClick={openLanguageModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
              borderBottom: '1px solid rgba(235, 218, 222, 0.5)',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Languages size={16} strokeWidth={1.8} color="var(--color-rose-deep)" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>{t('home.selectLang')}</p>
                <p style={{ fontSize: '11px', color: '#655358' }}>English, हिन्दी, ಕನ್ನಡ, తెలుగు, தமிழ்</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#655358' }}>
                {languages.find((l) => l.code === language)?.nativeName || 'English'}
              </span>
              <ChevronRight size={14} color="var(--color-text-muted)" />
            </div>
          </div>

          {/* Safety Timer Row */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setActiveModal('timer')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
              borderBottom: '1px solid rgba(235, 218, 222, 0.5)',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Timer size={16} strokeWidth={1.8} color="var(--color-rose-deep)" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>{t('safety.safetyTimer')}</p>
                <p style={{ fontSize: '11px', color: '#655358' }}>{t('safety.autoCheckinAlert')}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#655358' }}>{t('safety.off')}</span>
              <ChevronRight size={14} color="var(--color-text-muted)" />
            </div>
          </div>

          {/* Fake Call Row */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setActiveModal('fakeCall')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
              borderBottom: '1px solid rgba(235, 218, 222, 0.5)',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <PhoneCall size={16} strokeWidth={1.8} color="var(--color-rose-deep)" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>{t('safety.fakeCall')}</p>
                <p style={{ fontSize: '11px', color: '#655358' }}>
                  {fakeCallTimer ? `Calling in ${fakeCallTimer}s...` : t('safety.fakeCallDesc')}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: fakeCallTimer ? 'var(--color-rose-deep)' : '#655358' }}>
                {fakeCallTimer ? t('safety.active') : t('safety.ready')}
              </span>
              <ChevronRight size={14} color="var(--color-text-muted)" />
            </div>
          </div>

          {/* Emergency PIN Protection Row */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setActiveModal('pin')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock size={16} strokeWidth={1.8} color="var(--color-rose-deep)" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>{t('safety.pinProtection')}</p>
                <p style={{ fontSize: '11px', color: '#655358' }}>{t('safety.pinRequiredDesc')}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#655358' }}>{t('safety.configured')}</span>
              <ChevronRight size={14} color="var(--color-text-muted)" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4. RECORDS & EVIDENCE (NAVIGATION ROWS) ---------------- */}
      <section style={{ marginBottom: '12px' }}>
        <div style={{ marginBottom: '7px', paddingLeft: '4px' }}>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              fontWeight: 700,
              color: '#3B121C',
              letterSpacing: '0.02em',
            }}
          >
            {t('safety.recordsEvidence')}
          </span>
        </div>

        {/* Translucent Grouped Surface */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.82)',
            borderRadius: '16px',
            border: '1px solid rgba(235, 218, 222, 0.7)',
            boxShadow: '0 2px 8px rgba(185, 111, 128, 0.04)',
            overflow: 'hidden',
          }}
        >
          {/* Recording Preferences Row */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setActiveModal('recording')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
              borderBottom: '1px solid rgba(235, 218, 222, 0.5)',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Disc size={16} strokeWidth={1.8} color="var(--color-rose-deep)" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>{t('safety.recordingPrefs')}</p>
                <p style={{ fontSize: '11px', color: '#655358' }}>{t('safety.ambientAudioGps')}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#655358' }}>{t('safety.audioGps')}</span>
              <ChevronRight size={14} color="var(--color-text-muted)" />
            </div>
          </div>

          {/* Incident Reports Row */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setActiveModal('history')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
              borderBottom: '1px solid rgba(235, 218, 222, 0.5)',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={16} strokeWidth={1.8} color="var(--color-rose-deep)" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>{t('safety.incidentReports')}</p>
                <p style={{ fontSize: '11px', color: '#655358' }}>{t('safety.historicalLogs')}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#655358' }}>{t('safety.noneLogged')}</span>
              <ChevronRight size={14} color="var(--color-text-muted)" />
            </div>
          </div>

          {/* Evidence Vault Row */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setActiveModal('vault')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FolderLock size={16} strokeWidth={1.8} color="var(--color-rose-deep)" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>{t('safety.evidenceVault')}</p>
                <p style={{ fontSize: '11px', color: '#655358' }}>{t('safety.encryptedRepo')}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#655358' }}>{t('safety.zeroRecordings')}</span>
              <ChevronRight size={14} color="var(--color-text-muted)" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- DETAIL MODAL SHEETS ---------------- */}
      {activeModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 60,
            backgroundColor: 'rgba(40, 35, 38, 0.45)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '22px',
              borderTopRightRadius: '22px',
              padding: '20px 20px calc(76px + env(safe-area-inset-bottom, 0px)) 20px',
              maxHeight: '80%',
              boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.12)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)' }}>
                {activeModal === 'voice' && 'Automatic Voice SOS'}
                {activeModal === 'contacts' && 'Manage Trusted Contacts'}
                {activeModal === 'timer' && 'Safety Check-in Timer'}
                {activeModal === 'fakeCall' && 'Fake Call Decoy'}
                {activeModal === 'incomingFakeCall' && 'Incoming Call'}
                {activeModal === 'pin' && 'Emergency PIN Protection'}
                {activeModal === 'recording' && 'Recording Preferences'}
                {activeModal === 'history' && 'Incident Reports'}
                {activeModal === 'vault' && 'Evidence Vault'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Content: Automatic Voice SOS */}
            {activeModal === 'voice' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '68vh', overflowY: 'auto' }}>
                {/* 1. Status & Master Toggle */}
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: isVoiceListening ? '#E8F5E9' : voiceState === 'permission_denied' ? '#FFEBEE' : 'var(--color-surface-soft)',
                    border: isVoiceListening ? '1px solid #C8E6C9' : voiceState === 'permission_denied' ? '1px solid #FFCDD2' : '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        backgroundColor: isVoiceListening ? '#2E7D32' : 'var(--color-text-muted)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isVoiceListening ? <Mic size={17} /> : <MicOff size={17} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>
                        {isVoiceListening ? 'Microphone Listening Active' : voiceState === 'permission_denied' ? 'Microphone Access Blocked' : 'Voice Activation Paused'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        {isVoiceListening ? 'Say any keyword to trigger instant hands-free SOS' : voiceState === 'permission_denied' ? 'Grant permission in browser to enable' : 'Tap switch to activate keyword spotting'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleToggleVoice}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '16px',
                      backgroundColor: isVoiceListening ? '#2E7D32' : 'var(--color-rose-deep)',
                      color: '#FFFFFF',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {isVoiceListening ? 'Turn Off' : 'Enable'}
                  </button>
                </div>

                {/* 2. Standalone Emergency Keywords */}
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
                    Standalone Emergency Keywords
                  </div>
                  <p style={{ fontSize: '11px', color: '#655358', margin: '0 0 8px 0' }}>
                    Spoken as single clear words. Partial matches (e.g. "shelf", "helping") are ignored.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {DEFAULT_STANDALONE_KEYWORDS.map((kw) => (
                      <span
                        key={kw}
                        style={{
                          backgroundColor: '#FFF0F2',
                          color: 'var(--color-sos)',
                          border: '1px solid #F3CFD2',
                          borderRadius: '8px',
                          padding: '4px 10px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                        }}
                      >
                        "{kw.toUpperCase()}"
                      </span>
                    ))}
                  </div>
                </div>

                {/* 3. Natural Emergency Phrases */}
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
                    Natural Emergency Phrases
                  </div>
                  <p style={{ fontSize: '11px', color: '#655358', margin: '0 0 8px 0' }}>
                    Full natural spoken sentences that trigger the emergency sequence.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {DEFAULT_NATURAL_PHRASES.map((ph) => (
                      <span
                        key={ph}
                        style={{
                          backgroundColor: 'var(--color-surface-soft)',
                          color: 'var(--color-text)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px',
                          padding: '4px 10px',
                          fontSize: '11.5px',
                          fontWeight: 600,
                        }}
                      >
                        "{ph}"
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4. Custom User Trigger Phrases */}
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
                    Custom Trigger Phrases
                  </div>
                  <p style={{ fontSize: '11px', color: '#655358', margin: '0 0 8px 0' }}>
                    Configure personal safe words or discreet phrases.
                  </p>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      placeholder="e.g. Code Red or Need Police"
                      value={newPhraseInput}
                      onChange={(e) => setNewPhraseInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddPhrase()}
                      style={{
                        flex: 1,
                        height: '36px',
                        padding: '0 12px',
                        borderRadius: '10px',
                        border: '1px solid var(--color-border)',
                        fontSize: '12px',
                        outline: 'none',
                      }}
                    />
                    <button
                      onClick={handleAddPhrase}
                      style={{
                        padding: '0 14px',
                        height: '36px',
                        backgroundColor: 'var(--color-rose-deep)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Add
                    </button>
                  </div>

                  {phraseError && (
                    <div style={{ fontSize: '11px', color: 'var(--color-error)', marginBottom: '6px' }}>
                      {phraseError}
                    </div>
                  )}

                  {customKeywords.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {customKeywords.map((ph) => (
                        <span
                          key={ph}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: '#F3E8E9',
                            color: 'var(--color-text)',
                            border: '1px solid #E5D0D4',
                            borderRadius: '8px',
                            padding: '4px 8px 4px 10px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                          }}
                        >
                          <span>"{ph}"</span>
                          <button
                            onClick={() => handleRemovePhrase(ph)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--color-text-muted)',
                              cursor: 'pointer',
                              padding: '2px',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0, fontStyle: 'italic' }}>
                      No custom phrases added yet.
                    </p>
                  )}
                </div>

                {/* 5. Honest Technical & Privacy Disclosure */}
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(240, 230, 235, 0.4)',
                    border: '1px solid rgba(220, 200, 210, 0.6)',
                    fontSize: '10.5px',
                    lineHeight: 1.45,
                    color: '#655358',
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: '2px' }}>
                    Privacy & System Limits
                  </div>
                  <div>
                    • <strong>Local On-Device Audio:</strong> Spoken audio is analyzed directly by your browser engine. Audio is not retained or uploaded to external servers.
                  </div>
                  <div style={{ marginTop: '2px' }}>
                    • <strong>Browser Requirement:</strong> Hands-free listening runs while this browser tab remains active. Continuous background detection with locked device requires native Android/iOS foreground services.
                  </div>
                </div>
              </div>
            )}

            {/* Modal Content: Contacts — live editable form */}
            {activeModal === 'contacts' && (
              <div>
                <p style={{ fontSize: '12px', color: '#655358', marginBottom: '14px', lineHeight: 1.45 }}>
                  These numbers receive instant SMS with your GPS location when SOS triggers.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    contactSettings.setPrimaryPhone(primaryPhone);
                    contactSettings.setSecondaryPhone(showSecondaryInput ? secondaryPhone : '');
                    setContactSaveSuccess(true);
                    setTimeout(() => setContactSaveSuccess(false), 2500);
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                >
                  {/* Primary */}
                  <div>
                    <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                      Primary Emergency Number
                    </label>
                    <input
                      type="tel"
                      value={primaryPhone}
                      onChange={(e) => setPrimaryPhone(e.target.value)}
                      placeholder="+918197149231"
                      required
                      style={{
                        width: '100%',
                        height: '40px',
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

                  {/* Secondary toggle */}
                  {showSecondaryInput ? (
                    <div>
                      <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                        Secondary Number (also gets the SMS)
                      </label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input
                          type="tel"
                          value={secondaryPhone}
                          onChange={(e) => setSecondaryPhone(e.target.value)}
                          placeholder="+919876543210"
                          style={{
                            flex: 1,
                            height: '40px',
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
                            height: '40px',
                            padding: '0 10px',
                            borderRadius: '8px',
                            border: '1px solid #EDD8DC',
                            backgroundColor: 'transparent',
                            color: 'var(--color-sos)',
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
                        justifyContent: 'center',
                        gap: '6px',
                        width: '100%',
                        padding: '10px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--color-surface-soft)',
                        border: '1px solid var(--color-border)',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--color-rose-deep)',
                        cursor: 'pointer',
                      }}
                    >
                      <Plus size={15} /> Add Another Contact
                    </button>
                  )}

                  {/* Save */}
                  <button
                    type="submit"
                    style={{
                      height: '40px',
                      backgroundColor: contactSaveSuccess ? 'var(--color-success)' : 'var(--color-rose-deep)',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    {contactSaveSuccess
                      ? <><Check size={14} /><span>Saved!</span></>
                      : <span>Save Contacts</span>
                    }
                  </button>
                </form>
              </div>
            )}

            {/* Modal Content: Safety Timer */}
            {activeModal === 'timer' && (
              <div>
                <p style={{ fontSize: '12px', color: '#655358', marginBottom: '14px', lineHeight: 1.45 }}>
                  Set an expiration window. If you don't check in before it elapses, alerts are sent to your contacts.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '14px' }}>
                  {['15m', '30m', '1 hr', '2 hr'].map((t, idx) => (
                    <button
                      key={t}
                      onClick={() => setActiveModal(null)}
                      style={{
                        padding: '10px 0',
                        borderRadius: '10px',
                        backgroundColor: idx === 1 ? 'var(--color-text)' : 'var(--color-surface-soft)',
                        color: idx === 1 ? '#FFFFFF' : 'var(--color-text)',
                        border: '1px solid var(--color-border)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Content: Fake Call Configuration */}
            {activeModal === 'fakeCall' && (
              <div>
                <p style={{ fontSize: '12px', color: '#655358', marginBottom: '12px', lineHeight: 1.45 }}>
                  Trigger a simulated incoming phone call to give you a natural reason to leave uncomfortable situations.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                  <button
                    onClick={() => handleTriggerFakeCall(5)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--color-surface-soft)',
                      border: '1px solid var(--color-border)',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      cursor: 'pointer',
                    }}
                  >
                    <span>Trigger in 5 seconds</span>
                    <span style={{ fontSize: '11px', color: 'var(--color-rose-deep)' }}>Instant</span>
                  </button>

                  <button
                    onClick={() => handleTriggerFakeCall(30)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--color-surface-soft)',
                      border: '1px solid var(--color-border)',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      cursor: 'pointer',
                    }}
                  >
                    <span>Trigger in 30 seconds</span>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Delay</span>
                  </button>
                </div>
              </div>
            )}

            {/* Modal Content: Incoming Fake Call Simulation */}
            {activeModal === 'incomingFakeCall' && (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(217, 141, 157, 0.16)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    color: 'var(--color-rose-deep)',
                  }}
                >
                  <PhoneCall size={28} />
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '2px' }}>Mom</h4>
                <p style={{ fontSize: '12px', color: '#655358', marginBottom: '18px' }}>Mobile • Incoming Call...</p>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setActiveModal(null)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--color-error)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => setActiveModal(null)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      backgroundColor: '#2E7D32',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Accept
                  </button>
                </div>
              </div>
            )}

            {/* Modal Content: PIN */}
            {activeModal === 'pin' && (
              <div>
                <p style={{ fontSize: '12px', color: '#655358', marginBottom: '14px', lineHeight: 1.45 }}>
                  Your 4-digit security PIN is required to deactivate active SOS mode and prevent forced disarming.
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '14px',
                    backgroundColor: 'var(--color-surface-soft)',
                    borderRadius: '12px',
                    marginBottom: '14px',
                  }}
                >
                  <span style={{ fontSize: '24px', letterSpacing: '6px' }}>••••</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-rose-deep)', fontWeight: 600 }}>Active</span>
                </div>
              </div>
            )}

            {/* Modal Content: Recording Preferences */}
            {activeModal === 'recording' && (
              <div>
                <p style={{ fontSize: '12px', color: '#655358', marginBottom: '12px', lineHeight: 1.45 }}>
                  Configure what telemetry is captured during an active emergency event.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--color-surface-soft)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Volume2 size={16} color="var(--color-rose-deep)" />
                      <span style={{ fontSize: '12.5px', fontWeight: 600 }}>Ambient Microphone</span>
                    </div>
                    <Check size={16} color="var(--color-rose-deep)" />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--color-surface-soft)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Activity size={16} color="var(--color-rose-deep)" />
                      <span style={{ fontSize: '12.5px', fontWeight: 600 }}>High-Precision GPS Trail</span>
                    </div>
                    <Check size={16} color="var(--color-rose-deep)" />
                  </div>
                </div>
              </div>
            )}

            {/* Modal Content: Incident Reports */}
            {activeModal === 'history' && (
              <div>
                <p style={{ fontSize: '12px', color: '#655358', marginBottom: '12px', lineHeight: 1.45 }}>
                  Official record of SOS triggers, dispatched alerts, and location breadcrumbs.
                </p>
                <div
                  style={{
                    padding: '24px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--color-surface-soft)',
                    textAlign: 'center',
                    marginBottom: '14px',
                  }}
                >
                  <FileText size={22} color="var(--color-rose-deep)" style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>No Incidents on Record</p>
                  <p style={{ fontSize: '11px', color: '#655358', marginTop: '2px' }}>
                    Zero emergency dispatches in the past 90 days.
                  </p>
                </div>
              </div>
            )}

            {/* Modal Content: Evidence Vault */}
            {activeModal === 'vault' && (
              <div>
                <p style={{ fontSize: '12px', color: '#655358', marginBottom: '12px', lineHeight: 1.45 }}>
                  Tamper-evident, zero-knowledge encrypted storage for audio and situational evidence.
                </p>
                <div
                  style={{
                    padding: '24px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--color-surface-soft)',
                    textAlign: 'center',
                    marginBottom: '14px',
                  }}
                >
                  <FolderLock size={22} color="var(--color-rose-deep)" style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>Vault Empty</p>
                  <p style={{ fontSize: '11px', color: '#655358', marginTop: '2px' }}>
                    Recordings captured during active SOS will appear here.
                  </p>
                </div>
              </div>
            )}

            {activeModal !== 'incomingFakeCall' && (
              <button
                onClick={() => setActiveModal(null)}
                style={{
                  width: '100%',
                  marginTop: '6px',
                  padding: '11px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-text)',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {t('safety.done')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
