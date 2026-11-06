/**
 * AI Safety Chatbot Service
 *
 * Provides a dynamic safety intelligence engine that handles queries about:
 * - Nearest police stations, emergency posts, and response times
 * - Nearest hospitals, trauma centers, and ambulance dispatch
 * - Immediate safety protocols (e.g., being followed, late-night travel)
 * - Emergency helplines (112, 1091, 181, 108)
 * - Women's legal rights (Zero FIR, Section 46(4), free medical care)
 * - Voice SOS and hardware device integration
 *
 * Architecture supports instant plug-and-play LLM APIs (Gemini, OpenAI, Groq, custom REST):
 * When the user enters their API key in Settings, the service will seamlessly call the
 * external LLM API while continuing to enrich the context with local safety data!
 */

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actions?: ChatAction[];
  isError?: boolean;
}

export interface ChatAction {
  label: string;
  type: 'call' | 'navigate_map' | 'trigger_sos' | 'quick_reply';
  payload?: string;
}

export interface LLMConfig {
  provider: 'built-in' | 'groq' | 'gemini' | 'openai' | 'custom';
  apiKey: string;
  endpoint?: string;
  model?: string;
}

const STORAGE_KEY_LLM = 'safealert_llm_config';
const STORAGE_KEY_HISTORY = 'safealert_chat_history';

// Helper to safely read from Vite .env environment variables without hardcoded secrets
const getEnvConfig = (): LLMConfig => {
  const env = (import.meta as any).env || {};
  const envApiKey = env.VITE_LLM_API_KEY || env.VITE_GROQ_API_KEY || env.VITE_GEMINI_API_KEY || '';
  
  let envProvider: 'built-in' | 'groq' | 'gemini' | 'openai' | 'custom' = env.VITE_LLM_PROVIDER || 'built-in';
  if (!env.VITE_LLM_PROVIDER && envApiKey) {
    if (envApiKey.startsWith('gsk_')) {
      envProvider = 'groq';
    } else if (envApiKey.startsWith('AIza')) {
      envProvider = 'gemini';
    } else if (envApiKey.startsWith('sk-')) {
      envProvider = 'openai';
    }
  }

  let defaultModel = 'openai/gpt-oss-120b';
  let defaultEndpoint = 'https://api.groq.com/openai/v1/chat/completions';

  if (envProvider === 'gemini') {
    defaultModel = 'gemini-1.5-flash';
    defaultEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  } else if (envProvider === 'openai') {
    defaultModel = 'gpt-4o-mini';
    defaultEndpoint = 'https://api.openai.com/v1/chat/completions';
  }

  const envModel = env.VITE_LLM_MODEL || defaultModel;
  const envEndpoint = env.VITE_LLM_ENDPOINT || defaultEndpoint;

  return {
    provider: envProvider,
    apiKey: envApiKey,
    endpoint: envEndpoint,
    model: envModel,
  };
};

// Default configuration derived dynamically from environment variables
const DEFAULT_CONFIG: LLMConfig = getEnvConfig();

class AIChatService {
  private config: LLMConfig = DEFAULT_CONFIG;
  private history: ChatMessage[] = [];
  private listeners = new Set<(messages: ChatMessage[]) => void>();

  constructor() {
    this.loadConfig();
    this.loadHistory();
  }

  public getConfig(): LLMConfig {
    return { ...this.config };
  }

  public saveConfig(newConfig: Partial<LLMConfig>) {
    this.config = { ...this.config, ...newConfig };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_LLM, JSON.stringify(this.config));
      } catch (e) {
        console.error('Failed to save LLM config:', e);
      }
    }
  }

  private loadConfig() {
    const envConfig = getEnvConfig();
    this.config = { ...envConfig };

    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_LLM);
        if (saved) {
          const parsed = JSON.parse(saved);
          this.config = {
            ...envConfig,
            ...parsed,
            apiKey: parsed.apiKey || envConfig.apiKey,
          };
        }
      } catch {}
    }
  }

  public getHistory(): ChatMessage[] {
    return this.history;
  }

  private loadHistory() {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY_HISTORY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            this.history = parsed;
            return;
          }
        }
      } catch {}
    }
    this.history = [];
  }

  private saveHistory() {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(this.history));
      } catch {}
    }
    this.notify();
  }

  public subscribe(listener: (messages: ChatMessage[]) => void): () => void {
    this.listeners.add(listener);
    listener(this.getHistory());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const list = this.getHistory();
    this.listeners.forEach((cb) => {
      try {
        cb(list);
      } catch (e) {
        console.error('Chat listener error:', e);
      }
    });
  }

  public clearChat() {
    this.history = [];
    this.saveHistory();
  }

  /**
   * Process a user question and generate an intelligent response
   */
  public async sendMessage(userText: string): Promise<ChatMessage> {
    const trimmed = userText.trim();
    if (!trimmed) {
      return {
        id: `empty-${Date.now()}`,
        sender: 'assistant',
        text: 'How can I assist your safety?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    this.history.push(userMsg);
    this.saveHistory();

    // Check if external LLM API is configured with an active key (from .env or UI)
    if (
      this.config.apiKey &&
      this.config.apiKey.trim().length > 0 &&
      this.config.provider !== 'built-in'
    ) {
      try {
        const llmResponse = await this.callExternalLLM(trimmed);
        this.history.push(llmResponse);
        this.saveHistory();
        return llmResponse;
      } catch (err) {
        console.warn(
          'External LLM call failed or unavailable. Falling back to built-in backup Safety Knowledge Engine:',
          err
        );
      }
    }

    // Backup & Standalone: Use intelligent built-in Safety Knowledge Engine
    const assistantMsg = this.generateBuiltInResponse(trimmed);
    this.history.push(assistantMsg);
    this.saveHistory();
    return assistantMsg;
  }

  /**
   * Call external LLM (Groq, Gemini, or OpenAI format)
   */
  private async callExternalLLM(prompt: string): Promise<ChatMessage> {
    const systemPrompt = `You are Aura, a refined, professional safety assistant embedded in a Women's Personal Safety mobile application.
Tone & Style:
- Professional, concise, calm, and reassuring.
- Do NOT use emojis.
- Do NOT output generic introductions or marketing fluff.
- Keep answers focused, practical, and direct.
Local Context:
- User location: Bangalore along the Mysore Road / Kengeri / RRCE corridor.
- Key Emergency Numbers: 112 (National Emergency), 1091 (Women Helpline), 181 (Women in Distress), 108 (Ambulance).
- Nearest Police Station: Kengeri Police Station (1.8 km, 080-22942555), Rajarajeshwari Nagar Station (3.2 km, 080-22942557).
- Nearest Hospital: Rajarajeswari Medical College & Hospital (1.2 km, 24/7 Trauma), BGS Gleneagles Global Hospital (2.8 km).
Respond clearly with direct facts and practical safety steps.`;

    if (this.config.provider === 'gemini' || (!this.config.provider && this.config.apiKey.startsWith('AIza'))) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model || 'gemini-1.5-flash'}:generateContent?key=${this.config.apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received from model.';

      return {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: this.deriveActions(prompt),
      };
    } else {
      // Standard Groq or OpenAI-compatible format
      let endpoint = this.config.endpoint;
      if (!endpoint || endpoint.includes('googleapis.com')) {
        if (this.config.provider === 'groq' || this.config.apiKey.startsWith('gsk_')) {
          endpoint = 'https://api.groq.com/openai/v1/chat/completions';
        } else {
          endpoint = 'https://api.openai.com/v1/chat/completions';
        }
      }

      const modelName =
        this.config.model && !this.config.model.includes('gemini')
          ? this.config.model
          : this.config.provider === 'groq' || this.config.apiKey.startsWith('gsk_')
          ? 'openai/gpt-oss-120b'
          : 'gpt-4o-mini';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content || 'No response received from model.';

      return {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: this.deriveActions(prompt),
      };
    }
  }

  /**
   * Derive contextual action buttons based on query
   */
  private deriveActions(query: string): ChatAction[] {
    const q = query.toLowerCase();
    const actions: ChatAction[] = [];

    if (q.includes('police') || q.includes('station') || q.includes('cop') || q.includes('kengeri')) {
      actions.push({ label: 'Call 112', type: 'call', payload: '112' });
      actions.push({ label: 'View on Map', type: 'navigate_map' });
    }
    if (q.includes('hospital') || q.includes('doctor') || q.includes('medical') || q.includes('ambulance')) {
      actions.push({ label: 'Call 108', type: 'call', payload: '108' });
      actions.push({ label: 'View on Map', type: 'navigate_map' });
    }
    if (q.includes('follow') || q.includes('danger') || q.includes('unsafe') || q.includes('help me') || q.includes('scared')) {
      actions.push({ label: 'Trigger SOS', type: 'trigger_sos' });
      actions.push({ label: 'Call 112', type: 'call', payload: '112' });
    }
    return actions;
  }

  /**
   * Built-in intelligent safety knowledge engine (clean, professional, zero emojis)
   */
  private generateBuiltInResponse(query: string): ChatMessage {
    const q = query.toLowerCase();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let text = '';
    let actions: ChatAction[] = [];

    // 1. NEAREST POLICE STATIONS / LAW ENFORCEMENT
    if (
      q.includes('police') ||
      q.includes('station') ||
      q.includes('cop') ||
      q.includes('thana') ||
      q.includes('chowki') ||
      q.includes('nearest station')
    ) {
      text = `**Nearest Police Stations (RRCE / Mysore Road Corridor)**\n\n` +
        `1. **Kengeri Police Station** (1.8 km)\n` +
        `   • Location: Mysore Main Rd, Opp. Kengeri Bus Terminal\n` +
        `   • Phone: 080-22942555 / 112\n` +
        `   • Note: 24/7 active station with dedicated women's assistance desk.\n\n` +
        `2. **Rajarajeshwari Nagar Police Station** (3.2 km)\n` +
        `   • Location: BEML Layout, 5th Stage, RR Nagar\n` +
        `   • Phone: 080-22942557\n\n` +
        `3. **Kumbalgodu Police Station** (4.1 km)\n` +
        `   • Location: Bangalore-Mysore Expressway Junction\n` +
        `   • Phone: 080-22943485\n\n` +
        `For immediate response, dial 112 for direct dispatch to your live coordinates.`;

      actions = [
        { label: 'Call 112', type: 'call', payload: '112' },
        { label: 'View on Map', type: 'navigate_map' },
      ];
    }

    // 2. NEAREST HOSPITALS / TRAUMA / AMBULANCE
    else if (
      q.includes('hospital') ||
      q.includes('clinic') ||
      q.includes('doctor') ||
      q.includes('ambulance') ||
      q.includes('medical') ||
      q.includes('injury') ||
      q.includes('emergency care')
    ) {
      text = `**Nearest Emergency Medical & Trauma Centers**\n\n` +
        `1. **Rajarajeswari Medical College & Hospital** (1.2 km)\n` +
        `   • Location: Kambipura, Mysore Rd (Adjacent to RRCE)\n` +
        `   • Facilities: 24/7 Level-1 Emergency & Trauma Care\n` +
        `   • Phone: 080-28437444\n\n` +
        `2. **BGS Gleneagles Global Hospital** (2.8 km)\n` +
        `   • Location: Uttarahalli Main Rd, Kengeri\n` +
        `   • Facilities: Multi-specialty & Intensive Critical Care\n` +
        `   • Phone: 080-26255555\n\n` +
        `3. **Subbaiah Hospital & Trauma Care** (3.5 km)\n` +
        `   • Location: Kengeri Satellite Town\n` +
        `   • Phone: 080-28485555\n\n` +
        `For emergency ambulance dispatch, call 108 or 112.`;

      actions = [
        { label: 'Call 108', type: 'call', payload: '108' },
        { label: 'View on Map', type: 'navigate_map' },
      ];
    }

    // 3. BEING FOLLOWED / STALKED / IMMEDIATE SUSPICION
    else if (
      q.includes('follow') ||
      q.includes('someone is following') ||
      q.includes('stalk') ||
      q.includes('creepy') ||
      q.includes('chasing') ||
      q.includes('behind me')
    ) {
      text = `**Immediate Safety Protocol: Being Followed**\n\n` +
        `1. **Do not head home:** Avoid leading an unknown pursuer to your residential doorway or secluded streets.\n` +
        `2. **Move toward public activity:** Enter the nearest open commercial premises, 24/7 fuel station, or well-lit store.\n` +
        `3. **Cross the street deliberately:** Changing sides confirms whether the individual is actively tailing you.\n` +
        `4. **Make an audible phone call:** Contact family or dial 112 directly.\n` +
        `5. **Trigger SOS:** Hold the SOS button or say "Help" / "Danger" to broadcast your location.`;

      actions = [
        { label: 'Trigger SOS', type: 'trigger_sos' },
        { label: 'Call 112', type: 'call', payload: '112' },
        { label: 'View on Map', type: 'navigate_map' },
      ];
    }

    // 4. LATE NIGHT TRAVEL / CAB / PUBLIC TRANSIT SAFETY
    else if (
      q.includes('night') ||
      q.includes('cab') ||
      q.includes('uber') ||
      q.includes('ola') ||
      q.includes('auto') ||
      q.includes('taxi') ||
      q.includes('travel') ||
      q.includes('walk')
    ) {
      text = `**Night Travel & Transit Precautions**\n\n` +
        `• Verify vehicle registration and driver identity before entering.\n` +
        `• Sit in the rear passenger seat behind the driver.\n` +
        `• Confirm child locks are disengaged from inside before departing.\n` +
        `• Keep live location sharing active with trusted contacts.\n` +
        `• If an unapproved route detour occurs, demand an immediate stop in a populated area and dial 112.`;

      actions = [
        { label: 'View on Map', type: 'navigate_map' },
        { label: 'Call 1091', type: 'call', payload: '1091' },
      ];
    }

    // 5. EMERGENCY HELPLINES & RAPID CONTACTS
    else if (
      q.includes('helpline') ||
      q.includes('number') ||
      q.includes('contact') ||
      q.includes('toll free') ||
      q.includes('call')
    ) {
      text = `**Emergency Helplines**\n\n` +
        `• **112** — National Emergency Response (Police, Fire, Ambulance)\n` +
        `• **1091** — Women's Safety Helpline (24/7 Police Response)\n` +
        `• **181** — Women in Distress Helpline (Legal & Counseling)\n` +
        `• **1090** — Anti-Harassment Special Cell\n` +
        `• **108** — Emergency Medical & Ambulance Service\n\n` +
        `All numbers are toll-free and accessible across all telecom networks.`;

      actions = [
        { label: 'Call 112', type: 'call', payload: '112' },
        { label: 'Call 1091', type: 'call', payload: '1091' },
        { label: 'Call 181', type: 'call', payload: '181' },
      ];
    }

    // 6. LEGAL RIGHTS / ZERO FIR / POLICE PROTOCOLS
    else if (
      q.includes('law') ||
      q.includes('legal') ||
      q.includes('right') ||
      q.includes('fir') ||
      q.includes('zero fir') ||
      q.includes('arrest') ||
      q.includes('complaint')
    ) {
      text = `**Legal Rights & Protections**\n\n` +
        `1. **Zero FIR:** Any police station is legally required to register a cognizable complaint, regardless of jurisdictional boundaries.\n\n` +
        `2. **Arrest Restrictions (Section 46(4)):** No woman may be arrested between sunset and sunrise, except in extraordinary situations with a female officer and magistrate approval.\n\n` +
        `3. **Statement Privacy:** Statements must be recorded in the presence of a female officer or magistrate.\n\n` +
        `4. **Medical Care:** All hospitals are legally mandated to deliver immediate, free medical treatment to victims of trauma.`;

      actions = [
        { label: 'Call 181', type: 'call', payload: '181' },
        { label: 'Trigger SOS', type: 'trigger_sos' },
      ];
    }

    // 7. VOICE SOS & APP HARDWARE EXPLANATION
    else if (
      q.includes('voice') ||
      q.includes('arduino') ||
      q.includes('hardware') ||
      q.includes('sos button') ||
      q.includes('how does') ||
      q.includes('keyword')
    ) {
      text = `**Voice SOS & Device Hardware**\n\n` +
        `• **Hands-free detection:** Recognizes spoken keywords: "Help", "Danger", "Emergency", and "Rescue".\n` +
        `• **Instant dispatch:** Triggers location broadcasting and emergency mode automatically.\n` +
        `• **Hardware integration:** Signals the paired Arduino Uno to initiate strobe alerting over serial.\n` +
        `• **On-device privacy:** Audio processing remains on your device.`;

      actions = [
        { label: 'Trigger SOS', type: 'trigger_sos' },
        { label: 'View on Map', type: 'navigate_map' },
      ];
    }

    // 8. GENERAL / OTHER SAFETY QUESTIONS
    else {
      text = `**Safety Guidance**\n\n` +
        `Regarding: "${query}"\n\n` +
        `Stay observant of your surroundings and keep your device accessible. If you sense any safety concern, move toward a well-lit public area and dial 112 immediately.`;

      actions = [
        { label: 'Call 112', type: 'call', payload: '112' },
        { label: 'View on Map', type: 'navigate_map' },
      ];
    }

    return {
      id: `assistant-${Date.now()}`,
      sender: 'assistant',
      text,
      timestamp,
      actions,
    };
  }
}

export const aiChatService = new AIChatService();

