/**
 * Arduino Uno + SIM800L Emergency Serial Controller
 * Multi-Device Real-Time Sync (Laptop + Phone over same Wi-Fi)
 */

import { contactSettings } from './contactSettings';

export const ARDUINO_CONFIG = {
  defaultPort: 'COM9',
  baudRate: 9600,
  bootTimeoutMs: 25000,
};

export type SerialState = 'disconnected' | 'connecting' | 'ready' | 'active' | 'error';

export interface ArduinoStatus {
  state: SerialState;
  isReady: boolean;
  isSosActive: boolean;
  rawStatusLine: string;
  displayMessage: string;
  errorMessage?: string;
  portLabel: string;
}

export type StatusListener = (status: ArduinoStatus) => void;

function getBridgeUrl(): string {
  if (typeof window !== 'undefined' && window.location.hostname) {
    return `http://${window.location.hostname}:3001`;
  }
  return 'http://127.0.0.1:3001';
}

class ArduinoSerialService {
  private state: SerialState = 'connecting';
  private isReady = false;
  private isSosActive = false;
  private rawStatusLine = '';
  private displayMessage = 'Connecting to Arduino on ' + ARDUINO_CONFIG.defaultPort + '...';
  private errorMessage = '';
  private portLabel = ARDUINO_CONFIG.defaultPort;

  private eventSource: EventSource | null = null;
  private listeners = new Set<StatusListener>();

  constructor() {
    this.connectBridge();
  }

  public subscribe(listener: StatusListener): () => void {
    this.listeners.add(listener);
    listener(this.getStatus());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getStatus(): ArduinoStatus {
    return {
      state: this.state,
      isReady: this.isReady,
      isSosActive: this.isSosActive,
      rawStatusLine: this.rawStatusLine,
      displayMessage: this.displayMessage,
      errorMessage: this.errorMessage || undefined,
      portLabel: this.portLabel,
    };
  }

  private notify() {
    const current = this.getStatus();
    this.listeners.forEach((cb) => {
      try {
        cb(current);
      } catch (e) {
        console.error('[SERIAL] Listener error:', e);
      }
    });
  }

  /**
   * Connect to the multi-device SSE event stream (/api/events)
   * Synced across all connected devices (laptop + phone)
   */
  public connectBridge() {
    if (typeof window === 'undefined') return;

    if (this.eventSource) {
      this.eventSource.close();
    }

    try {
      const url = `${getBridgeUrl()}/api/events`;
      console.log('[SERIAL SYNC] Connecting to bridge at', url);
      this.eventSource = new EventSource(url);

      this.eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'sync' && payload.state) {
            const s = payload.state;
            this.isReady = s.isReady;
            this.isSosActive = s.isEmergencyActive;
            this.rawStatusLine = s.rawStatusLine || '';
            this.displayMessage = s.displayMessage || (s.isReady ? 'Device ready' : 'Connecting...');
            this.portLabel = s.portLabel || ARDUINO_CONFIG.defaultPort;

            if (s.error) {
              this.state = 'error';
              this.errorMessage = s.error;
            } else if (s.isEmergencyActive) {
              this.state = 'active';
              this.errorMessage = '';
            } else if (s.isReady) {
              this.state = 'ready';
              this.errorMessage = '';
            } else {
              this.state = 'connecting';
              this.errorMessage = '';
            }

            this.notify();
          }
        } catch (e) {
          console.warn('[SERIAL SYNC] Parse error:', e);
        }
      };

      this.eventSource.onerror = () => {
        if (this.state !== 'ready') {
          this.state = 'connecting';
          this.displayMessage = 'Connecting to Arduino bridge on ' + getBridgeUrl() + '...';
          this.notify();
        }
      };
    } catch (e) {
      console.warn('[SERIAL SYNC] EventSource error:', e);
    }
  }

  /**
   * Trigger SOS from ANY device (phone or laptop)
   * Sends user's live GPS coordinates to include in SMS and Google Maps link
   */
  public async sendSos(customCoords?: { lat: number; lng: number }): Promise<boolean> {
    try {
      this.isSosActive = true;
      this.state = 'active';
      this.displayMessage = 'Sending SOS trigger to Arduino...';
      this.notify();

      let coords = customCoords || { lat: 12.8867, lng: 77.4503 };

      // If no custom coordinates provided, attempt to fetch live browser/phone GPS
      if (!customCoords && typeof navigator !== 'undefined' && navigator.geolocation) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 2500,
              maximumAge: 10000,
              enableHighAccuracy: true,
            });
          });
          coords = {
            lat: parseFloat(pos.coords.latitude.toFixed(4)),
            lng: parseFloat(pos.coords.longitude.toFixed(4)),
          };
        } catch {
          // Keep default RRCE / Bengaluru coordinates
        }
      }

      const contacts = contactSettings.getContacts();
      const payload = {
        lat: coords.lat,
        lng: coords.lng,
        phone: contacts.primaryPhone,
        phone2: contacts.secondaryPhone || undefined,
      };

      const res = await fetch(`${getBridgeUrl()}/api/sos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      return res.ok;
    } catch (err) {
      console.error('[SERIAL] SOS trigger error:', err);
      return false;
    }
  }

  /**
   * Cancel emergency mode from ANY device (phone or laptop)
   */
  public async cancelEmergency(): Promise<boolean> {
    try {
      this.isSosActive = false;
      this.notify();

      const res = await fetch(`${getBridgeUrl()}/api/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      return res.ok;
    } catch (err) {
      console.error('[SERIAL] Cancel error:', err);
      return false;
    }
  }

  /**
   * Mark device as ready manually
   */
  public async markAsReady(): Promise<void> {
    try {
      await fetch(`${getBridgeUrl()}/api/mark-ready`, { method: 'POST' });
    } catch {
      this.isReady = true;
      this.state = 'ready';
      this.displayMessage = 'Device ready (confirmed)';
      this.notify();
    }
  }

  /**
   * Reconnect or open port
   */
  public async connect(_force?: boolean): Promise<boolean> {
    try {
      await fetch(`${getBridgeUrl()}/api/connect`, { method: 'POST' });
      return true;
    } catch {
      return false;
    }
  }
}

export const arduinoSerial = new ArduinoSerialService();
