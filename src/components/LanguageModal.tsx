import React from 'react';
import { X, Check } from 'lucide-react';
import { useTranslation } from '../services/i18n';

export const LanguageModal: React.FC = () => {
  const { t, language, setLanguage, languages, isLanguageModalOpen, closeLanguageModal } =
    useTranslation();

  if (!isLanguageModalOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 100, // Rendered well above BottomNav (z-index: 40)
        backgroundColor: 'rgba(40, 30, 34, 0.45)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        animation: 'fadeIn 160ms ease-out',
      }}
      onClick={closeLanguageModal}
      role="dialog"
      aria-modal="true"
      aria-label="Select Language"
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: '22px',
          borderTopRightRadius: '22px',
          borderBottomLeftRadius: '28px',
          borderBottomRightRadius: '28px',
          padding: '14px 16px calc(20px + env(safe-area-inset-bottom, 0px))',
          boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.16)',
          animation: 'slideUp 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}
        >
          <div>
            <h3
              style={{
                fontSize: '14.5px',
                fontWeight: 700,
                color: 'var(--color-text)',
                margin: 0,
                letterSpacing: '-0.01em',
              }}
            >
              {t('home.selectLang')}
            </h3>
            <p style={{ fontSize: '10px', color: '#655358', margin: '2px 0 0 0' }}>
              தமிழ் • ಕನ್ನಡ • हिन्दी • తెలుగు • English
            </p>
          </div>

          <button
            onClick={closeLanguageModal}
            aria-label="Close"
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-surface-soft)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-text)',
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* 5 Languages strictly in requested order: Tamil first, then Kannada, Hindi, Telugu, English */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {languages.map((langOpt) => {
            const isSelected = language === langOpt.code;
            return (
              <button
                key={langOpt.code}
                onClick={() => {
                  setLanguage(langOpt.code);
                  closeLanguageModal();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  backgroundColor: isSelected ? 'rgba(217, 141, 157, 0.15)' : 'var(--color-surface-soft)',
                  border: isSelected ? '1.5px solid var(--color-rose-deep)' : '1px solid var(--color-border)',
                  cursor: 'pointer',
                  transition: 'all 120ms ease',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: 'var(--color-rose-deep)',
                      backgroundColor: 'rgba(217, 141, 157, 0.18)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      letterSpacing: '0.04em',
                      fontFamily: 'monospace',
                    }}
                  >
                    {langOpt.code === 'en' ? 'GB' : 'IN'}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>
                    {langOpt.nativeName}
                  </span>
                  <span style={{ fontSize: '11px', color: '#7E6B71', marginLeft: '2px' }}>
                    ({langOpt.name})
                  </span>
                </div>

                {isSelected && (
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-rose-deep)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Check size={11} strokeWidth={2.8} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

