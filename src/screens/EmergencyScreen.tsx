import React, { useState, useEffect, useRef } from 'react';
import { PhoneCall, ShieldAlert, CheckCircle2, MapPin, Mic } from 'lucide-react';

interface EmergencyScreenProps {
  onCancelEmergency: () => void;
}

export const EmergencyScreen: React.FC<EmergencyScreenProps> = ({ onCancelEmergency }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [cancelHoldProgress, setCancelHoldProgress] = useState(0);
  const [isHoldingCancel, setIsHoldingCancel] = useState(false);
  const cancelAnimRef = useRef<number | null>(null);
  const cancelStartRef = useRef<number | null>(null);

  // Audio recording timer simulation
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

  // Deliberate hold-to-cancel interaction
  const startCancelHold = () => {
    setIsHoldingCancel(true);
    cancelStartRef.current = performance.now();

    const step = (now: number) => {
      if (!cancelStartRef.current) return;
      const elapsed = now - cancelStartRef.current;
      const progress = Math.min((elapsed / 2200) * 100, 100);
      setCancelHoldProgress(progress);

      if (progress >= 100) {
        setIsHoldingCancel(false);
        onCancelEmergency();
      } else {
        cancelAnimRef.current = requestAnimationFrame(step);
      }
    };

    cancelAnimRef.current = requestAnimationFrame(step);
  };

  const endCancelHold = () => {
    setIsHoldingCancel(false);
    cancelStartRef.current = null;
    if (cancelAnimRef.current) {
      cancelAnimationFrame(cancelAnimRef.current);
    }
    setCancelHoldProgress(0);
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
        overflowY: 'auto',
        paddingTop: 'calc(20px + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
        paddingLeft: '20px',
        paddingRight: '20px',
        color: 'var(--color-text)',
      }}
    >
      {/* Top Emergency Status Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-sos)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-sos)',
            }}
          >
            Emergency Mode Active
          </span>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--color-text-muted)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {formatTimer(elapsedSeconds)}
        </span>
      </div>

      {/* Primary Emergency Call Action */}
      <div style={{ marginTop: '20px' }}>
        <a
          href="tel:911"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '100%',
            backgroundColor: 'var(--color-sos)',
            color: '#FFFFFF',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '16px',
            letterSpacing: '0.02em',
            boxShadow: '0 8px 20px rgba(200, 63, 75, 0.3)',
            textDecoration: 'none',
          }}
        >
          <PhoneCall size={22} strokeWidth={2.2} />
          <span>Call 911 (Emergency Services)</span>
        </a>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            textAlign: 'center',
            marginTop: '8px',
          }}
        >
          Direct connection to local emergency dispatch via device dialler
        </p>
      </div>

      {/* Per-Action Truthful Status Groups */}
      <div
        style={{
          marginTop: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {/* Trusted Contacts Alert */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-soft)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={18} color="var(--color-rose-deep)" strokeWidth={1.8} />
              <span style={{ fontSize: '13px', fontWeight: 700 }}>
                Trusted Contacts Alerted
              </span>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--color-success)',
                backgroundColor: '#E8F3EE',
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              Delivered
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span>Maya Lin (Sister)</span>
              <span style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} /> SMS & Location Delivered
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span>David K. (Partner)</span>
              <span style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} /> SMS & Location Delivered
              </span>
            </div>
          </div>
        </div>

        {/* Live GPS Location Sharing */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-soft)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="var(--color-rose-deep)" strokeWidth={1.8} />
              <span style={{ fontSize: '13px', fontWeight: 700 }}>
                Live Location Broadcast
              </span>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--color-success)',
                backgroundColor: '#E8F3EE',
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              Active (4m accuracy)
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            37.7749° N, 122.4194° W • Battery 84% broadcasted
          </p>
        </div>

        {/* Audio Recording */}
        <div
          style={{
            backgroundColor: 'var(--color-surface-soft)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mic size={18} color="var(--color-rose-deep)" strokeWidth={1.8} />
              <span style={{ fontSize: '13px', fontWeight: 700 }}>
                Ambient Audio Evidence
              </span>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--color-sos)',
                backgroundColor: '#FCEFF0',
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              Recording ({formatTimer(elapsedSeconds)})
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Encrypted local buffer with emergency sync
          </p>
        </div>
      </div>

      {/* Deliberate Hold-to-End Emergency Action */}
      <div style={{ marginTop: 'auto', paddingTop: '28px' }}>
        <button
          onMouseDown={startCancelHold}
          onMouseUp={endCancelHold}
          onTouchStart={startCancelHold}
          onTouchEnd={endCancelHold}
          style={{
            position: 'relative',
            width: '100%',
            height: '52px',
            backgroundColor: '#FCEFF0',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform var(--motion-fast)',
          }}
        >
          {/* Progress fill */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: `${cancelHoldProgress}%`,
              backgroundColor: 'var(--color-border)',
              transition: isHoldingCancel ? 'none' : 'width 180ms ease-out',
            }}
          />
          <span
            style={{
              position: 'relative',
              zIndex: 2,
              fontFamily: 'var(--font-ui)',
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--color-text)',
            }}
          >
            {isHoldingCancel
              ? `Hold to confirm (${Math.ceil((100 - cancelHoldProgress) / 45)}s)`
              : 'Hold 2s to End Emergency'}
          </span>
        </button>
      </div>
    </div>
  );
};
