/**
 * Voice-Activated Emergency Detection Engine
 * Uses local Speech Recognition with complete-word boundary matching.
 * Connects directly to backend Arduino + SIM800L SOS workflow.
 */

import { arduinoSerial } from './arduinoSerial';

export type VoiceSosState =
  | 'disabled'            // Turned off in settings
  | 'listening'           // Active microphone listening for keywords
  | 'permission_required' // Permission prompt required
  | 'permission_denied'   // User blocked microphone access
  | 'unsupported'         // Browser lacks Web Speech API
  | 'error'               // Audio capture or hardware error
  | 'triggered';          // Emergency keyword spotted, SOS fired

export interface VoiceSosConfig {
  enabled: boolean;
  sensitivity: 'high' | 'medium' | 'low';
  customPhrases: string[];
}

export interface VoiceTriggerEvent {
  eventId: string;
  matchedPhrase: string;
  fullTranscript: string;
  confidence: number;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
}

export type VoiceSosListener = (state: VoiceSosState, lastEvent?: VoiceTriggerEvent) => void;

// Default Standalone Emergency Keywords (Multilingual: English, Hindi, Kannada, Telugu, Tamil)
export const DEFAULT_STANDALONE_KEYWORDS = [
  'help',
  'danger',
  'rescue',
  'emergency',
  'madad',
  'bachao',
  'sahaya',
  'kaapadi',
  'sahayam',
  'udhavi',
  'मदद',
  'बचाओ',
  'ಕಾಪಾಡಿ',
  'ಸಹಾಯ',
  'సహాయం',
  'కాపాడండి',
  'காப்பாத்து',
  'உதவி',
];

// Default Natural Emergency Phrases
export const DEFAULT_NATURAL_PHRASES = [
  'help me',
  'i need help',
  "i'm in danger",
  'im in danger',
  'call for help',
  'meri madad karo',
  'nanna kaapadi',
  'naaku sahayam kavali',
  'enakku udhavi thevai',
];

const STORAGE_KEY_CONFIG = 'safealert_voice_sos_config';
const STORAGE_KEY_LAST_EVENT = 'safealert_last_voice_trigger';

class VoiceSosService {
  private state: VoiceSosState = 'disabled';
  private config: VoiceSosConfig = {
    enabled: true, // Always ON by default
    sensitivity: 'medium',
    customPhrases: [],
  };

  private recognition: any = null;
  private isRestarting = false;
  private lastTriggerTimestamp = 0;
  private listeners = new Set<VoiceSosListener>();
  private lastTriggerEvent?: VoiceTriggerEvent;

  constructor() {
    this.loadConfig();
    this.initRecognition();
    this.setupGestureAutoStart();
  }

  // --------------------------------------------------------------------------
  // USER GESTURE FALLBACK FOR BROWSER MIC PERMISSION
  // --------------------------------------------------------------------------
  private setupGestureAutoStart() {
    if (typeof window === 'undefined') return;

    const startIfPermitted = () => {
      if (this.config.enabled && this.state !== 'listening' && this.state !== 'triggered') {
        this.startListening().catch(() => {});
      }
    };

    window.addEventListener('click', startIfPermitted, { once: true });
    window.addEventListener('touchstart', startIfPermitted, { once: true });
  }

  // --------------------------------------------------------------------------
  // CONFIGURATION & PERSISTENCE
  // --------------------------------------------------------------------------
  private loadConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.config = {
          ...this.config,
          ...parsed,
          enabled: parsed.enabled !== undefined ? parsed.enabled : true,
        };
      } else {
        this.config.enabled = true; // Always default to true
      }
      const last = localStorage.getItem(STORAGE_KEY_LAST_EVENT);
      if (last) {
        this.lastTriggerEvent = JSON.parse(last);
      }
    } catch (e) {
      console.warn('[VOICE SOS] Failed to load config from storage:', e);
      this.config.enabled = true;
    }
  }

  private saveConfig() {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(this.config));
    } catch (e) {
      console.warn('[VOICE SOS] Failed to persist config:', e);
    }
  }

  public getConfig(): VoiceSosConfig {
    return { ...this.config };
  }

  public getState(): VoiceSosState {
    return this.state;
  }

  public getLastEvent(): VoiceTriggerEvent | undefined {
    return this.lastTriggerEvent;
  }

  public getAllKeywords(): string[] {
    return Array.from(
      new Set([
        ...DEFAULT_STANDALONE_KEYWORDS,
        ...DEFAULT_NATURAL_PHRASES,
        ...this.config.customPhrases,
      ])
    );
  }

  public addCustomPhrase(phrase: string): boolean {
    const clean = phrase.trim().toLowerCase();
    if (!clean || clean.length < 2) return false;
    if (this.getAllKeywords().includes(clean)) return false;

    this.config.customPhrases.push(clean);
    this.saveConfig();
    this.notify();
    return true;
  }

  public removeCustomPhrase(phrase: string): void {
    const clean = phrase.trim().toLowerCase();
    this.config.customPhrases = this.config.customPhrases.filter((p) => p !== clean);
    this.saveConfig();
    this.notify();
  }

  // --------------------------------------------------------------------------
  // SPEECH RECOGNITION SETUP
  // --------------------------------------------------------------------------
  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.info('[VOICE SOS] Web Speech API not supported in this browser.');
      this.state = 'unsupported';
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 3;

      this.recognition.onstart = () => {
        this.isRestarting = false;
        if (this.config.enabled) {
          this.state = 'listening';
          this.notify();
        }
      };

      this.recognition.onresult = (event: any) => {
        this.handleRecognitionResult(event);
      };

      this.recognition.onerror = (event: any) => {
        const errorType = event.error;
        console.warn('[VOICE SOS] Recognition error:', errorType);

        if (errorType === 'not-allowed' || errorType === 'service-not-allowed') {
          this.state = 'permission_denied';
          this.config.enabled = false;
          this.saveConfig();
          this.notify();
        } else if (errorType === 'audio-capture') {
          this.state = 'error';
          this.notify();
        } else if (errorType === 'no-speech') {
          // Normal timeout on silence, will loop via onend
        }
      };

      this.recognition.onend = () => {
        // Automatically keep listening if still enabled
        if (this.config.enabled && this.state !== 'triggered' && !this.isRestarting) {
          this.isRestarting = true;
          setTimeout(() => {
            if (this.config.enabled) {
              try {
                this.recognition.start();
              } catch (e) {
                // Ignore if already started
              }
            }
          }, 300);
        } else if (!this.config.enabled) {
          this.state = 'disabled';
          this.notify();
        }
      };

      // If previously enabled, ask/start
      if (this.config.enabled) {
        this.startListening();
      } else {
        this.state = 'disabled';
      }
    } catch (e) {
      console.error('[VOICE SOS] Initialization failed:', e);
      this.state = 'error';
    }
  }

  // --------------------------------------------------------------------------
  // KEYWORD MATCHING ENGINE (AVOID FALSE POSITIVES)
  // --------------------------------------------------------------------------
  private handleRecognitionResult(event: any) {
    if (!this.config.enabled || this.state === 'triggered') return;

    // Check debounce refractory window (20 seconds between SOS triggers)
    const now = Date.now();
    if (now - this.lastTriggerTimestamp < 20000) {
      return;
    }

    const allKeywords = this.getAllKeywords();

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const res = event.results[i];
      if (!res || !res[0]) continue;

      const transcript = res[0].transcript || '';
      const confidence = typeof res[0].confidence === 'number' ? res[0].confidence : 0.85;

      // Clean transcript: normalize spaces, lower-case, remove edge punctuation
      const clean = transcript
        .toLowerCase()
        .replace(/[^\w\s']/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!clean) continue;

      // Check each configured keyword / phrase with word boundary
      for (const keyword of allKeywords) {
        const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Word boundary: matches complete word/phrase, not "helping", "shelf", "dangerously"
        const pattern = new RegExp(`(^|\\s)${escaped}($|\\s)`, 'i');

        if (pattern.test(clean)) {
          // Prevent repeated triggers from interim callbacks
          this.lastTriggerTimestamp = Date.now();
          this.triggerVoiceEmergency(keyword, clean, confidence);
          return;
        }
      }
    }
  }

  // --------------------------------------------------------------------------
  // TRIGGER EMERGENCY WORKFLOW
  // --------------------------------------------------------------------------
  private async triggerVoiceEmergency(keyword: string, fullTranscript: string, confidence: number) {
    console.warn(`[VOICE SOS TRIGGERED] Keyword: "${keyword}", Confidence: ${confidence}`);

    const eventId = `sos_voice_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.state = 'triggered';

    // Retrieve latest available location
    let location: { latitude: number; longitude: number; accuracy: number } | undefined;
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 2500,
            maximumAge: 30000,
          });
        });
        location = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
      } catch (e) {
        console.info('[VOICE SOS] Geolocation unavailable or denied');
      }
    }

    const triggerEvent: VoiceTriggerEvent = {
      eventId,
      matchedPhrase: keyword,
      fullTranscript,
      confidence,
      timestamp: new Date().toISOString(),
      location,
    };

    this.lastTriggerEvent = triggerEvent;
    try {
      localStorage.setItem(STORAGE_KEY_LAST_EVENT, JSON.stringify(triggerEvent));
    } catch {}

    this.notify();

    // Trigger the real existing backend SOS workflow (Arduino Uno + SIM800L)
    try {
      await arduinoSerial.sendSos();
    } catch (e) {
      console.error('[VOICE SOS] Backend SOS trigger error:', e);
    }
  }

  // --------------------------------------------------------------------------
  // PUBLIC CONTROL METHODS
  // --------------------------------------------------------------------------
  public async enable(): Promise<boolean> {
    this.config.enabled = true;
    this.saveConfig();
    return await this.startListening();
  }

  public disable(): void {
    this.config.enabled = false;
    this.saveConfig();
    this.stopListening();
  }

  public async startListening(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    // 1. Verify Microphone Permission explicitly
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Release stream immediately so speech recognition engine can own the hardware mic
        stream.getTracks().forEach((track) => track.stop());
      } catch (err: any) {
        console.warn('[VOICE SOS] Microphone permission rejected:', err);
        this.state = 'permission_denied';
        this.config.enabled = false;
        this.saveConfig();
        this.notify();
        return false;
      }
    }

    if (!this.recognition) {
      this.initRecognition();
      if (!this.recognition) {
        this.state = 'unsupported';
        this.notify();
        return false;
      }
    }

    try {
      this.state = 'listening';
      this.recognition.start();
      this.notify();
      return true;
    } catch (e: any) {
      // If already started, it throws InvalidStateError, which is fine
      this.state = 'listening';
      this.notify();
      return true;
    }
  }

  public stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
    }
    this.state = 'disabled';
    this.notify();
  }

  // Reset after emergency stands down
  public resetTriggerState(): void {
    if (this.state === 'triggered') {
      if (this.config.enabled) {
        this.startListening();
      } else {
        this.state = 'disabled';
        this.notify();
      }
    }
  }

  // --------------------------------------------------------------------------
  // SUBSCRIBERS
  // --------------------------------------------------------------------------
  public subscribe(listener: VoiceSosListener): () => void {
    this.listeners.add(listener);
    listener(this.state, this.lastTriggerEvent);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.state, this.lastTriggerEvent);
      } catch (e) {
        console.error('[VOICE SOS] Listener error:', e);
      }
    });
  }
}

export const voiceSos = new VoiceSosService();

