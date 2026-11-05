import React, { useState } from 'react';
import {
  Mic,
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
  Volume2
} from 'lucide-react';

export const MySafetyScreen: React.FC = () => {
  // Three vertical layout toggles
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [shakeEnabled, setShakeEnabled] = useState<boolean>(true);
  const [criticalAlertsEnabled, setCriticalAlertsEnabled] = useState<boolean>(true);

  // Modal sheet state for navigation rows
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Fake call state
  const [fakeCallTimer, setFakeCallTimer] = useState<number | null>(null);

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
      <header style={{ marginBottom: '16px', paddingLeft: '4px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            fontWeight: 600,
            lineHeight: 1.15,
            color: 'var(--color-text)',
          }}
        >
          My Safety
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '12px',
            color: '#655358',
            marginTop: '3px',
          }}
        >
          Emergency configuration & trusted circle
        </p>
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
            Trusted Contacts (2)
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
            Manage
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
                ML
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.2 }}>Maya Lin</p>
                <p style={{ fontSize: '11px', color: '#655358', marginTop: '2px' }}>
                  Sister • +1 (555) 392-1048
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
              Alerts active
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
                DK
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.2 }}>David K.</p>
                <p style={{ fontSize: '11px', color: '#655358', marginTop: '2px' }}>
                  Partner • +1 (555) 720-9112
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
              Alerts active
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
            Instant Triggers
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
          {/* Vertical Toggle 1: Voice Trigger */}
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
            <Mic size={17} strokeWidth={1.8} color="var(--color-rose-deep)" />

            {/* Setting name and short description underneath */}
            <p style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-text)', marginTop: '6px', lineHeight: 1.15 }}>
              Voice Trigger
            </p>
            <p style={{ fontSize: '9.5px', color: '#655358', marginTop: '2px', lineHeight: 1.2 }}>
              "Aura, help"
            </p>

            {/* Toggle switch at the bottom */}
            <button
              role="switch"
              aria-checked={voiceEnabled}
              aria-label="Toggle Voice Trigger"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              style={{
                marginTop: '10px',
                width: '34px',
                height: '20px',
                borderRadius: '10px',
                backgroundColor: voiceEnabled ? 'var(--color-rose-deep)' : '#E0D4D6',
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
                  left: voiceEnabled ? '16px' : '2px',
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
              Shake Detect
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
              Critical Alerts
            </p>
            <p style={{ fontSize: '9.5px', color: '#655358', marginTop: '2px', lineHeight: 1.2 }}>
              Bypass DND
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
            Protocols & Tools
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
                <p style={{ fontSize: '13px', fontWeight: 600 }}>Safety Timer</p>
                <p style={{ fontSize: '11px', color: '#655358' }}>Automatic check-in alert</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#655358' }}>Off</span>
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
                <p style={{ fontSize: '13px', fontWeight: 600 }}>Fake Call Decoy</p>
                <p style={{ fontSize: '11px', color: '#655358' }}>
                  {fakeCallTimer ? `Calling in ${fakeCallTimer}s...` : 'Simulate incoming call to exit safely'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: fakeCallTimer ? 'var(--color-rose-deep)' : '#655358' }}>
                {fakeCallTimer ? 'Active' : 'Ready'}
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
                <p style={{ fontSize: '13px', fontWeight: 600 }}>Emergency PIN Protection</p>
                <p style={{ fontSize: '11px', color: '#655358' }}>Required to cancel active SOS</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#655358' }}>Configured</span>
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
            Records & Evidence
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
                <p style={{ fontSize: '13px', fontWeight: 600 }}>Recording Preferences</p>
                <p style={{ fontSize: '11px', color: '#655358' }}>Ambient audio & GPS tracking</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#655358' }}>Audio & GPS</span>
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
                <p style={{ fontSize: '13px', fontWeight: 600 }}>Incident Reports</p>
                <p style={{ fontSize: '11px', color: '#655358' }}>Historical emergency logs</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#655358' }}>None logged</span>
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
                <p style={{ fontSize: '13px', fontWeight: 600 }}>Evidence Vault</p>
                <p style={{ fontSize: '11px', color: '#655358' }}>Encrypted recordings repository</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#655358' }}>0 recordings</span>
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
              padding: '20px',
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

            {/* Modal Content: Contacts */}
            {activeModal === 'contacts' && (
              <div>
                <p style={{ fontSize: '12px', color: '#655358', marginBottom: '14px', lineHeight: 1.45 }}>
                  Trusted contacts receive instant SMS coordinates and a dispatch alert when SOS triggers.
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
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600 }}>Maya Lin (Sister)</p>
                      <p style={{ fontSize: '10.5px', color: '#655358' }}>+1 (555) 392-1048 • SMS & Call</p>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-rose-deep)' }}>
                      Verified
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--color-surface-soft)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600 }}>David K. (Partner)</p>
                      <p style={{ fontSize: '10.5px', color: '#655358' }}>+1 (555) 720-9112 • SMS & Call</p>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-rose-deep)' }}>
                      Verified
                    </span>
                  </div>
                </div>

                <button
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
                Done
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
