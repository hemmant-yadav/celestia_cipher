import React, { useState } from 'react';
import {
  Mic,
  Activity,
  Timer,
  Lock,
  Bell,
  FileText,
  Disc,
  ChevronRight,
  ShieldAlert,
  X,
  Plus
} from 'lucide-react';

export const MySafetyScreen: React.FC = () => {
  // SOS Preferences Toggles
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [shakeEnabled, setShakeEnabled] = useState(true);

  // Privacy Permissions Toggles
  const [criticalAlertsEnabled, setCriticalAlertsEnabled] = useState(true);

  // Modal states for interactive feel
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: 'var(--color-canvas)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        color: 'var(--color-text)',
        paddingTop: 'calc(18px + env(safe-area-inset-top, 0px))',
        paddingBottom: 'calc(74px + env(safe-area-inset-bottom, 0px))',
        paddingLeft: '16px',
        paddingRight: '16px',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Screen Editorial Header */}
      <header style={{ marginBottom: '20px', paddingLeft: '4px' }}>
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
            color: 'var(--color-text-muted)',
            marginTop: '3px',
          }}
        >
          Emergency configuration & trusted circle
        </p>
      </header>

      {/* ---------------- 1. TRUSTED CONTACTS ---------------- */}
      <section style={{ marginBottom: '18px' }}>
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
              fontWeight: 600,
              color: 'var(--color-rose-deep)',
              letterSpacing: '0.02em',
            }}
          >
            Trusted Contacts
          </span>
          <button
            onClick={() => setActiveModal('contacts')}
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-rose-deep)',
              cursor: 'pointer',
              padding: '2px 6px',
            }}
          >
            Manage
          </button>
        </div>

        {/* Grouped Surface */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '16px',
            border: '1px solid var(--color-border)',
            boxShadow: '0 2px 8px rgba(185, 111, 128, 0.04)',
            overflow: 'hidden',
          }}
        >
          {/* Contact 1 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-soft)',
                  border: '1px solid #EED8DC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: 'var(--color-rose-deep)',
                }}
              >
                ML
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.2 }}>Maya Lin</p>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  Sister • +1 (555) 392-1048
                </p>
              </div>
            </div>

            {/* Restrained soft rose status badge */}
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 600,
                color: 'var(--color-rose-deep)',
                backgroundColor: 'var(--color-surface-soft)',
                border: '1px solid #EED8DC',
                padding: '3px 8px',
                borderRadius: '6px',
              }}
            >
              Alerts active
            </span>
          </div>

          {/* Contact 2 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface-soft)',
                  border: '1px solid #EED8DC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: 'var(--color-rose-deep)',
                }}
              >
                DK
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.2 }}>David K.</p>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  Partner • +1 (555) 720-9112
                </p>
              </div>
            </div>

            {/* Restrained soft rose status badge */}
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 600,
                color: 'var(--color-rose-deep)',
                backgroundColor: 'var(--color-surface-soft)',
                border: '1px solid #EED8DC',
                padding: '3px 8px',
                borderRadius: '6px',
              }}
            >
              Alerts active
            </span>
          </div>
        </div>
      </section>

      {/* ---------------- 2. SOS PREFERENCES ---------------- */}
      <section style={{ marginBottom: '18px' }}>
        <div style={{ marginBottom: '7px', paddingLeft: '4px' }}>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-rose-deep)',
              letterSpacing: '0.02em',
            }}
          >
            SOS Preferences
          </span>
        </div>

        {/* Grouped Surface */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '16px',
            border: '1px solid var(--color-border)',
            boxShadow: '0 2px 8px rgba(185, 111, 128, 0.04)',
            overflow: 'hidden',
          }}
        >
          {/* Voice Trigger Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-surface-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Mic size={15} color="var(--color-rose-deep)" strokeWidth={1.8} />
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>Voice Trigger</p>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>"Aura, assistance"</p>
              </div>
            </div>

            {/* Custom Toggle Switch */}
            <button
              role="switch"
              aria-checked={voiceEnabled}
              aria-label="Toggle Voice Trigger"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              style={{
                width: '38px',
                height: '22px',
                borderRadius: '11px',
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
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  position: 'absolute',
                  top: '2px',
                  left: voiceEnabled ? '18px' : '2px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
                  transition: 'left 160ms cubic-bezier(0.2, 0, 0, 1)',
                }}
              />
            </button>
          </div>

          {/* Shake Detection Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-surface-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Activity size={15} color="var(--color-rose-deep)" strokeWidth={1.8} />
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>Shake Detection</p>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Rapid multi-shake trigger</p>
              </div>
            </div>

            {/* Custom Toggle Switch */}
            <button
              role="switch"
              aria-checked={shakeEnabled}
              aria-label="Toggle Shake Detection"
              onClick={() => setShakeEnabled(!shakeEnabled)}
              style={{
                width: '38px',
                height: '22px',
                borderRadius: '11px',
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
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  position: 'absolute',
                  top: '2px',
                  left: shakeEnabled ? '18px' : '2px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
                  transition: 'left 160ms cubic-bezier(0.2, 0, 0, 1)',
                }}
              />
            </button>
          </div>

          {/* Safety Check-in Timer */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setActiveModal('timer')}
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
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-surface-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Timer size={15} color="var(--color-rose-deep)" strokeWidth={1.8} />
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>Safety Timer</p>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Automatic check-in alert</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Off</span>
              <ChevronRight size={14} color="var(--color-text-muted)" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 3. PRIVACY & PERMISSIONS ---------------- */}
      <section style={{ marginBottom: '18px' }}>
        <div style={{ marginBottom: '7px', paddingLeft: '4px' }}>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-rose-deep)',
              letterSpacing: '0.02em',
            }}
          >
            Privacy & App Permissions
          </span>
        </div>

        {/* Grouped Surface */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '16px',
            border: '1px solid var(--color-border)',
            boxShadow: '0 2px 8px rgba(185, 111, 128, 0.04)',
            overflow: 'hidden',
          }}
        >
          {/* Emergency PIN Protection */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setActiveModal('pin')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
              borderBottom: '1px solid var(--color-border-subtle)',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-surface-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Lock size={15} color="var(--color-rose-deep)" strokeWidth={1.8} />
              </div>
              <p style={{ fontSize: '13px', fontWeight: 600 }}>Emergency PIN Protection</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Configured</span>
              <ChevronRight size={14} color="var(--color-text-muted)" />
            </div>
          </div>

          {/* Critical Alert Permissions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-surface-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bell size={15} color="var(--color-rose-deep)" strokeWidth={1.8} />
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>Critical Alerts</p>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Bypass Do Not Disturb</p>
              </div>
            </div>

            {/* Custom Toggle Switch */}
            <button
              role="switch"
              aria-checked={criticalAlertsEnabled}
              aria-label="Toggle Critical Alerts"
              onClick={() => setCriticalAlertsEnabled(!criticalAlertsEnabled)}
              style={{
                width: '38px',
                height: '22px',
                borderRadius: '11px',
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
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  position: 'absolute',
                  top: '2px',
                  left: criticalAlertsEnabled ? '18px' : '2px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
                  transition: 'left 160ms cubic-bezier(0.2, 0, 0, 1)',
                }}
              />
            </button>
          </div>

          {/* Recording & Evidence Preferences */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setActiveModal('recording')}
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
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-surface-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Disc size={15} color="var(--color-rose-deep)" strokeWidth={1.8} />
              </div>
              <p style={{ fontSize: '13px', fontWeight: 600 }}>Recording Preferences</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Audio & GPS</span>
              <ChevronRight size={14} color="var(--color-text-muted)" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4. SAFETY HISTORY ---------------- */}
      <section style={{ marginBottom: '8px' }}>
        <div style={{ marginBottom: '7px', paddingLeft: '4px' }}>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-rose-deep)',
              letterSpacing: '0.02em',
            }}
          >
            Safety History
          </span>
        </div>

        {/* Grouped Surface */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '16px',
            border: '1px solid var(--color-border)',
            boxShadow: '0 2px 8px rgba(185, 111, 128, 0.04)',
            overflow: 'hidden',
          }}
        >
          {/* Incident Reports */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setActiveModal('history')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
              borderBottom: '1px solid var(--color-border-subtle)',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-surface-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FileText size={15} color="var(--color-rose-deep)" strokeWidth={1.8} />
              </div>
              <p style={{ fontSize: '13px', fontWeight: 600 }}>Incident Reports</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>None logged</span>
              <ChevronRight size={14} color="var(--color-text-muted)" />
            </div>
          </div>

          {/* Evidence Vault / Previous Recordings */}
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
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-surface-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShieldAlert size={15} color="var(--color-rose-deep)" strokeWidth={1.8} />
              </div>
              <p style={{ fontSize: '13px', fontWeight: 600 }}>Evidence Vault</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>0 recordings</span>
              <ChevronRight size={14} color="var(--color-text-muted)" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- INTERACTIVE DETAIL MODAL SHEET ---------------- */}
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
              maxHeight: '75%',
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
                marginBottom: '16px',
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>
                {activeModal === 'contacts' && 'Manage Trusted Contacts'}
                {activeModal === 'timer' && 'Safety Check-in Timer'}
                {activeModal === 'pin' && 'Emergency PIN'}
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

            {/* Modal Content */}
            {activeModal === 'contacts' && (
              <div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
                  Trusted contacts receive automated SMS alerts with your real-time GPS location when SOS triggers.
                </p>
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
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: 'var(--color-rose-deep)',
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={15} /> Add Trusted Contact
                </button>
              </div>
            )}

            {activeModal === 'timer' && (
              <div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
                  If you do not check in before the timer expires, an automatic alert is dispatched to your trusted contacts.
                </p>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  {['15 min', '30 min', '1 hour', '2 hours'].map((t) => (
                    <button
                      key={t}
                      style={{
                        flex: 1,
                        padding: '8px 0',
                        borderRadius: '8px',
                        backgroundColor: 'var(--color-surface-soft)',
                        border: '1px solid var(--color-border)',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'var(--color-text)',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(activeModal === 'pin' || activeModal === 'recording' || activeModal === 'history' || activeModal === 'vault') && (
              <div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
                  {activeModal === 'pin' && 'Your 4-digit PIN is required to cancel active SOS mode and prevent forced deactivation.'}
                  {activeModal === 'recording' && 'Ambient audio and GPS breadcrumbs are stored in an encrypted local sandbox during active emergencies.'}
                  {activeModal === 'history' && 'No emergency incidents have occurred in the past 90 days.'}
                  {activeModal === 'vault' && 'No emergency audio or video recordings stored on device.'}
                </p>
              </div>
            )}

            <button
              onClick={() => setActiveModal(null)}
              style={{
                width: '100%',
                marginTop: '10px',
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
          </div>
        </div>
      )}
    </div>
  );
};
