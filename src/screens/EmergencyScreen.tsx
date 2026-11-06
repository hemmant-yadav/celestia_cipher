import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  MapPin,
  Mic,
  Phone,
  Check,
  ChevronRight,
  Lock,
  Delete,
  X,
} from 'lucide-react';
import { arduinoSerial, type ArduinoStatus } from '../services/arduinoSerial';
import { voiceSos, type VoiceTriggerEvent } from '../services/voiceSos';
import { useTranslation } from '../services/i18n';
import { contactSettings, type EmergencyContacts } from '../services/contactSettings';

interface EmergencyScreenProps {
  onCancelEmergency?: () => void;
}

const CORRECT_PASSCODE = '1234';

export const EmergencyScreen: React.FC<EmergencyScreenProps> = ({ onCancelEmergency }) => {
  const { t } = useTranslation();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [serialStatus, setSerialStatus] = useState<ArduinoStatus>(arduinoSerial.getStatus());
  const [contacts, setContacts] = useState<EmergencyContacts>(() => contactSettings.getContacts());
  const [voiceTrigger] = useState<VoiceTriggerEvent | null>(() => {
    return voiceSos.getLastEvent() || null;
  });

  useEffect(() => {
    const unsubContacts = contactSettings.subscribe((c) => setContacts(c));
    return () => unsubContacts();
  }, []);

  // Passcode Modal & Slider States
  const [isPasscodeOpen, setIsPasscodeOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [pinSuccess, setPinSuccess] = useState(false);

  // Slider Dragging States
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);

  // Real-time synchronization with Arduino SIM800L serial bridge
  useEffect(() => {
    const unsubscribe = arduinoSerial.subscribe((status) => {
      setSerialStatus(status);
    });
    return () => unsubscribe();
  }, []);

  // Emergency elapsed timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const raw = serialStatus.rawStatusLine || '';
  const isCalling = raw.includes('CALLING') || raw.includes('CALL_ENDED');
  const isSmsSent = raw.includes('SMS_SENT') || isCalling || raw.includes('REPLIED');

  // Slider calculation
  const getMaxDistance = () => {
    if (!trackRef.current) return 230;
    return trackRef.current.clientWidth - 46 - 6; // track width minus thumb diameter and margins
  };

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX - sliderPosition;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const max = getMaxDistance();
    const newX = Math.max(0, Math.min(clientX - startXRef.current, max));
    setSliderPosition(newX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const max = getMaxDistance();
    if (sliderPosition >= max * 0.78) {
      // Slid far enough -> trigger Passcode Verification
      setSliderPosition(0);
      setEnteredPin('');
      setPinError(false);
      setPinSuccess(false);
      setIsPasscodeOpen(true);
    } else {
      // Snap back to origin
      setSliderPosition(0);
    }
  };

  // Passcode handling
  const handleKeypadPress = (val: string) => {
    if (pinSuccess) return;
    if (val === 'del') {
      setEnteredPin((prev) => prev.slice(0, -1));
      setPinError(false);
      return;
    }

    if (enteredPin.length < 4) {
      const nextPin = enteredPin + val;
      setEnteredPin(nextPin);
      setPinError(false);

      if (nextPin.length === 4) {
        if (nextPin === CORRECT_PASSCODE) {
          setPinSuccess(true);
          voiceSos.resetTriggerState();
          try {
            localStorage.removeItem('safealert_last_voice_trigger');
          } catch {}
          setTimeout(() => {
            setIsPasscodeOpen(false);
            onCancelEmergency?.();
          }, 450);
        } else {
          setPinError(true);
          setTimeout(() => {
            setEnteredPin('');
            setPinError(false);
          }, 800);
        }
      }
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(250, 242, 244, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 'calc(18px + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(18px + env(safe-area-inset-bottom, 0px))',
        paddingLeft: '16px',
        paddingRight: '16px',
        color: 'var(--color-text)',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
      onMouseMove={(e) => isDragging && handleDragMove(e.clientX)}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchMove={(e) => isDragging && handleDragMove(e.touches[0].clientX)}
      onTouchEnd={handleDragEnd}
    >
      {/* 1. Header: Status & Timer */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '10px',
          borderBottom: '1px solid var(--color-border)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-sos)',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <h1
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '12.5px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-sos)',
              margin: 0,
            }}
          >
            {t('emergency.modeActive')}
          </h1>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '12.5px',
            fontWeight: 700,
            color: 'var(--color-text-muted)',
            fontVariantNumeric: 'tabular-nums',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            padding: '2px 8px',
            borderRadius: '6px',
          }}
        >
          {formatTimer(elapsedSeconds)}
        </div>
      </header>

      {/* 2. Dispatch Status Section */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-border)',
          borderRadius: '14px',
          padding: '14px 16px',
          boxShadow: '0 1px 3px rgba(40, 35, 38, 0.03)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '7px',
          }}
        >
          <span
            style={{
              fontSize: '10.5px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-text-muted)',
            }}
          >
            {t('emergency.dispatchStatus')}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {voiceTrigger && (
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  color: 'var(--color-sos)',
                  backgroundColor: '#FDF0F1',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  border: '1px solid #F3CFD2',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Mic size={11} strokeWidth={2.4} />
                <span>{t('emergency.voiceTrigger')}: "{voiceTrigger.matchedPhrase}"</span>
              </span>
            )}
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: isCalling ? 'var(--color-sos)' : 'var(--color-success)',
                backgroundColor: isCalling ? '#FDF0F1' : '#E8F3EE',
                padding: '2px 7px',
                borderRadius: '4px',
              }}
            >
              {isCalling ? t('emergency.calling') : isSmsSent ? t('emergency.smsSent') : t('emergency.initiating')}
            </span>
          </div>
        </div>

        <p
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--color-text)',
            lineHeight: 1.4,
            margin: '0 0 11px 0',
          }}
        >
          {serialStatus.displayMessage ||
            'Emergency SMS sent to favorite contacts and nearby police. Waiting for reply...'}
        </p>

        {/* Minimal 3-Step Timeline */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            paddingTop: '9px',
            borderTop: '1px solid var(--color-border-subtle)',
          }}
        >
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: '#E8F3EE',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                flexShrink: 0,
              }}
            >
              <Check size={11} strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text)' }}>
              {t('emergency.sosSent')}
            </span>
          </div>

          <div
            style={{
              width: '12px',
              height: '1px',
              backgroundColor: isSmsSent ? 'var(--color-success)' : 'var(--color-border)',
            }}
          />

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: isSmsSent ? '#E8F3EE' : '#F3E8E9',
                color: isSmsSent ? 'var(--color-success)' : 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                flexShrink: 0,
              }}
            >
              {isSmsSent ? <Check size={11} strokeWidth={2.5} /> : '2'}
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: isSmsSent ? 600 : 500,
                color: isSmsSent ? 'var(--color-text)' : 'var(--color-text-muted)',
              }}
            >
              {t('emergency.smsDispatched')}
            </span>
          </div>

          <div
            style={{
              width: '12px',
              height: '1px',
              backgroundColor: isCalling ? 'var(--color-sos)' : 'var(--color-border)',
            }}
          />

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: isCalling ? '#FDF0F1' : '#F3E8E9',
                color: isCalling ? 'var(--color-sos)' : 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                flexShrink: 0,
              }}
            >
              {isCalling ? <Phone size={9} strokeWidth={2.5} /> : '3'}
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: isCalling ? 700 : 500,
                color: isCalling ? 'var(--color-sos)' : 'var(--color-text-muted)',
              }}
            >
              {t('emergency.voiceCall')}
            </span>
          </div>
        </div>
      </section>

      {/* 3. Notified Recipients Section */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-border)',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(40, 35, 38, 0.03)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: '10px 16px 6px',
            fontSize: '10.5px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--color-text-muted)',
          }}
        >
          {t('emergency.recipients')}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Primary Emergency Contact */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px',
              borderTop: '1px solid var(--color-border-subtle)',
              fontSize: '12.5px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 600 }}>Emergency Contact</span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
                {contacts.primaryPhone || '+91 8197149231'}
              </span>
            </div>
            <span style={{ color: 'var(--color-success)', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={13} strokeWidth={2} /> {t('emergency.delivered')}
            </span>
          </div>

          {/* Secondary Emergency Contact (if added on page) */}
          {contacts.secondaryPhone && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 16px',
                borderTop: '1px solid var(--color-border-subtle)',
                fontSize: '12.5px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 600 }}>Emergency Contact 2</span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
                  {contacts.secondaryPhone}
                </span>
              </div>
              <span style={{ color: 'var(--color-success)', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={13} strokeWidth={2} /> {t('emergency.delivered')}
              </span>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px',
              borderTop: '1px solid var(--color-border-subtle)',
              fontSize: '12.5px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 600 }}>Police Dispatch</span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>112 / Central</span>
            </div>
            <span style={{ color: 'var(--color-success)', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={13} strokeWidth={2} /> {t('emergency.broadcasted')}
            </span>
          </div>
        </div>
      </section>

      {/* 4. Live Location & Telemetry Section */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-border)',
          borderRadius: '14px',
          padding: '11px 16px',
          boxShadow: '0 1px 3px rgba(40, 35, 38, 0.03)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color="var(--color-rose-deep)" strokeWidth={2} />
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--color-text)' }}>
              12.8867° N, 77.4503° E
            </span>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-success)' }}>
            {t('emergency.liveGps')}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '6px',
            borderTop: '1px solid var(--color-border-subtle)',
            fontSize: '11px',
            color: 'var(--color-text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Mic size={12} color="var(--color-sos)" strokeWidth={2} />
            <span>{t('emergency.audioBuffer')} ({formatTimer(elapsedSeconds)})</span>
          </div>
          <span>{t('emergency.battery')}</span>
        </div>
      </section>

      {/* 5. Emergency Calling Actions */}
      <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
        <a
          href="tel:+918197149231"
          style={{
            flex: 1,
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid var(--color-border)',
            borderRadius: '14px',
            fontSize: '13.5px',
            fontWeight: 700,
            color: 'var(--color-text)',
            textDecoration: 'none',
            boxShadow: '0 1px 3px rgba(40, 35, 38, 0.04)',
            cursor: 'pointer',
            transition: 'background-color 140ms ease, transform 140ms ease',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Phone size={15} color="var(--color-rose-deep)" strokeWidth={2} />
          <span>{t('emergency.callContact')}</span>
        </a>

        <a
          href="tel:112"
          style={{
            flex: 1,
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: '#FDF0F1',
            border: '1.5px solid #F3CFD2',
            borderRadius: '14px',
            fontSize: '13.5px',
            fontWeight: 700,
            color: 'var(--color-sos)',
            textDecoration: 'none',
            boxShadow: '0 1px 3px rgba(200, 63, 75, 0.06)',
            cursor: 'pointer',
            transition: 'background-color 140ms ease, transform 140ms ease',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Phone size={15} color="var(--color-sos)" strokeWidth={2} />
          <span>{t('emergency.call112')}</span>
        </a>
      </div>

      {/* 6. Cancel Emergency Slider */}
      <div style={{ flexShrink: 0 }}>
        <div
          ref={trackRef}
          style={{
            position: 'relative',
            width: '100%',
            height: '50px',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid var(--color-border)',
            borderRadius: '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            boxShadow: '0 1px 4px rgba(40, 35, 38, 0.04)',
          }}
        >
          {/* Track dynamic fill */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: `${sliderPosition + 46}px`,
              backgroundColor: 'rgba(200, 63, 75, 0.08)',
              transition: isDragging ? 'none' : 'width 200ms ease-out',
            }}
          />

          {/* Shimmer label */}
          <span
            style={{
              position: 'relative',
              zIndex: 1,
              fontFamily: 'var(--font-ui)',
              fontSize: '12.5px',
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: 'var(--color-text-muted)',
              pointerEvents: 'none',
              transform: `translateX(${sliderPosition * 0.15}px)`,
              opacity: Math.max(0.2, 1 - sliderPosition / 140),
            }}
          >
            {t('emergency.slideToCancel')}
          </span>

          {/* Slider Thumb */}
          <div
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            style={{
              position: 'absolute',
              left: '3px',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-rose-deep)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 6px rgba(185, 111, 128, 0.3)',
              cursor: 'grab',
              transform: `translateX(${sliderPosition}px)`,
              transition: isDragging ? 'none' : 'transform 200ms ease-out',
              zIndex: 3,
            }}
          >
            <ChevronRight size={22} strokeWidth={2.4} />
          </div>
        </div>
      </div>

      {/* ---------------- PASSCODE VERIFICATION MODAL ---------------- */}
      {isPasscodeOpen && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 80,
            backgroundColor: 'rgba(40, 35, 38, 0.55)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '20px 24px 28px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 -8px 32px rgba(40, 35, 38, 0.15)',
            }}
          >
            {/* Top Close Button */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '2px' }}>
              <button
                onClick={() => setIsPasscodeOpen(false)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: 'none',
                  outline: 'none',
                }}
              >
                <X size={15} color="var(--color-text-muted)" />
              </button>
            </div>

            {/* Lock Icon & Title */}
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(200, 63, 75, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-sos)',
                marginBottom: '10px',
              }}
            >
              <Lock size={18} strokeWidth={2.2} />
            </div>

            <h2 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--color-text)' }}>
              {t('emergency.cancelTitle')}
            </h2>
            <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: '0 0 16px 0', textAlign: 'center' }}>
              {t('emergency.enterPasscode')}
            </p>

            {/* 4 PIN Indicator Dots */}
            <div
              className={pinError ? 'shake' : ''}
              style={{
                display: 'flex',
                gap: '14px',
                marginBottom: '20px',
              }}
            >
              {[0, 1, 2, 3].map((index) => {
                const isFilled = enteredPin.length > index;
                return (
                  <div
                    key={index}
                    style={{
                      width: '13px',
                      height: '13px',
                      borderRadius: '50%',
                      backgroundColor: pinSuccess
                        ? 'var(--color-success)'
                        : pinError
                        ? 'var(--color-sos)'
                        : isFilled
                        ? 'var(--color-rose-deep)'
                        : 'transparent',
                      border: pinSuccess
                        ? '1.5px solid var(--color-success)'
                        : pinError
                        ? '1.5px solid var(--color-sos)'
                        : isFilled
                        ? '1.5px solid var(--color-rose-deep)'
                        : '1.5px solid var(--color-border)',
                      transition: 'all 140ms ease',
                    }}
                  />
                );
              })}
            </div>

            {/* Error or Success feedback message */}
            <div style={{ height: '18px', marginBottom: '12px' }}>
              {pinError && (
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-sos)' }}>
                  {t('emergency.incorrectPasscode')}
                </span>
              )}
              {pinSuccess && (
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-success)' }}>
                  {t('emergency.verifiedStandingDown')}
                </span>
              )}
            </div>

            {/* Numeric Keypad Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px 20px',
                width: '100%',
                maxWidth: '250px',
              }}
            >
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((key, i) => {
                if (key === '') {
                  return <div key={i} />;
                }

                if (key === 'del') {
                  return (
                    <button
                      key={i}
                      onClick={() => handleKeypadPress('del')}
                      style={{
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '25px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--color-text)',
                        outline: 'none',
                      }}
                    >
                      <Delete size={20} strokeWidth={1.8} />
                    </button>
                  );
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleKeypadPress(key)}
                    style={{
                      height: '50px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '25px',
                      backgroundColor: 'var(--color-surface-soft)',
                      border: '1px solid var(--color-border-subtle)',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: 'var(--color-text)',
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'background-color 100ms ease, transform 100ms ease',
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.93)')}
                    onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
