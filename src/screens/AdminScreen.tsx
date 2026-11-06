/**
 * AdminScreen — control panel for the "admin phone".
 * Open via: http://<ip>:5173/?tab=admin
 *
 * Pressing any button here sends a command to the Node bridge (server.cjs)
 * which broadcasts the new state to ALL connected devices via SSE.
 */
import React, { useEffect, useState } from 'react';
import { arduinoSerial, type ArduinoStatus } from '../services/arduinoSerial';

export const AdminScreen: React.FC = () => {
  const [status, setStatus] = useState<ArduinoStatus>(arduinoSerial.getStatus());
  const [loading, setLoading] = useState<string | null>(null); // which button is pending

  useEffect(() => {
    const unsub = arduinoSerial.subscribe((s) => setStatus(s));
    return () => unsub();
  }, []);

  const busy = loading !== null;

  async function triggerSos() {
    setLoading('sos');
    await arduinoSerial.sendSos();
    setLoading(null);
  }

  async function cancelEmergency() {
    setLoading('cancel');
    await arduinoSerial.cancelEmergency();
    setLoading(null);
  }

  async function markReady() {
    setLoading('ready');
    await arduinoSerial.markAsReady();
    setLoading(null);
  }

  async function reconnect() {
    setLoading('connect');
    await arduinoSerial.connect(true);
    setLoading(null);
  }

  /* ── Status dot colour ─────────────────────────────────────── */
  const dotColor = status.state === 'error'
    ? '#C83F4B'
    : status.state === 'active'
      ? '#C83F4B'
      : status.state === 'ready'
        ? '#2C8C5A'
        : '#F59E0B';

  const sosBtnDisabled = busy || !status.isReady || status.isSosActive;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#F9F1F2',
      overflowY: 'auto',
      paddingTop: 'calc(28px + env(safe-area-inset-top, 0px))',
      paddingBottom: 'calc(28px + env(safe-area-inset-bottom, 0px))',
      paddingLeft: '20px',
      paddingRight: '20px',
      gap: '0px',
    }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <span style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '0.03em', color: '#2D1B1E' }}>
          🛡 Admin Panel
        </span>
        <p style={{ fontSize: '12px', color: '#8C6B72', marginTop: '4px' }}>
          Actions here sync to all connected devices
        </p>
      </div>

      {/* ── Status card ────────────────────────────────────────── */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #EDD8DC',
        borderRadius: '16px',
        padding: '14px 18px',
        marginBottom: '22px',
      }}>
        <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8C6B72', marginBottom: '6px' }}>
          Arduino Status
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* animated dot */}
          <span style={{
            width: '10px', height: '10px', borderRadius: '50%',
            backgroundColor: dotColor, flexShrink: 0,
            boxShadow: status.state === 'active' ? `0 0 0 3px ${dotColor}33` : 'none',
            animation: (status.state === 'connecting' || status.state === 'active') ? 'pulse-dot 1.3s ease-in-out infinite' : 'none',
          }} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#2D1B1E', flex: 1 }}>
            {status.displayMessage}
          </span>
        </div>
        {status.rawStatusLine ? (
          <p style={{ fontSize: '10px', fontFamily: 'monospace', color: '#8C6B72', marginTop: '5px', wordBreak: 'break-all' }}>
            ↳ {status.rawStatusLine}
          </p>
        ) : null}
      </div>

      {/* ── Action buttons ─────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* TRIGGER SOS */}
        <button
          onClick={triggerSos}
          disabled={sosBtnDisabled}
          style={{
            width: '100%', padding: '22px 16px',
            backgroundColor: sosBtnDisabled ? '#E8CCCE' : '#C83F4B',
            color: '#fff', border: 'none', borderRadius: '18px',
            fontSize: '20px', fontWeight: 900, letterSpacing: '0.04em',
            cursor: sosBtnDisabled ? 'not-allowed' : 'pointer',
            opacity: sosBtnDisabled ? 0.55 : 1,
            transition: 'opacity 0.2s, transform 0.1s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          }}
          onMouseDown={e => { if (!sosBtnDisabled) (e.currentTarget.style.transform = 'scale(0.97)'); }}
          onMouseUp={e => { (e.currentTarget.style.transform = 'scale(1)'); }}
          onTouchStart={e => { if (!sosBtnDisabled) (e.currentTarget.style.transform = 'scale(0.97)'); }}
          onTouchEnd={e => { (e.currentTarget.style.transform = 'scale(1)'); }}
        >
          {loading === 'sos' ? '⏳ Sending...' : '🚨 TRIGGER SOS'}
        </button>

        {/* CANCEL EMERGENCY */}
        <button
          onClick={cancelEmergency}
          disabled={busy}
          style={{
            width: '100%', padding: '18px 16px',
            backgroundColor: '#FFF0F1',
            color: '#C83F4B', border: '1.5px solid #EDD8DC', borderRadius: '14px',
            fontSize: '17px', fontWeight: 800,
            cursor: busy ? 'not-allowed' : 'pointer',
            opacity: busy ? 0.5 : 1,
            transition: 'opacity 0.2s, transform 0.1s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
          onMouseDown={e => { if (!busy) (e.currentTarget.style.transform = 'scale(0.97)'); }}
          onMouseUp={e => { (e.currentTarget.style.transform = 'scale(1)'); }}
          onTouchStart={e => { if (!busy) (e.currentTarget.style.transform = 'scale(0.97)'); }}
          onTouchEnd={e => { (e.currentTarget.style.transform = 'scale(1)'); }}
        >
          {loading === 'cancel' ? '⏳ Cancelling...' : '✕  Cancel Emergency'}
        </button>

        {/* MARK DEVICE READY */}
        <button
          onClick={markReady}
          disabled={busy}
          style={{
            width: '100%', padding: '18px 16px',
            backgroundColor: '#E8F4EE',
            color: '#2C8C5A', border: '1.5px solid #C4E0D0', borderRadius: '14px',
            fontSize: '17px', fontWeight: 800,
            cursor: busy ? 'not-allowed' : 'pointer',
            opacity: busy ? 0.5 : 1,
            transition: 'opacity 0.2s, transform 0.1s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
          onMouseDown={e => { if (!busy) (e.currentTarget.style.transform = 'scale(0.97)'); }}
          onMouseUp={e => { (e.currentTarget.style.transform = 'scale(1)'); }}
          onTouchStart={e => { if (!busy) (e.currentTarget.style.transform = 'scale(0.97)'); }}
          onTouchEnd={e => { (e.currentTarget.style.transform = 'scale(1)'); }}
        >
          {loading === 'ready' ? '⏳ Setting...' : '✓  Mark Device Ready'}
        </button>

        {/* RECONNECT ARDUINO */}
        <button
          onClick={reconnect}
          disabled={busy}
          style={{
            width: '100%', padding: '14px 16px',
            backgroundColor: 'transparent',
            color: '#8C6B72', border: '1px solid #EDD8DC', borderRadius: '12px',
            fontSize: '14px', fontWeight: 700,
            cursor: busy ? 'not-allowed' : 'pointer',
            opacity: busy ? 0.5 : 1,
            transition: 'opacity 0.2s, transform 0.1s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}
          onMouseDown={e => { if (!busy) (e.currentTarget.style.transform = 'scale(0.97)'); }}
          onMouseUp={e => { (e.currentTarget.style.transform = 'scale(1)'); }}
          onTouchStart={e => { if (!busy) (e.currentTarget.style.transform = 'scale(0.97)'); }}
          onTouchEnd={e => { (e.currentTarget.style.transform = 'scale(1)'); }}
        >
          {loading === 'connect' ? '⏳ Connecting...' : '↺  Reconnect Arduino (COM9)'}
        </button>
      </div>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <p style={{ marginTop: 'auto', paddingTop: '28px', textAlign: 'center', fontSize: '11px', color: '#B89BA0' }}>
        Admin · all actions broadcast to every connected device
      </p>

      {/* Pulse animation keyframe injected inline */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

