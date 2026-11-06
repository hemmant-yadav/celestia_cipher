import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  SlidersHorizontal,
  Send,
  RotateCcw,
  Key,
  MapPin,
  PhoneCall,
  AlertCircle,
  Mic,
  MicOff,
  Check,
  Shield,
  ChevronRight,
  X,
} from 'lucide-react';
import {
  aiChatService,
  type ChatMessage,
  type ChatAction,
  type LLMConfig,
} from '../services/aiChatService';

interface SafetyChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMap: () => void;
  onTriggerSos: () => void;
}

const DEFAULT_SUGGESTIONS = [
  'Nearest Police Station',
  'Nearest Hospital & Trauma',
  'Being Followed Protocol',
  'Late Night Travel Safety',
];

export const SafetyChatbot: React.FC<SafetyChatbotProps> = ({
  isOpen,
  onClose,
  onNavigateToMap,
  onTriggerSos,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(aiChatService.getHistory());
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [llmConfig, setLlmConfig] = useState<LLMConfig>(aiChatService.getConfig());
  const [apiKeySavedNotice, setApiKeySavedNotice] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Subscribe to live chat history
  useEffect(() => {
    const unsubscribe = aiChatService.subscribe((msgs) => {
      setMessages([...msgs]);
    });
    return () => unsubscribe();
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  // Setup Web Speech API for voice question input
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      speechRecognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!speechRecognitionRef.current) return;
    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        speechRecognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || inputText).trim();
    if (!prompt || isTyping) return;

    setInputText('');
    setIsTyping(true);

    try {
      await aiChatService.sendMessage(prompt);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: ChatAction) => {
    switch (action.type) {
      case 'call':
        if (action.payload) {
          window.location.href = `tel:${action.payload}`;
        }
        break;
      case 'navigate_map':
        onClose();
        onNavigateToMap();
        break;
      case 'trigger_sos':
        onClose();
        onTriggerSos();
        break;
      case 'quick_reply':
        if (action.payload) {
          handleSend(action.payload);
        }
        break;
    }
  };

  const handleSaveLLMConfig = (e: React.FormEvent) => {
    e.preventDefault();
    aiChatService.saveConfig(llmConfig);
    setApiKeySavedNotice(true);
    setTimeout(() => {
      setApiKeySavedNotice(false);
      setIsSettingsOpen(false);
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 90,
        backgroundColor: 'rgba(248, 233, 233, 0.25)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeIn 180ms ease-out',
        overflow: 'hidden',
      }}
      role="dialog"
      aria-label="Aura Safety Assistant"
    >
      {/* ---------------- 1. REFINED MINIMAL HEADER ---------------- */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'calc(14px + env(safe-area-inset-top, 0px)) 16px 10px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.45)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(235, 218, 222, 0.6)',
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        {/* Back / Dismiss Button */}
        <button
          onClick={onClose}
          aria-label="Back"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-text)',
            transition: 'transform var(--motion-fast)',
            boxShadow: '0 1px 4px rgba(185, 111, 128, 0.06)',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.94)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <ChevronLeft size={18} strokeWidth={2.2} />
        </button>

        {/* Center Title & Subtle Status */}
        <div style={{ textAlign: 'center' }}>
          <h3
            style={{
              fontSize: '14.5px',
              fontWeight: 600,
              color: 'var(--color-text)',
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            Aura Assistant
          </h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              marginTop: '1px',
            }}
          >
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-rose-deep)',
                opacity: 0.85,
              }}
            />
            <span style={{ fontSize: '10.5px', color: '#7E6B71', fontWeight: 500 }}>
              {llmConfig.apiKey ? 'Active • Groq AI' : 'Active • Safety Intel'}
            </span>
          </div>
        </div>

        {/* Right Header Controls: Clear & Settings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {messages.length > 0 && (
            <button
              onClick={() => aiChatService.clearChat()}
              title="Clear conversation"
              aria-label="Clear conversation"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.75)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#7E6B71',
                transition: 'transform var(--motion-fast)',
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.94)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <RotateCcw size={14} />
            </button>
          )}

          <button
            onClick={() => setIsSettingsOpen(true)}
            title="Assistant Settings"
            aria-label="Assistant Settings"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-text)',
              transition: 'transform var(--motion-fast)',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.94)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <SlidersHorizontal size={14} strokeWidth={1.8} />
          </button>
        </div>
      </header>

      {/* ---------------- 2. COMPACT EMERGENCY WARNING PILL ---------------- */}
      <div style={{ padding: '8px 16px 0 16px', flexShrink: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '5px 12px',
            borderRadius: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(235, 218, 222, 0.65)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertCircle size={13} color="var(--color-rose-deep)" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '10.5px', color: '#655358', fontWeight: 500 }}>
              Immediate emergency?
            </span>
          </div>
          <button
            onClick={() => {
              window.location.href = 'tel:112';
            }}
            style={{
              padding: '2px 8px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-rose-deep)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '10px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <PhoneCall size={9} />
            <span>Call 112</span>
          </button>
        </div>
      </div>

      {/* ---------------- 3. CONVERSATION AREA ---------------- */}
      <div
        className="hide-scrollbar"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Clean, Non-Vibe-Coded Empty State when no messages sent yet */}
        {messages.length === 0 && (
          <div
            style={{
              margin: 'auto 0',
              textAlign: 'center',
              padding: '24px 12px',
              animation: 'fadeIn 200ms ease-out',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(185, 111, 128, 0.1)',
                border: '1px solid rgba(185, 111, 128, 0.22)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
                color: 'var(--color-rose-deep)',
              }}
            >
              <Shield size={20} strokeWidth={1.8} />
            </div>

            <h4
              style={{
                fontSize: '14.5px',
                fontWeight: 600,
                color: 'var(--color-text)',
                margin: '0 0 4px 0',
              }}
            >
              How can I assist your safety?
            </h4>
            <p
              style={{
                fontSize: '11.5px',
                color: '#7E6B71',
                margin: '0 0 20px 0',
                lineHeight: 1.45,
              }}
            >
              Direct guidance for nearest safe points, hospitals, helplines, or transit precautions.
            </p>

            {/* Clean Prompt Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', maxWidth: '280px', margin: '0 auto' }}>
              {DEFAULT_SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.55)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(235, 218, 222, 0.7)',
                    color: 'var(--color-text)',
                    fontSize: '11.5px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 120ms ease',
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <span>{item}</span>
                  <ChevronRight size={12} color="#7E6B71" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Flow */}
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '100%',
                animation: 'messageAppear 150ms ease-out',
              }}
            >
              {/* Bubble Container */}
              <div
                style={{
                  maxWidth: isUser ? '82%' : '88%',
                  borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  padding: isUser ? '9px 13px' : '11px 13px',
                  backgroundColor: isUser
                    ? 'var(--color-rose-deep)'
                    : 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: isUser ? 'none' : 'blur(16px)',
                  WebkitBackdropFilter: isUser ? 'none' : 'blur(16px)',
                  color: isUser ? '#FFFFFF' : 'var(--color-text)',
                  border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.65)',
                  boxShadow: isUser
                    ? '0 2px 8px rgba(185, 111, 128, 0.2)'
                    : '0 2px 10px rgba(185, 111, 128, 0.04)',
                  fontSize: '12px',
                  lineHeight: 1.5,
                  wordBreak: 'break-word',
                }}
              >
                {/* Clean Typography Parser */}
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {renderCleanFormattedMessage(msg.text)}
                </div>

                {/* Refined Action Buttons */}
                {msg.actions && msg.actions.length > 0 && (
                  <div
                    style={{
                      marginTop: '8px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '5px',
                      borderTop: isUser ? 'none' : '1px solid rgba(235, 218, 222, 0.5)',
                      paddingTop: '7px',
                    }}
                  >
                    {msg.actions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(action)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 9px',
                          borderRadius: '8px',
                          backgroundColor:
                            action.type === 'trigger_sos'
                              ? 'rgba(200, 63, 75, 0.1)'
                              : 'rgba(255, 255, 255, 0.65)',
                          border:
                            action.type === 'trigger_sos'
                              ? '1px solid var(--color-sos)'
                              : '1px solid rgba(185, 111, 128, 0.3)',
                          color:
                            action.type === 'trigger_sos'
                              ? 'var(--color-sos)'
                              : 'var(--color-rose-deep)',
                          fontSize: '10.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'transform var(--motion-fast)',
                        }}
                        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
                        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        {action.type === 'call' && <PhoneCall size={10} strokeWidth={2} />}
                        {action.type === 'navigate_map' && <MapPin size={10} strokeWidth={2} />}
                        {action.type === 'trigger_sos' && <AlertCircle size={10} strokeWidth={2} />}
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <span
                style={{
                  fontSize: '9.5px',
                  color: '#9E8B91',
                  marginTop: '3px',
                  marginRight: isUser ? '4px' : '0',
                  marginLeft: !isUser ? '4px' : '0',
                }}
              >
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {/* Minimal Typing State */}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '2px 4px' }}>
            <div
              style={{
                padding: '8px 12px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.65)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span className="typing-dot" style={{ animationDelay: '0ms' }} />
              <span className="typing-dot" style={{ animationDelay: '180ms' }} />
              <span className="typing-dot" style={{ animationDelay: '360ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ---------------- 4. REFINED BOTTOM INPUT BAR ---------------- */}
      <div
        style={{
          padding: '6px 16px calc(14px + env(safe-area-inset-bottom, 0px)) 16px',
          backgroundColor: 'transparent',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 4px 3px 8px',
            borderRadius: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.72)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 4px 18px rgba(185, 111, 128, 0.08)',
          }}
        >
          {/* Speech-to-Text Microphone Button */}
          <button
            onClick={toggleVoiceInput}
            title={isListening ? 'Stop listening' : 'Dictate question'}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: isListening ? 'var(--color-sos)' : 'rgba(185, 111, 128, 0.12)',
              border: 'none',
              color: isListening ? '#FFFFFF' : 'var(--color-rose-deep)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 120ms ease',
            }}
          >
            {isListening ? <MicOff size={14} /> : <Mic size={14} />}
          </button>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={isListening ? 'Listening...' : 'Ask about safe spots, police, helplines...'}
            style={{
              flex: 1,
              height: '36px',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '12px',
              color: 'var(--color-text)',
              padding: '0 6px',
            }}
          />

          {/* Send Button */}
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isTyping}
            aria-label="Send"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor:
                inputText.trim() && !isTyping ? 'var(--color-rose-deep)' : 'rgba(185, 111, 128, 0.2)',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: inputText.trim() && !isTyping ? 'pointer' : 'default',
              transition: 'transform var(--motion-fast)',
              flexShrink: 0,
            }}
            onMouseDown={(e) => {
              if (inputText.trim() && !isTyping) e.currentTarget.style.transform = 'scale(0.92)';
            }}
            onMouseUp={(e) => {
              if (inputText.trim() && !isTyping) e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Send size={13} style={{ marginLeft: '1px' }} />
          </button>
        </div>
      </div>

      {/* ---------------- 5. LLM CONFIGURATION MODAL ---------------- */}
      {isSettingsOpen && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(40, 30, 34, 0.45)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 150ms ease-out',
          }}
          onClick={() => setIsSettingsOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '300px',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 12px 32px rgba(40, 35, 38, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={15} color="var(--color-rose-deep)" />
                <h4 style={{ fontSize: '14px', fontWeight: 600, margin: 0, color: 'var(--color-text)' }}>
                  LLM Configuration
                </h4>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(235, 218, 222, 0.5)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--color-text)',
                }}
              >
                <X size={13} />
              </button>
            </div>

            <form onSubmit={handleSaveLLMConfig}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 600, color: '#655358', marginBottom: '3px' }}>
                  Provider
                </label>
                <select
                  value={llmConfig.provider}
                  onChange={(e) =>
                    setLlmConfig((prev) => ({
                      ...prev,
                      provider: e.target.value as any,
                      model:
                        e.target.value === 'groq'
                          ? 'openai/gpt-oss-120b'
                          : e.target.value === 'gemini'
                            ? 'gemini-1.5-flash'
                            : e.target.value === 'openai'
                              ? 'gpt-4o-mini'
                              : prev.model,
                      endpoint:
                        e.target.value === 'groq'
                          ? 'https://api.groq.com/openai/v1/chat/completions'
                          : e.target.value === 'openai'
                            ? 'https://api.openai.com/v1/chat/completions'
                            : prev.endpoint,
                    }))
                  }
                  style={{
                    width: '100%',
                    height: '34px',
                    padding: '0 8px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    fontSize: '11.5px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    outline: 'none',
                    color: 'var(--color-text)',
                  }}
                >
                  <option value="groq">Groq AI (Fast • Active)</option>
                  <option value="built-in">Built-in Safety Intel (Offline Backup)</option>
                  <option value="gemini">Google Gemini</option>
                  <option value="openai">OpenAI</option>
                  <option value="custom">Custom REST Endpoint</option>
                </select>
              </div>

              {llmConfig.provider !== 'built-in' && (
                <>
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 600, color: '#655358', marginBottom: '3px' }}>
                      API Key
                    </label>
                    <input
                      type="password"
                      placeholder="API key (gsk_... / AIza... / sk-...)"
                      value={llmConfig.apiKey}
                      onChange={(e) => setLlmConfig((prev) => ({ ...prev, apiKey: e.target.value }))}
                      style={{
                        width: '100%',
                        height: '34px',
                        padding: '0 8px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        fontSize: '11.5px',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        boxSizing: 'border-box',
                        outline: 'none',
                        color: 'var(--color-text)',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 600, color: '#655358', marginBottom: '3px' }}>
                      Model Identifier
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. openai/gpt-oss-120b"
                      value={llmConfig.model || ''}
                      onChange={(e) => setLlmConfig((prev) => ({ ...prev, model: e.target.value }))}
                      style={{
                        width: '100%',
                        height: '34px',
                        padding: '0 8px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                        fontSize: '11.5px',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        boxSizing: 'border-box',
                        outline: 'none',
                        color: 'var(--color-text)',
                      }}
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                style={{
                  width: '100%',
                  marginTop: '6px',
                  padding: '9px',
                  borderRadius: '10px',
                  backgroundColor: apiKeySavedNotice ? '#10B981' : 'var(--color-rose-deep)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  transition: 'background-color 200ms ease',
                }}
              >
                {apiKeySavedNotice ? (
                  <>
                    <Check size={13} /> Saved
                  </>
                ) : (
                  'Apply Settings'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Clean, lightweight formatting helper without emoji clutter or oversized blocks
 */
function renderCleanFormattedMessage(text: string) {
  const parts = text.split('\n');
  return parts.map((line, idx) => {
    // Process markdown **bold**
    const formattedLine = line.split(/(\*\*.*?\*\*)/g).map((seg, sIdx) => {
      if (seg.startsWith('**') && seg.endsWith('**')) {
        return (
          <strong key={sIdx} style={{ fontWeight: 600, color: 'inherit' }}>
            {seg.slice(2, -2)}
          </strong>
        );
      }
      return seg;
    });

    return (
      <div key={idx} style={{ minHeight: line.trim() ? 'auto' : '6px' }}>
        {formattedLine}
      </div>
    );
  });
}
