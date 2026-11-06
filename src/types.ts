export type TabType = 'home' | 'map' | 'safety' | 'devices' | 'admin';

export type EmergencyActionStatus = 
  | 'idle' 
  | 'sending' 
  | 'sent' 
  | 'delivered' 
  | 'failed' 
  | 'unavailable' 
  | 'not_enabled';

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  notifyOnSos: boolean;
  alertStatus?: EmergencyActionStatus;
}

export interface ConnectedDevice {
  id: string;
  name: string;
  type: 'watch' | 'keychain' | 'iot';
  battery: number;
  status: 'connected' | 'disconnected' | 'syncing';
  lastSeen: string;
}

