import React, { useState } from 'react';
import {
  Watch,
  KeyRound,
  Radio,
  Plus,
  Battery,
  Bell,
  ChevronRight,
  X,
  Trash2,
  Check,
  Sliders,
  AlertCircle
} from 'lucide-react';

interface SafetyDevice {
  id: string;
  name: string;
  type: 'smartwatch' | 'keychain';
  status: 'connected' | 'disconnected' | 'not_responding';
  battery: number;
  lastSync: string;
  isPrimarySos: boolean;
}

const INITIAL_DEVICES: SafetyDevice[] = [
  {
    id: 'dev-1',
    name: 'Aura Watch Series 2',
    type: 'smartwatch',
    status: 'connected',
    battery: 84,
    lastSync: '2m ago',
    isPrimarySos: true,
  },
  {
    id: 'dev-2',
    name: 'Safety Keychain Tag',
    type: 'keychain',
    status: 'connected',
    battery: 92,
    lastSync: 'Just now',
    isPrimarySos: false,
  },
];

export const DevicesScreen: React.FC = () => {
  const [devices, setDevices] = useState<SafetyDevice[]>(INITIAL_DEVICES);

  // Alert Settings
  const [lowBatteryAlert, setLowBatteryAlert] = useState(true);
  const [disconnectAlert, setDisconnectAlert] = useState(true);
  const [syncAlert, setSyncAlert] = useState(false);

  // Preference Settings
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [autoReconnect, setAutoReconnect] = useState(true);

  // Modals & Sheets
  const [selectedDevice, setSelectedDevice] = useState<SafetyDevice | null>(null);
  const [isPairingOpen, setIsPairingOpen] = useState(false);
  const [unpairConfirmDevice, setUnpairConfirmDevice] = useState<SafetyDevice | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Handle Unpair Confirmation
  const handleConfirmUnpair = (deviceId: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== deviceId));
    setUnpairConfirmDevice(null);
    setSelectedDevice(null);
  };

  // Handle Setting Primary SOS Device
  const handleSetPrimary = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) => ({
        ...d,
        isPrimarySos: d.id === deviceId,
      }))
    );
    if (selectedDevice && selectedDevice.id === deviceId) {
      setSelectedDevice({ ...selectedDevice, isPrimarySos: true });
    }
  };

  // Handle Pairing Simulation
  const handleStartPairing = () => {
    setIsPairingOpen(true);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  const handleAddDevice = (type: 'smartwatch' | 'keychain') => {
    const newDevice: SafetyDevice = {
      id: `dev-${Date.now()}`,
      name: type === 'smartwatch' ? 'Aura Watch Series 2' : 'Safety Keychain Tag',
      type,
      status: 'connected',
      battery: 98,
      lastSync: 'Just now',
      isPrimarySos: devices.length === 0,
    };
    setDevices((prev) => [...prev, newDevice]);
    setIsPairingOpen(false);
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
          marginBottom: '20px',
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
            Devices
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '12px',
              color: 'var(--color-text-muted)',
              marginTop: '3px',
            }}
          >
            Connected safety devices
          </p>
        </div>

        {/* Minimal Add/Pair Device Button */}
        {devices.length > 0 && (
          <button
            onClick={handleStartPairing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              fontSize: '11.5px',
              fontWeight: 600,
              color: 'var(--color-rose-deep)',
              cursor: 'pointer',
              transition: 'background-color 140ms ease',
            }}
          >
            <Plus size={14} />
            <span>Pair Device</span>
          </button>
        )}
      </header>

      {/* ---------------- 1. CONNECTED DEVICES OR EMPTY STATE ---------------- */}
      {devices.length === 0 ? (
        /* Thoughtfully Designed No-Device-Connected State */
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '20px',
            border: '1px solid var(--color-border)',
            padding: '32px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(185, 111, 128, 0.04)',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-surface-soft)',
              border: '1px solid #EED8DC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-rose-deep)',
              marginBottom: '14px',
            }}
          >
            <Radio size={24} strokeWidth={1.8} />
          </div>

          <h2
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--color-text)',
              marginBottom: '6px',
            }}
          >
            No devices connected
          </h2>

          <p
            style={{
              fontSize: '12px',
              color: 'var(--color-text-muted)',
              lineHeight: 1.5,
              maxWidth: '260px',
              marginBottom: '18px',
            }}
          >
            Pair a smartwatch or dedicated safety beacon for instant tactile SOS triggers when your phone is out of reach.
          </p>

          <button
            onClick={handleStartPairing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-text)',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Plus size={15} />
            <span>Pair a Device</span>
          </button>
        </div>
      ) : (
        /* Connected Devices Group */
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
                fontWeight: 700,
                color: '#3B121C',
                letterSpacing: '0.02em',
              }}
            >
              Paired Hardware ({devices.length})
            </span>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.82)',
              borderRadius: '16px',
              border: '1px solid rgba(235, 218, 222, 0.7)',
              boxShadow: '0 2px 8px rgba(185, 111, 128, 0.04)',
              overflow: 'hidden',
            }}
          >
            {devices.map((device, idx) => {
              const isLast = idx === devices.length - 1;
              const DeviceIcon = device.type === 'smartwatch' ? Watch : KeyRound;

              return (
                <div
                  key={device.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedDevice(device)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderBottom: isLast ? 'none' : '1px solid var(--color-border-subtle)',
                    cursor: 'pointer',
                    transition: 'background-color 120ms ease',
                  }}
                >
                  {/* Left: Device Icon & Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--color-surface-soft)',
                        border: '1px solid #EED8DC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-rose-deep)',
                        flexShrink: 0,
                      }}
                    >
                      <DeviceIcon size={17} strokeWidth={1.8} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <p style={{ fontSize: '13.5px', fontWeight: 600, lineHeight: 1.2 }}>
                          {device.name}
                        </p>
                        {device.isPrimarySos && (
                          <span
                            style={{
                              fontSize: '9.5px',
                              fontWeight: 700,
                              color: 'var(--color-rose-deep)',
                              backgroundColor: 'var(--color-surface-soft)',
                              padding: '1px 5px',
                              borderRadius: '4px',
                            }}
                          >
                            Primary SOS
                          </span>
                        )}
                      </div>

                      {/* Battery & Last Sync */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '11px',
                          color: 'var(--color-text-muted)',
                          marginTop: '2.5px',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Battery size={13} color="var(--color-rose-deep)" />
                          {device.battery}%
                        </span>
                        <span>•</span>
                        <span>Synced {device.lastSync}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Connection Status Badge & Chevron */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 600,
                        color:
                          device.status === 'connected'
                            ? 'var(--color-rose-deep)'
                            : 'var(--color-error)',
                        backgroundColor:
                          device.status === 'connected'
                            ? 'var(--color-surface-soft)'
                            : '#FDF0F0',
                        border: '1px solid #EED8DC',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        textTransform: 'capitalize',
                      }}
                    >
                      {device.status}
                    </span>
                    <ChevronRight size={14} color="var(--color-text-muted)" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ---------------- 2. DEVICE ALERTS ---------------- */}
      <section style={{ marginBottom: '18px' }}>
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
            Device Alerts
          </span>
        </div>

        {/* Grouped Surface */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.82)',
            borderRadius: '16px',
            border: '1px solid rgba(235, 218, 222, 0.7)',
            boxShadow: '0 2px 8px rgba(185, 111, 128, 0.04)',
            overflow: 'hidden',
          }}
        >
          {/* Low Battery Alert */}
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
              <Battery size={16} color="var(--color-rose-deep)" strokeWidth={1.8} style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>Low Battery Warning</p>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Alert when device battery drops below 20%
                </p>
              </div>
            </div>

            <button
              role="switch"
              aria-checked={lowBatteryAlert}
              aria-label="Toggle Low Battery Warning"
              onClick={() => setLowBatteryAlert(!lowBatteryAlert)}
              style={{
                width: '38px',
                height: '22px',
                borderRadius: '11px',
                backgroundColor: lowBatteryAlert ? 'var(--color-rose-deep)' : '#E0D4D6',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 160ms ease-out',
                border: 'none',
                outline: 'none',
                flexShrink: 0,
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
                  left: lowBatteryAlert ? '18px' : '2px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
                  transition: 'left 160ms cubic-bezier(0.2, 0, 0, 1)',
                }}
              />
            </button>
          </div>

          {/* Disconnection Alert */}
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
              <Bell size={16} color="var(--color-rose-deep)" strokeWidth={1.8} style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>Disconnection Alert</p>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Notify if Bluetooth link drops unexpectedly
                </p>
              </div>
            </div>

            <button
              role="switch"
              aria-checked={disconnectAlert}
              aria-label="Toggle Disconnection Alert"
              onClick={() => setDisconnectAlert(!disconnectAlert)}
              style={{
                width: '38px',
                height: '22px',
                borderRadius: '11px',
                backgroundColor: disconnectAlert ? 'var(--color-rose-deep)' : '#E0D4D6',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 160ms ease-out',
                border: 'none',
                outline: 'none',
                flexShrink: 0,
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
                  left: disconnectAlert ? '18px' : '2px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
                  transition: 'left 160ms cubic-bezier(0.2, 0, 0, 1)',
                }}
              />
            </button>
          </div>

          {/* Sync Alerts */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Radio size={16} color="var(--color-rose-deep)" strokeWidth={1.8} style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>Sync Status Alerts</p>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Notify if beacon fails check-in over 1 hour
                </p>
              </div>
            </div>

            <button
              role="switch"
              aria-checked={syncAlert}
              aria-label="Toggle Sync Status Alert"
              onClick={() => setSyncAlert(!syncAlert)}
              style={{
                width: '38px',
                height: '22px',
                borderRadius: '11px',
                backgroundColor: syncAlert ? 'var(--color-rose-deep)' : '#E0D4D6',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 160ms ease-out',
                border: 'none',
                outline: 'none',
                flexShrink: 0,
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
                  left: syncAlert ? '18px' : '2px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
                  transition: 'left 160ms cubic-bezier(0.2, 0, 0, 1)',
                }}
              />
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- 3. DEVICE PREFERENCES ---------------- */}
      <section style={{ marginBottom: '8px' }}>
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
            Device Preferences
          </span>
        </div>

        {/* Grouped Surface */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.82)',
            borderRadius: '16px',
            border: '1px solid rgba(235, 218, 222, 0.7)',
            boxShadow: '0 2px 8px rgba(185, 111, 128, 0.04)',
            overflow: 'hidden',
          }}
        >
          {/* Primary SOS Device Selection */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              if (devices.length > 0) setSelectedDevice(devices[0]);
            }}
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
              <Sliders size={16} color="var(--color-rose-deep)" strokeWidth={1.8} style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '13px', fontWeight: 600 }}>Primary SOS Trigger</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                {devices.find((d) => d.isPrimarySos)?.name || 'None'}
              </span>
              <ChevronRight size={14} color="var(--color-text-muted)" />
            </div>
          </div>

          {/* Wearable Haptic Feedback */}
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
              <Bell size={16} color="var(--color-rose-deep)" strokeWidth={1.8} style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>Wearable Haptics</p>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Vibrate device on alert confirmation
                </p>
              </div>
            </div>

            <button
              role="switch"
              aria-checked={hapticFeedback}
              aria-label="Toggle Wearable Haptic Feedback"
              onClick={() => setHapticFeedback(!hapticFeedback)}
              style={{
                width: '38px',
                height: '22px',
                borderRadius: '11px',
                backgroundColor: hapticFeedback ? 'var(--color-rose-deep)' : '#E0D4D6',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 160ms ease-out',
                border: 'none',
                outline: 'none',
                flexShrink: 0,
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
                  left: hapticFeedback ? '18px' : '2px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
                  transition: 'left 160ms cubic-bezier(0.2, 0, 0, 1)',
                }}
              />
            </button>
          </div>

          {/* Auto Reconnect */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Radio size={16} color="var(--color-rose-deep)" strokeWidth={1.8} style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>Auto-Reconnect</p>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Restore connection when in range
                </p>
              </div>
            </div>

            <button
              role="switch"
              aria-checked={autoReconnect}
              aria-label="Toggle Auto-Reconnect"
              onClick={() => setAutoReconnect(!autoReconnect)}
              style={{
                width: '38px',
                height: '22px',
                borderRadius: '11px',
                backgroundColor: autoReconnect ? 'var(--color-rose-deep)' : '#E0D4D6',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 160ms ease-out',
                border: 'none',
                outline: 'none',
                flexShrink: 0,
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
                  left: autoReconnect ? '18px' : '2px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
                  transition: 'left 160ms cubic-bezier(0.2, 0, 0, 1)',
                }}
              />
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- MANAGE DEVICE DETAIL SHEET ---------------- */}
      {selectedDevice && (
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
          onClick={() => setSelectedDevice(null)}
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
            {/* Sheet Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--color-surface-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-rose-deep)',
                  }}
                >
                  {selectedDevice.type === 'smartwatch' ? (
                    <Watch size={20} strokeWidth={1.8} />
                  ) : (
                    <KeyRound size={20} strokeWidth={1.8} />
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700 }}>{selectedDevice.name}</h3>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    Bluetooth 5.3 Low Energy • Linked
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDevice(null)}
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

            {/* Device Detail Metrics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  backgroundColor: 'var(--color-surface-soft)',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Battery</span>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)', marginTop: '2px' }}>
                  {selectedDevice.battery}% Charged
                </p>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--color-surface-soft)',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Status</span>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--color-rose-deep)',
                    marginTop: '2px',
                    textTransform: 'capitalize',
                  }}
                >
                  {selectedDevice.status}
                </p>
              </div>
            </div>

            {/* Set as Primary Action */}
            {!selectedDevice.isPrimarySos && (
              <button
                onClick={() => handleSetPrimary(selectedDevice.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '11px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-surface-soft)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-rose-deep)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginBottom: '10px',
                }}
              >
                <Check size={15} />
                <span>Set as Primary SOS Trigger</span>
              </button>
            )}

            {/* Unpair Device Action with Confirmation */}
            <button
              onClick={() => setUnpairConfirmDevice(selectedDevice)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '11px',
                borderRadius: '12px',
                backgroundColor: '#FDF0F0',
                border: '1px solid #F3D2D5',
                color: 'var(--color-error)',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Trash2 size={15} />
              <span>Unpair Device</span>
            </button>
          </div>
        </div>
      )}

      {/* ---------------- UNPAIR CONFIRMATION DIALOG ---------------- */}
      {unpairConfirmDevice && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 70,
            backgroundColor: 'rgba(40, 35, 38, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setUnpairConfirmDevice(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '22px 20px',
              width: '100%',
              maxWidth: '300px',
              textAlign: 'center',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#FDF0F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-error)',
                margin: '0 auto 12px',
              }}
            >
              <AlertCircle size={22} />
            </div>

            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '6px' }}>
              Unpair {unpairConfirmDevice.name}?
            </h3>

            <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', lineHeight: 1.45, marginBottom: '18px' }}>
              This wearable will no longer be able to initiate emergency SOS alerts or transmit telemetry.
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setUnpairConfirmDevice(null)}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-surface-soft)',
                  border: '1px solid var(--color-border)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmUnpair(unpairConfirmDevice.id)}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-error)',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Unpair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- PAIR DEVICE SHEET ---------------- */}
      {isPairingOpen && (
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
          onClick={() => setIsPairingOpen(false)}
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
            {/* Sheet Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Pair Safety Device</h3>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  {isScanning ? 'Scanning for nearby hardware...' : 'Select a device to connect'}
                </p>
              </div>

              <button
                onClick={() => setIsPairingOpen(false)}
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

            {/* Discovered Hardware List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-surface-soft)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Watch size={18} color="var(--color-rose-deep)" />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600 }}>Aura Watch Series 2</p>
                    <p style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>Nearby • Ready to pair</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddDevice('smartwatch')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-text)',
                    color: '#FFFFFF',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Connect
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-surface-soft)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <KeyRound size={18} color="var(--color-rose-deep)" />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600 }}>Safety Keychain Tag</p>
                    <p style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>Nearby • Beacon discovered</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddDevice('keychain')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-text)',
                    color: '#FFFFFF',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Connect
                </button>
              </div>
            </div>

            <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
              Ensure your accessory has Bluetooth turned on and is within 1 meter.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
