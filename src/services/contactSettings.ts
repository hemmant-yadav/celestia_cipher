/**
 * Contact Settings Service
 * Manages the emergency recipient phone numbers saved by the user on the page.
 * Persists in localStorage and synchronizes across components.
 */

const STORAGE_KEY_PHONE = 'aura_emergency_phone';
const STORAGE_KEY_PHONE2 = 'aura_emergency_phone2';
const DEFAULT_PRIMARY_PHONE = '+918197149231';

export interface EmergencyContacts {
  primaryPhone: string;
  secondaryPhone: string;
}

type ContactChangeListener = (contacts: EmergencyContacts) => void;

class ContactSettingsService {
  private listeners = new Set<ContactChangeListener>();

  public getContacts(): EmergencyContacts {
    if (typeof window === 'undefined') {
      return { primaryPhone: DEFAULT_PRIMARY_PHONE, secondaryPhone: '' };
    }
    const primary = localStorage.getItem(STORAGE_KEY_PHONE) || DEFAULT_PRIMARY_PHONE;
    const secondary = localStorage.getItem(STORAGE_KEY_PHONE2) || '';
    return {
      primaryPhone: primary.trim(),
      secondaryPhone: secondary.trim(),
    };
  }

  public setPrimaryPhone(phone: string): void {
    if (typeof window !== 'undefined') {
      const clean = phone.trim();
      localStorage.setItem(STORAGE_KEY_PHONE, clean);
      this.notify();
    }
  }

  public setSecondaryPhone(phone: string): void {
    if (typeof window !== 'undefined') {
      const clean = phone.trim();
      localStorage.setItem(STORAGE_KEY_PHONE2, clean);
      this.notify();
    }
  }

  public subscribe(listener: ContactChangeListener): () => void {
    this.listeners.add(listener);
    listener(this.getContacts());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const current = this.getContacts();
    this.listeners.forEach((fn) => {
      try {
        fn(current);
      } catch (err) {
        console.error('ContactSettings listener error:', err);
      }
    });
  }
}

export const contactSettings = new ContactSettingsService();

