import React, { useState, useEffect, useRef, useCallback } from 'react';

interface SosControlProps {
  onActivate: () => void;
  holdDurationMs?: number;
}

export const SosControl: React.FC<SosControlProps> = ({
  onActivate,
  holdDurationMs = 2800,
}) => {
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [timeRemaining, setTimeRemaining] = useState((holdDurationMs / 1000).toFixed(1));

  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isTriggeredRef = useRef(false);

  // Proportional, elegant size leaving generous negative space
  const ringSize = 156;
  const strokeWidth = 3.5;
  const radius = (ringSize - strokeWidth * 2) / 2; // ~74.5
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const startHold = useCallback(() => {
    if (isTriggeredRef.current) return;
    setIsPressing(true);
    const start = performance.now();
    startTimeRef.current = start;

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(35);
      } catch {
        // Ignore
      }
    }

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const now = performance.now();
      const elapsed = now - start;
      const currentProgress = Math.min((elapsed / holdDurationMs) * 100, 100);
      setProgress(currentProgress);

      const remainingSecs = Math.max(0, (holdDurationMs - elapsed) / 1000);
      setTimeRemaining(remainingSecs.toFixed(1));

      if (currentProgress >= 100) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        isTriggeredRef.current = true;
        setIsPressing(false);
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate([80, 50, 120]);
          } catch {
            // Ignore
          }
        }
        onActivate();
      }
    }, 16);
  }, [holdDurationMs, onActivate]);

  const cancelHold = useCallback(() => {
    if (isTriggeredRef.current) return;
    setIsPressing(false);
    startTimeRef.current = null;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setProgress(0);
    setTimeRemaining((holdDurationMs / 1000).toFixed(1));
  }, [holdDurationMs]);

  useEffect(() => {
    isTriggeredRef.current = false;
  }, []);

  // Global release listener
  useEffect(() => {
    const handleMouseUpGlobal = () => {
      if (startTimeRef.current !== null && !isTriggeredRef.current) {
        cancelHold();
      }
    };

    window.addEventListener('mouseup', handleMouseUpGlobal);
    window.addEventListener('touchend', handleMouseUpGlobal);
    window.addEventListener('touchcancel', handleMouseUpGlobal);

    return () => {
      window.removeEventListener('mouseup', handleMouseUpGlobal);
      window.removeEventListener('touchend', handleMouseUpGlobal);
      window.removeEventListener('touchcancel', handleMouseUpGlobal);
    };
  }, [cancelHold]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === ' ' || e.key === 'Enter') && !isPressing && !isTriggeredRef.current) {
      e.preventDefault();
      startHold();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if ((e.key === ' ' || e.key === 'Enter') && isPressing) {
      e.preventDefault();
      cancelHold();
    }
  };

  return (
    <div
      className="sos-wrapper"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
      }}
    >
      {/* Central Sculptural Control */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Emergency SOS. Press and hold for 3 seconds to activate."
        aria-pressed={isPressing}
        onMouseDown={startHold}
        onTouchStart={startHold}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          position: 'relative',
          width: `${ringSize}px`,
          height: `${ringSize}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          outline: 'none',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'none',
        }}
      >
        {/* Outer Circular Activation Gauge */}
        <svg
          width={ringSize}
          height={ringSize}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'rotate(-90deg)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {/* Subtle Track Ring */}
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth={strokeWidth}
          />
          {/* Active Emergency Progress Stroke */}
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            fill="none"
            stroke="var(--color-sos)"
            strokeWidth={strokeWidth + 1}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: isPressing ? 'none' : 'stroke-dashoffset 200ms ease-out',
            }}
          />
        </svg>

        {/* 4 Precision Cardinal Dots */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          {/* Top (12 o'clock) */}
          <div
            style={{
              position: 'absolute',
              top: '3px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '2px',
              height: '2px',
              borderRadius: '50%',
              backgroundColor: isPressing ? 'var(--color-sos)' : 'rgba(255, 255, 255, 0.8)',
            }}
          />
          {/* Bottom (6 o'clock) */}
          <div
            style={{
              position: 'absolute',
              bottom: '3px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '2px',
              height: '2px',
              borderRadius: '50%',
              backgroundColor: isPressing && progress > 50 ? 'var(--color-sos)' : 'rgba(255, 255, 255, 0.8)',
            }}
          />
          {/* Left (9 o'clock) */}
          <div
            style={{
              position: 'absolute',
              left: '3px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '2px',
              height: '2px',
              borderRadius: '50%',
              backgroundColor: isPressing && progress > 75 ? 'var(--color-sos)' : 'rgba(255, 255, 255, 0.8)',
            }}
          />
          {/* Right (3 o'clock) */}
          <div
            style={{
              position: 'absolute',
              right: '3px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '2px',
              height: '2px',
              borderRadius: '50%',
              backgroundColor: isPressing && progress > 25 ? 'var(--color-sos)' : 'rgba(255, 255, 255, 0.8)',
            }}
          />
        </div>

        {/* Tier 1: Outer Solid White Bezel Rim */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            width: '134px',
            height: '134px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            boxShadow: isPressing
              ? '0 4px 12px rgba(185, 111, 128, 0.28), 0 2px 4px rgba(40, 35, 38, 0.08)'
              : '0 12px 26px rgba(185, 111, 128, 0.22), 0 3px 6px rgba(40, 35, 38, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: isPressing ? 'scale(0.965)' : 'scale(1)',
            transition: 'transform 180ms cubic-bezier(0.2, 0, 0, 1), box-shadow 180ms cubic-bezier(0.2, 0, 0, 1)',
          }}
        >
          {/* Tier 2: Recessed Chamfer Step */}
          <div
            style={{
              width: '114px',
              height: '114px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-surface-soft)',
              border: '1px solid #EBD9DC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Tier 3: Center Solid Emergency Red Core */}
            <div
              style={{
                width: '92px',
                height: '92px',
                borderRadius: '50%',
                backgroundColor: isPressing ? 'var(--color-sos-deep)' : 'var(--color-sos)',
                border: '1.5px solid #AC2633',
                boxShadow: isPressing
                  ? 'inset 0 3px 6px rgba(0, 0, 0, 0.36), 0 3px 8px rgba(184, 40, 54, 0.3)'
                  : 'inset 0 2px 4px rgba(255, 255, 255, 0.25), inset 0 -2.5px 5px rgba(0, 0, 0, 0.2), 0 6px 14px rgba(184, 40, 54, 0.36)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                transition: 'background-color 140ms ease, box-shadow 140ms ease',
              }}
            >
              {/* SOS Typographic Monogram */}
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '20px',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  lineHeight: 1,
                  paddingLeft: '0.14em',
                  color: '#FFFFFF',
                  textShadow: '0 1px 2px rgba(0,0,0,0.18)',
                }}
              >
                SOS
              </span>

              {/* Hold Action Cue / Countdown */}
              <span
                style={{
                  marginTop: '3.5px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '7.5px',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                  opacity: 0.92,
                  lineHeight: 1,
                }}
              >
                {isPressing ? `${timeRemaining}s` : 'HOLD 3s'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
